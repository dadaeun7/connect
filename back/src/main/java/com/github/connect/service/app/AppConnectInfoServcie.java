package com.github.connect.service.app;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.UserCacheManager;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AppConnectInfoServcie {

    private final AppTokenRedisRepository appTokenRedisRepository;
    private final UserCacheManager userCacheManager;

    public Mono<Map<String,AppTokenCacheDto>> getAppList(@LoginUser String userEmail){

        return userCacheManager.findCacheUserId(userEmail)
        .flatMap(userId->{
            String pattern = String.format("userId:%s:app:*", userId.toString());
            return appTokenRedisRepository.appKeys(pattern)
            .flatMap(key->{
                String provider = key.substring(key.lastIndexOf(":") + 1);
                return appTokenRedisRepository.redisGetValue(userId, provider)
                .map(dto -> Map.entry(provider,dto));
            }).collectMap(Map.Entry::getKey, Map.Entry::getValue);
        });

    }

}
