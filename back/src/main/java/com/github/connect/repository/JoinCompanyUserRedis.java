package com.github.connect.repository;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.JoinCompnayUser;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
public class JoinCompanyUserRedis {

    private final ReactiveRedisTemplate<String, Object> reactiveRedisTemplate;

    public JoinCompanyUserRedis(@Qualifier("objRedisTemplate")ReactiveRedisTemplate<String, Object> reactiveRedisTemplate){
        this.reactiveRedisTemplate = reactiveRedisTemplate;
    }

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

    public Mono<Long> getExpiredAt(String key){
        return reactiveRedisTemplate.getExpire(key)
        .map(duration -> {
            if(duration.isNegative() || duration.isZero()){
                return -1L;
            }

            return System.currentTimeMillis() + duration.toMillis();
        });
    }

    public String redisJoinKey(String email){
        return RedisConstants.JOIN_KEY + email;
    }
    
    public String redisVerifyKey(String email){ return RedisConstants.VERIFY_SUC + email;}
}
