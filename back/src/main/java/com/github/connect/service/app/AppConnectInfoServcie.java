package com.github.connect.service.app;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.SlackHookInfoRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AppConnectInfoServcie {

    private final AppConnectRepository appConnectRepository;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final UserCacheManager userCacheManager;
    private final SlackHookInfoRedisRepository slackHookInfoRedisRepository;
    private final AesUtil aesUtil;

    public Mono<Map<String,AppTokenCacheDto>> getAppList(@LoginUser String userEmail){

        return userCacheManager.findCacheUserId(userEmail)
        .flatMap(userId->{
            String pattern = String.format("userId:%s:app:*", userId.toString());
            return appTokenRedisRepository.appKeys(pattern)
            .flatMap(key->{
                String provider = key.substring(key.lastIndexOf(":") + 1);
                return appTokenRedisRepository.redisGetValue(userId, provider)
                .map(dto -> Map.entry(provider,dto));
            })
            .collectMap(Map.Entry::getKey, Map.Entry::getValue);
        });

    }

    public Mono<Void> deleteAppInfo(String email, String type){
        boolean isSlack = EntityFieldStandardType.APP_SLACK.equals(type);

        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> {
                // 1. 공통 삭제 작업
                Mono<Void> deleteAppDb = appConnectRepository.deleteAppInfo(id, type);
                Mono<Void> deleteAppToken = appTokenRedisRepository.redisDeleteValue(id, type);

                // 2. SLACK이 아닌 경우 기본 삭제만 실행
                if (!isSlack) {
                    return Mono.when(deleteAppDb, deleteAppToken);
                }

                // 3. SLACK인 경우 slackPkId 조회 후 추가 삭제까지 함께 실행
                return appConnectRepository.getAppPkId(id)
                        .flatMap(slackPkId -> Mono.when(
                                deleteAppDb,
                                deleteAppToken,
                                slackHookInfoRedisRepository.redisDeleteValue(slackPkId)
                        ));
            });
    }

}
