package com.github.connect.service.app;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.AppUUidRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.service.abstr.AppConnectIntegration;
import com.github.connect.util.AesUtil;

@Service
public class GitHubConnectIntegration extends AppConnectIntegration{
    
    public GitHubConnectIntegration(WebClient defauClient, AppUUidRedisRepository appUUidRedisRepository,
            AppConnectRepository appConnectRepository, AppTokenRedisRepository appTokenRedisRepository, AesUtil aseUtil,
            UserCacheManager userCacheManager) {
        super(defauClient, appUUidRedisRepository, appConnectRepository, appTokenRedisRepository, aseUtil, userCacheManager);
    }

    @Override
    protected String getType() {
       return EntityFieldStandardType.APP_GITHUB;
    }

    @Override
    protected String getGetTokenUri() {
        return "https://github.com/login/oauth/access_token";
    }

    @Override
    protected String getGetUserIdUri() {
        return "https://api.github.com/user";
    }

    @Override
    public String getProviderName() {
        return "github";
    }

}
