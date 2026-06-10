package com.github.connect.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.KeycloakAccessTokenDto;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.repository.StringRedisRepository;

import lombok.AllArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class UserRefreshToAccessService {

    private final WebClient keycloakClient;
    private final StringRedisRepository stringRedisRepository;
    private final KeycloakProperties keycloakProperties;
    
    public Mono<String> getReAccessToken(String email){
        return stringRedisRepository.redisGetValue(RedisConstants.authRedisKey, email)
        .flatMap(refreshToken -> refreshToAccessToken(email, refreshToken))
        .map(accessToken -> accessToken.toString());
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
        .bodyToMono(KeycloakAccessTokenDto.class)
        .map(KeycloakAccessTokenDto::getAccessToken);
    }

}
