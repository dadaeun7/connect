package com.github.connect.event.sync;

import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.NotionDataSourceQueryReqDto;
import com.github.connect.dto.internal.NotionQueryResponse;
import com.github.connect.entity.Activity;
import com.github.connect.repository.ActivityRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.IssueRepository;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotionAppSync {
    
    private final IssueRepository issueRepository;
    private final ActivityRepository activityRepository;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final AesUtil aesUtil;
    private final WebClient defauClient;

    /**
     * [흐름 1] 노션 데이터베이스 연동 이슈 -> '새 페이지 추가' 동기화
     */
    public Flux<Activity> syncActiveNotionDbHistory() {
        String since = Instant.now().minus(15, ChronoUnit.MINUTES).toString();

        return issueRepository.findActiveNotionDbOwnerIds()
            .flatMap(ownerId -> appTokenRedisRepository.redisGetValue(ownerId, EntityFieldStandardType.APP_NOTION)
                .flatMapMany(dto -> 
                    issueRepository.findActiveNotionDbLinksByUserId(ownerId)
                        .flatMap(link -> {
                            log.info("[syncActiveNotionDbHistory] Notion API Token: {}", aesUtil.decrypt(dto.getAccessToken()));
                            String dbId = link.getNotionDbId();
                            return fetchNewNotionPages(dbId, aesUtil.decrypt(dto.getAccessToken()), since)
                            .onErrorResume(e -> {
                                log.error("Notion DB 스케줄러 동기화 실패 (DB ID: {}): {}", dbId, e.getMessage());
                                return Mono.empty(); 
                            })
                            .flatMapMany(Flux::fromIterable)
                            .flatMap(page -> savePageActivityIfAbsent(link.getId(), page)
                                .onErrorResume(e -> {
                                    // DuplicateKeyException 계열 또는 유니크 제약조건 위반인 경우
                                    if (e instanceof org.springframework.dao.DuplicateKeyException 
                                            || (e.getMessage() != null && e.getMessage().contains("violates unique constraint"))) {
                                        log.info("[Notion Sync] 이미 저장된 페이지 액티비티이므로 저장을 건너뜁니다. (이슈 ID: {}, 페이지 ID: {})", link.getId(), page.getId());
                                    } else {
                                        // 그 외의 데이터베이스 연결 오류 등은 에러 로그 출력
                                        log.error("[Notion Sync] 액티비티 저장 중 시스템 에러 발생! 원인: {}", e.getMessage(), e);
                                    }
                                    // 에러가 나면 빈 Mono를 반환
                                    return Mono.empty(); 
                                }));
                        })
                )
            );
    }

    // 새 페이지 조회 (데이터베이스 쿼리 API)
    private Mono<List<NotionQueryResponse.NotionPage>> fetchNewNotionPages(String dataSourceId, String token, String since) {

        NotionDataSourceQueryReqDto requestBody = NotionDataSourceQueryReqDto.builder()
            .filter(NotionDataSourceQueryReqDto.Filter.builder()
                    // 💡 lastEditedTime 필드와 상응하도록 "last_edited_time" 지정
                    .timestamp("last_edited_time")
                    .lastEditedTime(NotionDataSourceQueryReqDto.LastEditedTimeCondition.builder()
                            .after(since) // 예: Instant.now().toString() 또는 ISO-8601 규격 문자열
                            .build())
                    .build())
            .build();

        String targetUrl = String.format("https://api.notion.com/v1/data_sources/%s/query", dataSourceId.trim());

        return defauClient.post()
            .uri(targetUrl)
            .header("Authorization", "Bearer " + token)
            .header("Notion-Version", EntityFieldStandardType.NOTION_API_VERSION)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(NotionQueryResponse.class)
            .map(response -> {
                if (response == null || response.getResults() == null) {
                    // 명시적으로 타입을 제안하여 컴파일러 추론 에러 방지
                    return Collections.<NotionQueryResponse.NotionPage>emptyList();
                }
                return response.getResults();
            })
            .doOnError(err -> log.error("[Notion Sync] 데이터 소스 쿼리 실패 (Data Source ID: {}): {}", dataSourceId, err.getMessage()));

    }
    
    // 새 페이지 저장 (제목과 페이지 URL 포함 메세지 조립)
    private Mono<Activity> savePageActivityIfAbsent(Long issueId, NotionQueryResponse.NotionPage page) {

        String pageTitle = extractTitleFromProperties(page);
        String pageUrl = Objects.nonNull(page.getUrl()) ? page.getUrl() : "";

        // 생성시간과 수정시간이 같으면 '방금 막 생성된 페이지', 다르면 '수정된 페이지'
        boolean isCreated = page.getCreatedTime() != null && page.getCreatedTime().equals(page.getLastEditedTime());

        String actionTitle;
        String content;
        String externalEventId;

        if (isCreated) {
            actionTitle = "[노션 새 페이지 생성]";
            content = String.format(" 데이터베이스에 새 페이지가 추가되었습니다.\n 제목: %s\n", pageTitle);
            externalEventId = "notion:page:created:" + page.getId();
        } else {
            actionTitle = "[노션 페이지 수정]";
            content = String.format(" 데이터베이스 내 페이지가 수정되었습니다.\n 제목: %s\n", pageTitle);
            // 수정 이벤트는 수정될 때마다 쌓이도록 lastEditedTime을 조합하여 유니크 Key 구성
            externalEventId = String.format("notion:page:updated:%s:%s", page.getId(), page.getLastEditedTime());
        }

        String timeStr = isCreated ? page.getCreatedTime() : page.getLastEditedTime();
        Activity activity = new Activity();
            activity.setAppType(EntityFieldStandardType.APP_NOTION);
            activity.setResourceTarget("PAGE");
            activity.setIssueId(issueId);
            activity.setExternalEventId(externalEventId);
            activity.setActivityTitle(actionTitle);
            activity.setActivityContent(content);
            activity.setCreatedAt(OffsetDateTime.parse(timeStr));
            activity.setOriginUrl(pageUrl);

        return activityRepository.save(activity);
    }

    // 노션 Properties 맵에서 타이틀을 안전하게 추출하는 유틸성 헬퍼 메서드
    private String extractTitleFromProperties(NotionQueryResponse.NotionPage page) {
        if (page == null || page.getProperties() == null) {
            return "제목 없음";
        }

        return page.getProperties().values().stream()
            .filter(prop -> "title".equals(prop.getType()) && prop.getTitle() != null)
            .findFirst()
            .map(prop -> {
                String fullTitle = prop.getTitle().stream()
                    .map(titleObj -> {
                        if (titleObj.getPlainText() != null) {
                            return titleObj.getPlainText();
                        }
                        if (titleObj.getText() != null && titleObj.getText().getContent() != null) {
                            return titleObj.getText().getContent();
                        }
                        return "";
                    })
                    .collect(Collectors.joining());

                return fullTitle.trim().isEmpty() ? "(제목 없음)" : fullTitle;
            })
            .orElse("(제목 없음)");
    }


}
