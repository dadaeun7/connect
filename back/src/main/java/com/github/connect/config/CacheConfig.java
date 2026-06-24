package com.github.connect.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.AsyncCache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
public class CacheConfig {

    @Bean
    public AsyncCache<String, Long> userCacheBuilder(){
        return Caffeine.newBuilder()
        .expireAfterWrite(12, TimeUnit.HOURS)
        .maximumSize(30000)
        .buildAsync();
    }

    @Bean
    public AsyncCache<Long, String> userIdCacheBuilder(){
        return Caffeine.newBuilder()
        .expireAfterWrite(12, TimeUnit.HOURS)
        .maximumSize(30000)
        .buildAsync();
    }
}
