package com.github.connect.service.app;

import java.util.Base64;
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
    protected String getAccessTokenUri() {
        return "https://api.figma.com/v1/oauth/token";

        // 관련문서: https://developers.figma.com/docs/rest-api/oauth-apps/

        // Content-Type: application/x-www-form-urlencoded
        // client_idclient_secretclient_id:client_secret
        // Authorization: Basic <BASE64_ENCODED_CLIENT_ID_AND_SECRET>

        // redirect_uri=:callback&code=:code&grant_type=authorization_code

        // 리디렉션_uri	이는 원래 제공된 리디렉션 URI와 일치해야 하며, 코드는 콜백에 제공된 인증 코드와 일치해야 합니다.
        // code	이것은 콜백 요청에서 제공된 코드입니다.
        // grant_type	이것은 authorization_code여야 합니다.
        // code_verifier	PKCE 방식을 사용한 경우, 코드 챌린지를 생성하는 데 사용한 검증 도구를 제공해야 합니다.
    }


    @Override
    public Mono<AppConnectTokenDto> getToken(String state, String code){

        return appUUidRedisRepository.getDtoValue(state)
        .switchIfEmpty(Mono.error(new IllegalArgumentException("만료되었거나, 존재하지 않는 state 입니다.")))
        .flatMap(dto -> {
            String credentials = dto.getClientId()+":"+dto.getSecretKey();
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

            return defauClient.post()
            .uri(this.getAccessTokenUri())
            .header("Accept", "application/json")
            .header("Authorization", "Basic " + encodedCredentials)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED) // 중요
            .bodyValue(Map.of(
                "grant_type", "authorization_code",
                "code", code,
                "redirect_uri", ApiConstants.BACK+ApiConstants.APP_CONNECT + "/" + getProviderName()
            ))
            .retrieve()
            .bodyToMono(AppConnectTokenDto.class);
        });
    }


    @Override
    protected String getGetUserIdUri() {
       return "https://api.figma.com/v1/me";
    }

    @Override
    public String getProviderName() {
        return "figma";
    }

    @Override
    protected String getGetCodeUri() {
        return "https://www.figma.com/oauth";
    }

}
