package com.github.connect.repository;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Mono;

@Repository
@AllArgsConstructor
public class StringRedisRepository {

    private final ReactiveRedisTemplate<String, String> reactiveRedisTemplate;

    public Mono<Boolean> redisSaveKey(String type, String key, String value){
        return reactiveRedisTemplate.opsForValue().set(type+key, value);
    }

    public Mono<String> redisGetValue(String type, String key){
        return reactiveRedisTemplate.opsForValue().get(type+key);
    }

}
