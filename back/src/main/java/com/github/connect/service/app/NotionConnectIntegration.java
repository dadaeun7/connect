package com.github.connect.service.app;
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
public class NotionConnectIntegration extends AppConnectIntegration{

    public NotionConnectIntegration(WebClient defauClient, AppUUidRedisRepository appUUidRedisRepository,
            AppConnectRepository appConnectRepository, AppTokenRedisRepository appTokenRedisRepository, AesUtil aseUtil,
            UserCacheManager userCacheManager) {
        super(defauClient, appUUidRedisRepository, appConnectRepository, appTokenRedisRepository, aseUtil, userCacheManager);
    }

    @Override
    protected String getType() {
        return EntityFieldStandardType.APP_NOTION;
    }

    @Override
    protected String getAccessTokenUri() {
        return "https://api.notion.com/v1/oauth/token";

        // 관련 문서 https://developers.notion.com/guides/get-started/authorization#step-4-notion-responds-with-an-access_token--refresh_token-and-additional-information
        
        // POST /v1/oauth/token HTTP/1.1
        // Authorization: Basic "$CLIENT_ID:$CLIENT_SECRET"
        // Content-Type: application/json
        // {"grant_type":"authorization_code",
        // "code":"authorization으로 받은 코드", "
        // redirect_uri":"https://example.com/auth/notion/callback"}

    }

    @Override
    protected String getGetUserIdUri() {
        throw new UnsupportedOperationException("Unimplemented method 'getGetUserIdUri'");
    }

    @Override
    public String getProviderName() {
        return "notion";
    }

    @Override
    protected Mono<String> getUserIdFromProvider(AppConnectTokenDto tokenDto) {
        // tokenDto 내부 응답 바디 맵이나 필드에서 직접 추출 (예: workspace_id 또는 owner.user.id)
        String externalUserId = tokenDto.getAdditionalProperties().get("workspace_id").toString();
        return Mono.just(externalUserId);
    }

    @Override
    protected String getGetCodeUri() {
        return "https://api.notion.com/v1/oauth/authorize";
    }

}
