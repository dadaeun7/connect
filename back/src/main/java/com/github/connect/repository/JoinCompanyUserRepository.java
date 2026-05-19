package com.github.connect.repository;

import com.github.connect.constants.RedisCostants;
import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.exception.custom.RedisException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JoinCompanyUserRepository {

    private final RedisTemplate<String, Object> stringRedisTemplate;

    public void saveAuthCode(String key, JoinCompnayUser user){
        stringRedisTemplate.opsForValue().set(key,user, Duration.ofMinutes(5));
    }

    public void saveVerifyUser(String key, JoinCompnayUser user){
        stringRedisTemplate.opsForValue().set(key, user, Duration.ofMinutes(5));
    }

    public void deleteAuthCode(String key){
        stringRedisTemplate.delete(key);
    }

    public void deleteVerifyUser(String key){
        stringRedisTemplate.delete(key);
    }

    public Optional<JoinCompnayUser> find(String key){
        JoinCompnayUser user = (JoinCompnayUser) stringRedisTemplate.opsForValue().get(key);

        if(user == null){
            return Optional.empty();
        }

        return Optional.of(user);

    }

    public String redisJoinKey(String email){
        return RedisCostants.JOIN_KEY + email;
    }
    public String redisVerifyKey(String email){ return RedisCostants.VERIFY_SUC + email;}
}
