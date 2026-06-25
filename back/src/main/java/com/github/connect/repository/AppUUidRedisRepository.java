package com.github.connect.repository;

import java.time.Duration;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.internal.AppConnecInfoDto;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class AppUUidRedisRepository {
    
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    
    public Mono<Boolean> redisSaveKey(String key, AppConnecInfoDto dto){
        return redisTemplate.opsForValue().set(key, dto, Duration.ofMinutes(10));
    }

    public Mono<AppConnecInfoDto> getDtoValue(String key){
        return redisTemplate.opsForValue().get(key).cast(AppConnecInfoDto.class);
    }

    public Mono<Boolean> redisRemove(String key){
        return redisTemplate.opsForValue().delete(key);
    }
}
