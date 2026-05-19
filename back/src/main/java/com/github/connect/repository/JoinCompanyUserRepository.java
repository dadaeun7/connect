package com.github.connect.repository;

import com.github.connect.constants.RedisCostants;
import com.github.connect.dto.internal.JoinCompnayUser;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
public class JoinCompanyUserRepository {

    /* String, Object 선언 관련 공식 문서 https://docs.spring.io/spring-data/redis/reference/redis/template.html */
    private final RedisTemplate<String, Object> redisTemplate;


    public JoinCompanyUserRepository(RedisTemplate<String,Object> redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    public void saveAuthCode(String name, String email, String code){

        String key = RedisCostants.JOIN_KEY + email;
        JoinCompnayUser user = new JoinCompnayUser(name, email, code);
        redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(5));
    }

    public void saveVerifyUser(String email, JoinCompnayUser user){
        String key = RedisCostants.VERIFY_SUC + email;
        redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(5));
    }

    public void deleteAuthCode(String email){
        String key = RedisCostants.JOIN_KEY + email;
        redisTemplate.delete(key);
    }

    public void deleteVerifyUser(String email){
        String key = RedisCostants.VERIFY_SUC + email;
        redisTemplate.delete(key);
    }

    public Optional<JoinCompnayUser> find(String email){
        String key = RedisCostants.JOIN_KEY + email;
        JoinCompnayUser user = (JoinCompnayUser) redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(user);
    }
}
