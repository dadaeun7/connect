package com.github.connect.service.abstr;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.ServerRequest;

import com.github.connect.dto.internal.AppConnecInfoDto;
import com.github.connect.dto.internal.AppConnectTokenDto;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.entity.AppConnect;
import com.github.connect.exception.custom.RedisException;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.AppUUidRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
public abstract class AppConnectIntegration{

    protected final WebClient defauClient;
    protected final AppUUidRedisRepository appUUidRedisRepository;
    protected final AppConnectRepository appConnectRepository;
    protected final AppTokenRedisRepository appTokenRedisRepository;
    protected final AesUtil aseUtil;
    protected final UserCacheManager userCacheManager;

// 💡 자식 클래스(구현체)들이 구현하여 고유 값을 제공하도록 추상 메서드로 정의합니다.
    protected abstract String getType();
    protected abstract String getGetTokenUri();
    protected abstract String getGetUserIdUri();

    // 서비스 식별용 키 (컨트롤러 팩토리 라우팅용)
    public abstract String getProviderName();

    public Mono<AppConnectTokenDto> getToken(String state, String code){

        return appUUidRedisRepository.getDtoValue(state)
        .flatMap(dto -> 
            defauClient.post()
            .uri(this.getGetTokenUri())
            .header("Accept", "application/json")
            .bodyValue(Map.of(
                "client_id", dto.getClientId(),
                "client_secret", dto.getSecretKey(),
                "code", code
            ))
            .retrieve()
            .bodyToMono(AppConnectTokenDto.class));
    }

    public Mono<AppConnect> saveAppConnectInfo(AppConnectTokenDto tokenDto, String state){

        return getUserIdFromProvider(tokenDto)
        .flatMap(userId -> {
            return appUUidRedisRepository.getDtoValue(state)
            .flatMap(dto -> {    
                String encodeAccessToken = aseUtil.encrypt(tokenDto.getAccessToken());
                String encodeRefreshToken = aseUtil.encrypt(tokenDto.getRefreshToken());
                String encodeSecretKey = aseUtil.encrypt(dto.getSecretKey());
                return saveRedisAppToken(dto.getUserId(), dto.getClientId(),encodeAccessToken, encodeRefreshToken)
                .flatMap(enused -> {
                    return saveAppConnect(dto.getUserId(),dto.getClientId(), encodeSecretKey, encodeRefreshToken, userId);
                });
            });
        });
    }

    protected Mono<String> getUserIdFromProvider(AppConnectTokenDto tokenDto){
        return defauClient.post()
            .uri(this.getGetUserIdUri())
            .header("Authorization", "Bearer " + tokenDto.getAccessToken())
            .retrieve()
            .bodyToMono(Map.class)
            .map(res -> String.valueOf(res.get("id")));
    }

    private Mono<Void> saveRedisAppToken(Long userId, String clientId, String accessToken, String refreshToken){
        
        AppTokenCacheDto appTokenDto = new AppTokenCacheDto();
        appTokenDto.setClientId(clientId);
        appTokenDto.setAccessToken(accessToken);
        appTokenDto.setRefreshToken(refreshToken);
        
        return appTokenRedisRepository.redisSetKey(userId, this.getType(), appTokenDto)
        .then();
    }

    private Mono<AppConnect> saveAppConnect(Long userId, String clinetId, String secretKey, String refreshToken, String appUserId){
        AppConnect connect = new AppConnect();
        connect.setClientId(clinetId);
        connect.setClientSecret(secretKey);
        connect.setAppPkId(appUserId);
        connect.setUserId(userId);
        connect.setRefreshToken(refreshToken);
        connect.setType(this.getType());
        return appConnectRepository.save(connect);
    }
    
    // protected Mono<AppConnectTokenDto> getAccessToken(String refreshToken){
    // }

    public Mono<String> prepareIntegration(ServerRequest req){
        
        return ReactiveSecurityContextHolder.getContext()
        .map(securityContext -> {
            JwtAuthenticationToken token = (JwtAuthenticationToken) securityContext.getAuthentication();
            return token.getToken().getClaimAsString("email");
        })
        .switchIfEmpty(Mono.error(new IllegalStateException("인증 정보(JWT 토큰)를 찾을 수 없습니다.")))
        .flatMap(userEmail->{
            return req.bodyToMono(Map.class)
            .flatMap(body-> {
                return userCacheManager.findCacheUserId(userEmail)
                .switchIfEmpty(Mono.error(new IllegalStateException("존재하지 않는 유저 이메일입니다: " + userEmail)))
                .flatMap(userId->{
                    String clientId = String.valueOf(body.get("clientId"));
                    String clientSecret = String.valueOf(body.get("clientSecret"));

                    AppConnecInfoDto appConnecInfoDto = new AppConnecInfoDto();
                    appConnecInfoDto.setUserId(userId);
                    appConnecInfoDto.setClientId(clientId);
                    appConnecInfoDto.setSecretKey(clientSecret);

                    String stateUuid = UUID.randomUUID().toString();

                    return appUUidRedisRepository
                        .redisSaveKey(stateUuid, appConnecInfoDto)
                        .flatMap(check -> {
                            if(!check) Mono.error(new RedisException("redis 저장 과정에서 에러 발생"));
                            return Mono.just(stateUuid);
                        });
                });
            });
        });
    }

}