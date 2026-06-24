package com.github.connect.service.app;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.AppConnectTokenDto;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.AppUUidRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.service.abstr.AppConnectIntegration;
import com.github.connect.util.AesUtil;

import reactor.core.publisher.Mono;

@Service
public class SlackConnectIntegration extends AppConnectIntegration{

    public SlackConnectIntegration(WebClient defauClient, AppUUidRedisRepository appUUidRedisRepository,
            AppConnectRepository appConnectRepository, AppTokenRedisRepository appTokenRedisRepository, AesUtil aseUtil,
            UserCacheManager userCacheManager) {
        super(defauClient, appUUidRedisRepository, appConnectRepository, appTokenRedisRepository, aseUtil, userCacheManager);
    }

    @Override
    protected String getType() {
        return EntityFieldStandardType.APP_SLACK;
    }

    @Override
    protected String getGetTokenUri() {
        return "https://slack.com/oauth/v2/authorize";
    }

    @Override
    protected String getGetUserIdUri() {
        throw new UnsupportedOperationException("Unimplemented method 'getGetUserIdUri'");
    }

    @Override
    public String getProviderName() {
       return "slack";
    }

    @Override
    protected Mono<String> getUserIdFromProvider(AppConnectTokenDto tokenDto) {
        Map<String, Object> authedUser = (Map<String, Object>) tokenDto.getAdditionalProperties().get("authed_user");
        String slackUserId = authedUser.get("id").toString(); 
        return Mono.just(slackUserId);
    }

}
