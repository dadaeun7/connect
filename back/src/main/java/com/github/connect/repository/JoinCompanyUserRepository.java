package com.github.connect.repository;

import com.github.connect.constants.RedisCostants;
import com.github.connect.dto.internal.JoinCompnayUser;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class JoinCompanyUserRepository {

    private final ReactiveRedisTemplate<String, Object> reactiveRedisTemplate;

    public Mono<Boolean> saveAuthCode(String key, JoinCompnayUser user){
        return reactiveRedisTemplate.opsForValue().set(key,user, Duration.ofMinutes(5));
    }

    public Mono<Boolean> saveVerifyUser(String key, JoinCompnayUser user){
        return reactiveRedisTemplate.opsForValue().set(key, user, Duration.ofMinutes(5));
    }

    public Mono<Long> deleteAuthCode(String key){
        return reactiveRedisTemplate.delete(key);
    }

    public Mono<Long> deleteVerifyUser(String key){
        return reactiveRedisTemplate.delete(key);
    }

    public Mono<JoinCompnayUser> find(String key){
        return reactiveRedisTemplate.opsForValue().get(key)
        .cast(JoinCompnayUser.class);
    }

    public String redisJoinKey(String email){
        return RedisCostants.JOIN_KEY + email;
    }
    
    public String redisVerifyKey(String email){ return RedisCostants.VERIFY_SUC + email;}
}
