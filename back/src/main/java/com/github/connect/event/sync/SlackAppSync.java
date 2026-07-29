package com.github.connect.event.sync;

import java.time.Clock;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.request.SlackEventReq;
import com.github.connect.dto.response.SlackThreadResponse;
import com.github.connect.entity.NewIssue;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.NewIssueRepository;
import com.github.connect.repository.SlackHookInfoRedisRepository;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlackAppSync {

    //dto 확인용
    private final ObjectMapper objectMapper = new ObjectMapper();
    // ---------------------------------------------
    private final WebClient defauClient;
    private final NewIssueRepository newIssueRepository;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final SlackHookInfoRedisRepository slackHookInfoRedisRepository;
    private final AesUtil aesUtil;
    private final Clock clock;

    public Mono<Void> saveSlackEvent(SlackEventReq reqDto){
        return slackHookInfoRedisRepository.redisGetValue(reqDto.getTeamId())
        .doOnNext(dto -> log.info("[Slack Sync] Redis 조회 성공: keyword={}", dto.getKeyword()))
        .switchIfEmpty(Mono.defer(() -> {
            log.warn("[Slack Sync] Redis에 저장된 teamId 정보가 없습니다: teamId={}", reqDto.getTeamId());
            return Mono.empty();
        }))
        .flatMap(dto -> processSlackThreadMessage(dto.getKeyword(), dto.getUserId(), reqDto));
    }

    private Mono<Void> processSlackThreadMessage(String keyword, Long userId, SlackEventReq reqDto) {

        try {
            String jsonPayload = objectMapper.writeValueAsString(reqDto);
            log.info("[Slack Sync Raw Payload] {}", jsonPayload);
        } catch (Exception e) {
            log.error("Payload 변환 실패", e);
        }

        SlackEventReq.EventDetail event = reqDto.getEvent();
        String teamId = reqDto.getTeamId();

        String channelId = event.getChannel();
        String replyText = event.getText();

        String targetTs = (event.getThreadTs() != null) ? event.getThreadTs() : event.getTs();

        // 1. 답글(Thread)이 아니거나 내용이 없으면 스킵
        if (replyText == null || replyText.isBlank()) {
            log.info("[processSlackThreadMessage]  답글(Thread)이 아니거나 내용이 없어 스킵됐습니다.");
            return Mono.empty();
        }

        // 2. 키워드 매칭 검사
        if (!replyText.toLowerCase().contains(keyword.toLowerCase())) {
            log.info("[processSlackThreadMessage] 키워드 매칭 검사에 실패했습니다.");
            return Mono.empty();
        }

        // 3. OAuth로 저장해둔 유저의 AccessToken을 Redis에서 가져옴
        return appTokenRedisRepository.redisGetValue(userId, EntityFieldStandardType.APP_SLACK)
            .flatMap(tokenDto -> {
                String userAccessToken = aesUtil.decrypt(tokenDto.getAccessToken());

                // targetTs를 전달하여 메시지 원본 조회
                return fetchParentMessageContent(channelId, targetTs, userAccessToken)
                    .flatMap(parentContent -> {
                        
                        String formattedTs = targetTs.replace(".", "");
                        String slackMessageUrl = String.format("https://slack.com/archives/%s/p%s", channelId, formattedTs);

                        NewIssue newIssue = new NewIssue();
                        newIssue.setMatchKeyword(keyword);
                        newIssue.setStatus(EntityFieldStandardType.ISSUE_OPEN);
                        newIssue.setCreatedAt(OffsetDateTime.now(clock));
                        newIssue.setTeamId(teamId);
                        newIssue.setUserId(userId);
                        newIssue.setOriginalMessage(parentContent);
                        newIssue.setSlackUrl(slackMessageUrl);
                        newIssue.setDetectedMessage(replyText);

                        return newIssueRepository.save(newIssue);
                    });
            })
            .doOnError(err -> log.error("[Slack Sync] 처리 중 오류 발생: {}", err.getMessage(), err))
            .then();
    }

    private Mono<String> fetchParentMessageContent(String channelId, String threadTs, String slackAccessToken) {
        return defauClient.get()
            .uri(uriBuilder -> uriBuilder
                .scheme("https")
                .host("slack.com")
                .path("/api/conversations.replies")
                .queryParam("channel", channelId)
                .queryParam("ts", threadTs)
                .queryParam("limit", 1) // 부모 메시지 1개만 필요하므로 limit 1 지정
                .build())
            .header("Authorization", "Bearer " + slackAccessToken)
            .retrieve()
            .bodyToMono(SlackThreadResponse.class)
            .flatMap(res -> {
                if (!res.isOk() || res.getMessages() == null || res.getMessages().isEmpty()) {
                    log.error("[Slack API] 원본 메시지 조회 실패: {}", res.getError());
                    return Mono.error(new IllegalStateException("Slack API 오류: " + res.getError()));
                }
                // 목록의 첫 번째 요소가 원본(부모) 메시지입니다.
                return Mono.just(res.getMessages().get(0).getText());
            })
            .doOnError(err -> log.error("[Slack API] 원본 메시지 조회 중 에러: {}", err.getMessage()));
    }
}
