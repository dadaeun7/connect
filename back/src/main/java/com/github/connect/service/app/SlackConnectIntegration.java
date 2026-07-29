package com.github.connect.service.app;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
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
    protected String getAccessTokenUri() {
        return "https://slack.com/api/oauth.v2.access";
        // 관련 문서 https://docs.slack.dev/reference/methods/oauth.v2.user.access
        // 클라이언트 ID	클라이언트 ID 값	code이 값은 메서드 로 전송하기 위한 값과 함께 사용됩니다 oauth.v2.access.
        // 고객 비밀	클라이언트 시크릿 의 가치	code이 값은 메서드 로 전송하기 위한 값과 함께 사용됩니다 oauth.v2.access.
    }
    
    @Override
    public Mono<AppConnectTokenDto> getToken(String state, String code){

        return appUUidRedisRepository.getDtoValue(state)
        .switchIfEmpty(Mono.error(new IllegalArgumentException("만료되었거나, 존재하지 않는 state 입니다.")))
        .flatMap(dto -> {

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", dto.getClientId());
            formData.add("client_secret", dto.getSecretKey());
            formData.add("code", code);
            formData.add("grant_type", "authorization_code");
            formData.add("redirect_uri", ApiConstants.BACK+ApiConstants.APP_CONNECT + "/"+getProviderName());

            return defauClient.post()
            .uri(this.getAccessTokenUri())
            .header("Accept", "application/json")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(BodyInserters.fromFormData(formData))
            .retrieve()
            .bodyToMono(AppConnectTokenDto.class);
        });
    }


    @Override
    protected String getGetCodeUri() {
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
        Map<String, Object> additionalProps = tokenDto.getAdditionalProperties();

        // team 객체에서 team.id 추출
        Map<String, Object> teamInfo = (Map<String, Object>) additionalProps.get("team");
        String teamId = teamInfo.get("id").toString(); // 예: T012345678

        // TODO: 유저 식별자 또는 이 팀 ID를 연동 저장소(Redis/DB)의 Key로 활용
        return Mono.just(teamId);
    }

}
