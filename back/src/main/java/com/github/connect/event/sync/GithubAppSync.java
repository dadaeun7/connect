package com.github.connect.event.sync;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.entity.Activity;
import com.github.connect.repository.ActivityRepository;
import com.github.connect.repository.IssueRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class GithubAppSync {

    private final ActivityRepository activityRepository;
    private final IssueRepository issueRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    
    public Mono<Void> processGithubEvent(String queueDate){
        return Mono.fromCallable(()->{
            JsonNode wrapperNode = objectMapper.readTree(queueDate);
            String eventType = wrapperNode.get("event_type").asText();
            JsonNode payload = objectMapper.readTree(wrapperNode.get("payload").asText());
            
            return Map.entry(eventType, payload);
        })
        .flatMap(entry -> {
            String eventType = entry.getKey();
            JsonNode payload = entry.getValue();
            String repoFullName = payload.get("repository").get("full_name").asText();

            return switch (eventType) {
                case "push" -> handlePush(repoFullName, payload);
                case "commit_comment" -> handleCommitComment(repoFullName, payload);
                default -> Mono.empty();
            };
        })
        .onErrorResume(e -> {
            log.error("Failed to parse GitHub queue data", e);
            return Mono.empty();
        });
    }

    // 1. Push 이벤트 처리
    private Mono<Void> handlePush(String repoFullName, JsonNode payload) {
        JsonNode headCommit = payload.get("head_commit");
        if (headCommit == null || headCommit.isNull()) return Mono.empty();

        String commitSha = headCommit.get("id").asText();
        String author = headCommit.get("author").get("name").asText();
        String message = headCommit.get("message").asText();

        String commitUrl = headCommit.has("url") ? headCommit.get("url").asText() : "";
        
        String externalEventId = "github:commit:" + commitSha;
        String content = String.format("[Push] %s님이 커밋을 푸시했습니다: %s", author, message);

        String type = "commit";
        
        return saveActivityToActiveIssues(repoFullName, externalEventId, content, type, commitUrl);
    }

    // 3. Commit Comment 이벤트 처리
    private Mono<Void> handleCommitComment(String repoFullName, JsonNode payload) {
        JsonNode commentNode = payload.get("comment");
        String commentId = commentNode.get("id").asText();
        String user = commentNode.get("user").get("login").asText();
        String body = commentNode.get("body").asText();
        
        String externalEventId = "github:commit_comment:" + commentId;
        String content = String.format("%s: %s", user, body);

        String commentUrl = commentNode.has("html_url") ? commentNode.get("html_url").asText() : "";

        String type = "comment";
        return saveActivityToActiveIssues(repoFullName, externalEventId, content, type, commentUrl);
    }

    private Mono<Void> saveActivityToActiveIssues(String repoFullName, String externalEventId, String content, String type, String commitUrl) {
        return issueRepository.findActiveIssueIdsByRepo(repoFullName)
            .flatMap(issueId -> {
                Activity activity = new Activity();
                activity.setAppType(EntityFieldStandardType.APP_GITHUB);
                activity.setIssueId(issueId);
                activity.setResourceTarget(type.equals("comment") ? "COMMIT_COMMENT" : "COMMIT");
                activity.setExternalEventId(externalEventId);
                activity.setActivityTitle(type.equals("comment") ? "[GitHub] 커밋 댓글 등록": "[Github] 커밋 등록");
                activity.setActivityContent(content);
                activity.setOriginUrl(commitUrl);
                activity.setCreatedAt(OffsetDateTime.now(clock));

                return activityRepository.save(activity)
                    .onErrorResume(e -> {
                        log.error("Github Queue event Activity 저장 중 에러 : issueId={}, eventId={}", issueId, externalEventId);
                        return Mono.empty();
                    });
            })
            .then();
    }
}
