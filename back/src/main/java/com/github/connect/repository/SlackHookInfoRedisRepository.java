package com.github.connect.repository;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.SlackHookInfoDto;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class SlackHookInfoRedisRepository {
    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    public Mono<SlackHookInfoDto> redisGetValue(String teamId){
        return redisTemplate.opsForValue().get(RedisConstants.SLACK_TEAM_ID+teamId)
            .cast(SlackHookInfoDto.class);
    }

    public Mono<Boolean> redisSetKey(String teamId, SlackHookInfoDto dto){
        return redisTemplate.opsForValue().set(RedisConstants.SLACK_TEAM_ID+teamId, dto);
    }

    public Mono<Void> redisDeleteValue(String teamId){
        return redisTemplate.delete(RedisConstants.SLACK_TEAM_ID+teamId).then();
    }
}
