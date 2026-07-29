package com.github.connect.controller;

import java.util.Map;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.request.SlackEventReq;
import com.github.connect.event.sync.SlackAppSync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {
    
    private final ReactiveRedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final SlackAppSync slackAppSync;

    @PostMapping("/slack")
    public Mono<ResponseEntity<String>> handleSlackEvent(@RequestBody SlackEventReq payload) {
        
        // 1. 슬랙 App 설정 시 최초 1회 발생하는 URL 검증 핸들링
        if ("url_verification".equals(payload.getType())) {
            return Mono.just(ResponseEntity.ok(payload.getChallenge()));
        }

        // 2. 이벤트 수신 시 non-blocking으로 처리 수행 후 즉시 200 OK 응답 (Slack 3초 Retry 방지)
        if ("event_callback".equals(payload.getType()) && payload.getEvent() != null) {
            // 봇 메시지 등 예외 subtype은 무시
            if (payload.getEvent().getSubtype() == null) {
                slackAppSync.saveSlackEvent(payload)
                    .subscribe(
                        null, 
                        err -> log.error("[Slack Event Error] 이슈 생성 중 에러: {}", err.getMessage())
                    );
            }
        }

        return Mono.just(ResponseEntity.ok("OK"));
    }
    
    @PostMapping("/github")
    public Mono<ResponseEntity<Void>> handleGithubWebhook(
            @RequestHeader("X-GitHub-Event") String eventType,
            @RequestBody String payload) {
        
        return Mono.fromCallable(() -> {
            // 임의의 Map 구조 -> 단순 Jackson ObjectMapper를 통해 문자열로 변경
            Map<String, Object> wrapper = Map.of(
                "event_type", eventType,
                "payload", payload
            );
            return objectMapper.writeValueAsString(wrapper);
        })
        // 순수 String 템플릿을 사용하여 저장, 다형성 검증 없이 적재
        .flatMap(queuePayload -> redisTemplate.opsForList().rightPush(RedisConstants.GITHUB_QUEUE, queuePayload))
        .doOnSuccess(len -> log.debug("Queued GitHub event [{}]. Queue size: {}", eventType, len))
        .doOnError(e -> log.error("Failed to queue GitHub webhook", e))
        .map(result -> ResponseEntity.ok().build());
    }
}
