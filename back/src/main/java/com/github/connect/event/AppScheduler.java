package com.github.connect.event;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.github.connect.constants.RedisConstants;
import com.github.connect.event.sync.FigmaAppSync;
import com.github.connect.event.sync.GithubAppSync;
import com.github.connect.event.sync.NotionAppSync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppScheduler {
    
    private final FigmaAppSync figmaAppSync;
    private final GithubAppSync githubAppSync;
    private final NotionAppSync notionAppSync;
    private final ReactiveRedisTemplate<String, String> template;

    @Scheduled(fixedDelay = 1000)
    public void consumeGithubEvents() {
        template.opsForList().leftPop(RedisConstants.GITHUB_QUEUE)
                .flatMap(githubAppSync::processGithubEvent)
                .subscribe(
                    null,
                    err -> log.error("Error occurred in GitHub webhook consumer", err)
                );
    }

    @Scheduled(initialDelay = 5, fixedDelay = 15, timeUnit = TimeUnit.MINUTES)
    public void syncNorionHistories(){
        log.info("스케줄링 작업을 시작합니다. [노션, 피그마]");

        Flux.merge(
            notionAppSync.syncActiveNotionDbHistory(),
            figmaAppSync.syncActiveFigmaHistory(),
            figmaAppSync.syncActiveFigmaCommentHistory()
        )
        .subscribe(
            activity -> log.debug("Synced activity: {}", activity.getExternalEventId()),
            error -> log.error("Error occurred during Notion synchronization", error),
            () -> log.info("Figma, Notion history synchronization process completed.")
        );
    }
}
