package com.github.connect.service.app;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.ApiConstants;
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
    protected String getAccessTokenUri() {
        return "https://github.com/login/oauth/access_token";
        // 관련 문서: https://docs.slack.dev/reference/methods/oauth.v2.user.access

        //  Accept: application/json 또는 Accept: application/xml
        // client_id	string	필수	GitHub에 사용하기 위해 OAuth app에서 받은 클라이언트 ID입니다.
        // client_secret	string	필수	GitHub에 사용하기 위해 OAuth app에서 받은 클라이언트 암호입니다.
        // code	string	필수	1단계에 대한 응답으로 받은 코드입니다.
        // redirect_uri	string	매우 권장	권한 부여 후 사용자가 전송되는 애플리케이션의 URL입니다. 이를 사용하여 code가 발급될 때 원래 제공된 URI와 대조하여 서비스에 대한 공격을 방지할 수 있습니다.
        // code_verifier	string	매우 권장	PKCE(코드 교환용 증명 키)로 인증 흐름을 보호하는 데 사용됩니다. 사용자 권한 부여 중에 code_challenge가 전송된 경우 필수입니다. 권한 부여 요청에서 code_challenge를 생성하는 데 사용된 원래 값이어야 합니다. 이 값은 애플리케이션 아키텍처에 따라 인증 중에 state 매개 변수와 함께 쿠키에 저장되거나 세션 변수에 저장할 수 있습니다.

    }

    @Override
    public Mono<AppConnectTokenDto> getToken(String state, String code){

        return appUUidRedisRepository.getDtoValue(state)
        .switchIfEmpty(Mono.error(new IllegalArgumentException("만료되었거나, 존재하지 않는 state 입니다.")))
        .flatMap(dto -> 
            defauClient.post()
            .uri(this.getAccessTokenUri())
            .header("Accept", "application/json")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(Map.of(
                "client_id", dto.getClientId(),
                "client_secret", dto.getSecretKey(),
                "code", code,
                "redirect_uri", ApiConstants.BACK+ApiConstants.APP_CONNECT + "/" + getProviderName()
            ))
            .retrieve()
            .bodyToMono(AppConnectTokenDto.class)
        );
    }

    @Override
    protected Mono<String> getUserIdFromProvider(AppConnectTokenDto tokenDto){
        return defauClient.get()
            .uri(this.getGetUserIdUri())
            .header("Authorization", "Bearer " + tokenDto.getAccessToken())
            .header("Accept", "application/vnd.github+json")
            .header("X-GitHub-Api-Version", "2026-03-10")
            .retrieve()
            .bodyToMono(Map.class)
            .map(res -> String.valueOf(res.get("id")));
    }

    @Override
    protected String getGetCodeUri() {
        return "https://github.com/login/oauth/authorize";
    }

    @Override
    protected String getGetUserIdUri() {
        // 관련 문서 https://docs.github.com/ko/rest/users/users?apiVersion=2026-03-10
        return "https://api.github.com/user";
    }

    @Override
    public String getProviderName() {
        return "github";
    }

}
