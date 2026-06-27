package com.github.connect.service.app;

import java.util.Base64;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.ApiConstants;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.AppConnectTokenDto;
import com.github.connect.dto.internal.AppRefreshDto;
import com.github.connect.dto.internal.AppRefreshToAccessTokenDto;
import com.github.connect.dto.internal.AppTokenCacheDto;
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

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "authorization_code");
            formData.add("code", code);
            formData.add("redirect_uri", ApiConstants.BACK+ApiConstants.APP_CONNECT + "/" + getProviderName());
            
            return defauClient.post()
            .uri(this.getAccessTokenUri())
            .header("Accept", "application/json")
            .header("Authorization", "Basic " + encodedCredentials)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED) // 중요
            .body(BodyInserters.fromFormData(formData))
            .retrieve()
            .bodyToMono(AppConnectTokenDto.class);
        });
    }


    // 토큰을 갱신하려면 다음 헤더를 포함하여 POST요청을 보내십시오.https://api.figma.com/v1/oauth/refreshContent-Type: application/x-www-form-urlencoded
    //  먼저 클라이언트 ID와 클라이언트 시크릿을 콜론(:)으로 구분하여 연결합니다.
    // HTTP Basic Authentication그런  다음, 생성된 문자열을 Base64로 인코딩하여 Authorization 헤더에 포함시킵니다. 
    // 헤더 형식은 다음과 같아야 합니다.client_idclient_secretclient_id:client_secret
    
    public Mono<String> getRefreshAccessToken(String email){
        return userCacheManager.findCacheUserId(email)
        .flatMap(id -> getAppClientInfo(id) // 여기 결과물 변수명을 clientInfo로 변경
            .flatMap(clientInfo -> reqAccessToken(clientInfo)
                .flatMap(accToken -> {
                    AppTokenCacheDto tokenCacheDto = new AppTokenCacheDto();
                    tokenCacheDto.setClientId(clientInfo.clientId());
                    tokenCacheDto.setAccessToken(aseUtil.encrypt(accToken.getAccessToken()));
                    tokenCacheDto.setRefreshToken(aseUtil.encrypt(clientInfo.refreshToken()));

                    return appTokenRedisRepository.redisSetKey(id, this.getProviderName().toUpperCase(), tokenCacheDto)
                        .map(check -> accToken.getAccessToken()); // return 키워드 제거
                })
            ));
    }

    private Mono<AppRefreshToAccessTokenDto> reqAccessToken(AppRefreshDto appInfo){

        String credentials = appInfo.clientId() + appInfo.clientSecret();
        String appCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());


        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("refresh_token", appInfo.refreshToken());

        return defauClient.post()
        .uri("https://api.figma.com/v1/oauth/refresh")
        .header("Accept", "application/json")
        .header("Authorization", "Basic " + appCredentials)
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .body(BodyInserters.fromFormData(formData))
        .retrieve()
        .bodyToMono(AppRefreshToAccessTokenDto.class);
    }

    private Mono<AppRefreshDto> getAppClientInfo(Long userId){
        return appConnectRepository.getClientInfo(userId);
    }

    @Override
    protected Mono<String> getUserIdFromProvider(AppConnectTokenDto tokenDto) {
        String externalUserId = tokenDto.getAdditionalProperties().get("user_id_string").toString();
        return Mono.just(externalUserId);
    }

    @Override
    protected String getGetUserIdUri() {
        throw new UnsupportedOperationException("Unimplemented method 'getGetUserIdUri'");
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
