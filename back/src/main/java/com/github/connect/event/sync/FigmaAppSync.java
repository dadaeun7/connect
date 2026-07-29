package com.github.connect.event.sync;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.FigmaCommentResponse;
import com.github.connect.dto.internal.FigmaHistoryResponse;
import com.github.connect.entity.Activity;
import com.github.connect.repository.ActivityRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.IssueRepository;
import com.github.connect.service.app.FigmaConnectIntegration;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class FigmaAppSync {

    private final IssueRepository issueRepository;
    private final ActivityRepository activityRepository;
    private final WebClient defauClient;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final AesUtil aesUtil;
    private final FigmaConnectIntegration figmaConnectIntegration;

    public Flux<Activity> syncActiveFigmaHistory() {
        return issueRepository.findActiveFigmaOwnerIds()
            .flatMap(ownerId -> issueRepository.findActiveFigmaLinksByUserId(ownerId)
                .flatMap(link -> fetchAndSaveFigmaHistory(ownerId, link.getFigmaFileKey(), link.getId()))
            );
    }

    public Flux<Activity> syncActiveFigmaCommentHistory() {
        Instant since = Instant.now().minus(15, ChronoUnit.MINUTES);

        return issueRepository.findActiveFigmaOwnerIds()
            .flatMap(ownerId -> appTokenRedisRepository.redisGetValue(ownerId, EntityFieldStandardType.APP_FIGMA)
                .flatMapMany(dto -> 
                    issueRepository.findActiveFigmaLinksByUserId(ownerId)
                        .flatMap(link -> {
                            String fileKey = link.getFigmaFileKey();
                            String decryptedToken = aesUtil.decrypt(dto.getAccessToken());

                            // 피그마 댓글 API 호출 및 처리
                            return fetchNewFigmaComments(fileKey, decryptedToken, since)
                                    .onErrorResume(e -> {
                                        log.info("[syncActiveFigmaCommentHistory] Figma Access Token 만료로 재발급 시도합니다");
                                        return figmaConnectIntegration.getRefreshAccessTokenByUserId(ownerId)
                                            .flatMap(newToken -> fetchNewFigmaComments(fileKey, newToken, since));
                            })
                            .flatMapMany(Flux::fromIterable)
                            .flatMap(comment -> saveFigmaCommentIfAbsent(link.getId(), comment));
                        })
                )
            );
    }

    private Mono<FigmaHistoryResponse> requestFigmaHistory(String figmaFileKey, String accessToken){

        return defauClient.get()
        .uri("https://api.figma.com/v1/files/{fileKey}/versions", figmaFileKey)
        .header("Authorization", "Bearer " + accessToken)
        .retrieve()
        .bodyToMono(FigmaHistoryResponse.class)
        .doOnError(error -> log.error("[requestFigmaHistory] fileKey: {}, accessToken: {}, error: {}",
            figmaFileKey, accessToken, error.getMessage()
        ));
    }

    private Mono<List<FigmaCommentResponse.FigmaComment>> fetchNewFigmaComments(String fileKey, String accessToken, Instant since) {

        return defauClient.get()
            .uri("https://api.figma.com/v1/files/{file_key}/comments", fileKey)
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(FigmaCommentResponse.class)
            .map(response -> {
                // response가 비어있거나 comments 리스트가 null인 경우 빈 리스트 반환
                if (response == null || response.getComments() == null) {
                    return List.<FigmaCommentResponse.FigmaComment>of();
                }
                
                // API가 반환한 댓글 중 15분 전(since) 이후에 생성된 댓글만 필터링
                return response.getComments().stream()
                        .filter(comment -> {
                            try {
                                return Instant.parse(comment.getCreatedAt()).isAfter(since);
                            } catch (Exception e) {
                                return false; // 날짜 포맷 파싱 에러 방어
                            }
                        })
                        .collect(Collectors.toList());
            })
            .doOnError(e -> log.error("Failed to fetch Figma comments for file: {} error: {}", fileKey, e.getMessage()))
            // 2. 에러가 나더라도 전체 스케줄러 스트림이 터지지 않도록 빈 리스트로 복구
            .onErrorResume(e -> Mono.just(List.of()));
    }

    private Mono<Activity> saveFigmaCommentIfAbsent(Long issueId, FigmaCommentResponse.FigmaComment comment) {
        String externalEventId = "figma:comment:" + comment.getId();

        log.info("[Figma Comment] 유니크 제약 확인하기 -> issue_id : {} externalEventId : {} ", issueId, externalEventId);

        String author = comment.getUser() != null ? comment.getUser().getHandle() : "알 수 없는 사용자";
        String content = String.format(" 작성자 %s님: %s", author, comment.getMessage());

        Activity activity = new Activity();
                activity.setAppType(EntityFieldStandardType.APP_FIGMA);
                activity.setIssueId(issueId);
                activity.setExternalEventId(externalEventId);
                activity.setResourceTarget("COMMENT");
                activity.setActivityTitle("[피그마 새 댓글]");
                activity.setActivityContent(content);
                activity.setCreatedAt(OffsetDateTime.parse(comment.getCreatedAt()));

        return activityRepository.save(activity)
                .onErrorResume(e -> Mono.empty()); // 중복 에러 발생 시 무시
    }
    
    private Flux<Activity> fetchAndSaveFigmaHistory(Long userId, String fileKey, Long issueId){

        return appTokenRedisRepository.redisGetValue(userId, EntityFieldStandardType.APP_FIGMA)
            .flatMap(dto -> requestFigmaHistory(fileKey, aesUtil.decrypt(dto.getAccessToken()))
                .onErrorResume(e -> {
                    log.info("Figma Access Token 만료로 재발급 시도합니다");
                    return figmaConnectIntegration.getRefreshAccessTokenByUserId(userId)
                        .flatMap(newToken -> requestFigmaHistory(fileKey, newToken));
                })
            )
        .flatMapMany(response -> { 
            if (response.getVersions() == null || response.getVersions().isEmpty()) {
                return Flux.<FigmaHistoryResponse.Version>empty(); // 명시적 제네릭 타입 제공
            }
            return Flux.fromIterable(response.getVersions());
        })
        .map(version -> saveFigmaHistoryToActivity(issueId, fileKey, version))
        .flatMap(activityRepository::save);
    }

    private Activity saveFigmaHistoryToActivity(Long issueId, String figmaFileKey, FigmaHistoryResponse.Version version){
        
        Activity activity = new Activity();
        activity.setIssueId(issueId); // 이제 정상 작동
        activity.setAppType(EntityFieldStandardType.APP_FIGMA);
        activity.setResourceTarget("FIGMA_HISTORY");
        activity.setExternalEventId(version.getId());
        

        String title = version.getLabel() != null ? version.getLabel() : "[피그마] 새로운 히스토리";
        activity.setActivityTitle(title);
        
        String content = String.format("[%s 님 생성] %s", 
            version.getUser().getHandle(), 
            version.getDescription() != null ? version.getDescription() : "기재된 설명이 없습니다."
        );
        activity.setActivityContent(content);
        
        activity.setCreatedAt(OffsetDateTime.parse(version.getCreatedAt()));
        
        String originUrl = String.format("https://www.figma.com/file/%s?version-id=%s", figmaFileKey, version.getId());
        activity.setOriginUrl(originUrl);
        
        return activity;
    }
}
