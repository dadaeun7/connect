package com.github.connect.service.user;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.KeycloakAccessTokenDto;
import com.github.connect.exception.custom.UserExpirationException;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.repository.StringRedisRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserRefreshToAccessService {

    private final WebClient keycloakClient;
    private final StringRedisRepository stringRedisRepository;
    private final KeycloakProperties keycloakProperties;
    
    public Mono<String> getReAccessToken(String email){
        return stringRedisRepository.redisGetValue(RedisConstants.authRedisKey, email)
        .flatMap(refreshToken -> refreshToAccessToken(email, refreshToken))
        .map(String::toString);
    }

    private Mono<String> refreshToAccessToken(String email, String refreshToken){
        return keycloakClient.post()
        .uri(keycloakProperties.getBaseUrl() + "/realms/" + keycloakProperties.getClientId() + "/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", keycloakProperties.getClientId())
            .with("client_secret", keycloakProperties.getSecretClient())
            .with("username", email)
            .with("refresh_token", refreshToken)
            .with("grant_type", "refresh_token"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response->Mono.error(new UserExpirationException("세션이 만료되었습니다.")))
        .bodyToMono(KeycloakAccessTokenDto.class)
        .map(KeycloakAccessTokenDto::getAccessToken);
    }

}
