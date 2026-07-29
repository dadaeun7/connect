package com.github.connect.repository;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.AppTokenCacheDto;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class AppTokenRedisRepository {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    public Mono<AppTokenCacheDto> redisGetValue(Long userId, String app){
        return redisTemplate.opsForValue().get(RedisConstants.USER_ID_KEY+userId+RedisConstants.APP_KEY+app).cast(AppTokenCacheDto.class);
    }

    public Mono<Boolean> redisSetKey(Long userId, String app, AppTokenCacheDto dto){
        return redisTemplate.opsForValue().set(RedisConstants.USER_ID_KEY+userId+RedisConstants.APP_KEY+app, dto);
    }

    public Flux<String> appKeys(String pattern){
        return redisTemplate.keys(pattern);
    }

    public Mono<Void> redisDeleteValue(Long userId, String app){
        return redisTemplate.delete(RedisConstants.USER_ID_KEY+userId+RedisConstants.APP_KEY+app).then();
    }
}
