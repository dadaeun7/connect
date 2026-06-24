package com.github.connect.service.app;

import java.util.Map;

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
public class FigmaConnectIntegration extends AppConnectIntegration{

    public FigmaConnectIntegration(WebClient defauClient, AppUUidRedisRepository appUUidRedisRepository,
            AppConnectRepository appConnectRepository, AppTokenRedisRepository appTokenRedisRepository, AesUtil aseUtil,
            UserCacheManager userCacheManager) {
        super(defauClient, appUUidRedisRepository, appConnectRepository, appTokenRedisRepository, aseUtil, userCacheManager);
    }

    @Override
    protected String getType() {
        return EntityFieldStandardType.APP_FIGMA;
    }

    @Override
    protected String getGetTokenUri() {
        return "https://www.figma.com/api/v1/oauth/token";
    }

    @Override
    protected String getGetUserIdUri() {
       return "https://api.figma.com/v1/me";
    }

    @Override
    public String getProviderName() {
        return "figma";
    }

}
