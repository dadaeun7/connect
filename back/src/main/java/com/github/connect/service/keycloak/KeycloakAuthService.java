package com.github.connect.service.keycloak;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.KeycloakAccessTokenDto;
import com.github.connect.dto.internal.KeycloakEmailVerifiedDto;
import com.github.connect.dto.internal.KeycloakExternalUserDto;
import com.github.connect.dto.internal.KeycloakUserTokenDto;
import com.github.connect.exception.custom.KeycloakConnectException;
import com.github.connect.exception.custom.UserNotActiveException;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.repository.StringRedisRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakAuthService {

    private final WebClient keycloakClient;
    private final KeycloakProperties keycloakProperties;
    private final StringRedisRepository stringRedisRepository;
    
    public Mono<KeycloakUserTokenDto> getAccessToken(String email, String password){
        return keycloakClient.post()
        .uri(keycloakProperties.getBaseUrl()+"/realms/"+keycloakProperties.getClientId()+"/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", keycloakProperties.getClientId())
            .with("client_secret", keycloakProperties.getSecretClient())
            .with("username", email)
            .with("password", password)
            .with("grant_type", "password"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> 
            Mono.error(new KeycloakConnectException("[gat] 로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요.")))
        .bodyToMono(KeycloakUserTokenDto.class);
    }

    public Mono<String> createUserUUID(String accessToken, String email, String password){

        return keycloakClient.post()
        .uri(keycloakProperties.getBaseUrl() + "/admin/realms/"+keycloakProperties.getClientId()+"/users")
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .body(BodyInserters.fromValue(Map.of(
            "username", email,
            "email", email,
            "enabled", true,
            "emailVerified", false,
            "credentials", List.of(Map.of(
                "type", "password",
                "value", password,
                "temporary", false
            ))
        )))
        .retrieve()
        .toBodilessEntity()
        .map(response -> {
            URI location = response.getHeaders().getLocation();
            if(location == null){
                throw new KeycloakConnectException("인증 서버에 사용자 정보를 가져오는데 실패했습니다. 관리자에게 문의하세요.");
            }

            String path = location.getPath();
            String[] segments = path.split("/");
            return segments[segments.length - 1];
        });
    } 

    public Mono<KeycloakAccessTokenDto> getAccessTokenKeycloak()
    {
        return keycloakClient.post()
        .uri(keycloakProperties.getBaseUrl()+"/realms/master/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", "admin-cli")
            .with("username", keycloakProperties.getUsername())
            .with("password", keycloakProperties.getPassword())
            .with("grant_type", "password"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> Mono.error(new KeycloakConnectException("[gatk] 로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요.")))
        .bodyToMono(KeycloakAccessTokenDto.class);
    }

    public Mono<KeycloakExternalUserDto> getCodeToAccessToken(String authCode, String redirectUri){
        return keycloakClient.post()
        .uri(keycloakProperties.getBaseUrl()+"/realms/"+keycloakProperties.getClientId()+"/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", keycloakProperties.getClientId())
            .with("client_secret", keycloakProperties.getSecretClient())
            .with("code", authCode)
            .with("grant_type", "authorization_code")
            .with("redirect_uri", redirectUri))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response->Mono.error(new KeycloakConnectException("[gctat] 외부 연동 인증 서버에 문제가 발생했습니다.")))
        .bodyToMono(KeycloakExternalUserDto.class);
    }

    public Mono<Boolean> checkUserIsActive(String uuid, String accessToken){

        return keycloakClient.get()
        .uri(keycloakProperties.getBaseUrl() + "/admin/realms/"+keycloakProperties.getClientId()+"/users/"+uuid)
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> 
                Mono.error(new KeycloakConnectException("사용자 정보를 가져오지 못했습니다. " + response.toString())))
        .bodyToMono(KeycloakEmailVerifiedDto.class)
        .map(KeycloakEmailVerifiedDto::getEmailVerified);
    }


    public Mono<String> getUserUUID(String accessToken, String email, String password){
        return keycloakClient.get()
            .uri(keycloakProperties.getBaseUrl() + "/admin/realms/" + keycloakProperties.getClientId() + "/users?email=" + email)
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .onStatus(HttpStatusCode::isError, response -> 
                    Mono.error(new KeycloakConnectException("인증 서버에서 유저 UUID 조회 실패")))
            // Keycloak은 검색 결과를 List 형태로 반환함
            .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
            .flatMap(users -> {
                if (users.isEmpty()) {
                    return Mono.error(new UserNotActiveException("Keycloak에 존재하지 않는 유저입니다."));
                }
                // 첫 번째로 검색된 유저의 id(UUID) 반환
                String uuid = (String) users.get(0).get("id");
                return Mono.just(uuid);
            });
    }

    public Mono<Void> keycloakLogout(String email){

        return stringRedisRepository.redisGetValue(RedisConstants.AUTH_REDIS_KEY, email)
            .switchIfEmpty(Mono.defer(() -> {
                log.warn("Redis에서 RefreshToken을 찾을 수 없습니다. email: {}", email);
                return Mono.empty();
            }))
            .flatMap(refreshToken -> {
                return keycloakClient.post()
                    .uri(keycloakProperties.getBaseUrl()+"/realms/"+keycloakProperties.getClientId()+"/protocol/openid-connect/logout")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body(BodyInserters.fromFormData("client_id", keycloakProperties.getClientId())
                            .with("client_secret",keycloakProperties.getSecretClient())
                            .with("refresh_token", refreshToken))
                    .retrieve()
                    .bodyToMono(Void.class)
                    .doOnSuccess(v -> log.info("Keycloak 로그아웃 성공: {}", email))
                    .doOnError(e -> log.error("Keycloak 로그아웃 실패: {}", e.getMessage()))
                    .onErrorResume(e -> {
                        log.warn("[Keycloak] Keycloak 로그아웃 실패했으나 내 서비스 로그아웃을 계속 진행합니다. cause: {}", e.getMessage());
                        return Mono.empty();
                    });
            })
            .switchIfEmpty(Mono.defer(() -> {
                log.warn("[Keycloak] Redis에서 RefreshToken을 찾을 수 없어 Keycloak 로그아웃을 스킵합니다. email: {}", email);
                return Mono.empty();
            }))
            .then();
    }

    public Mono<Void> keycloakWithdraw(String adminAccessToken, String uuid){

        return keycloakClient.delete()
            .uri(keycloakProperties.getBaseUrl() + "/admin/realms/" + keycloakProperties.getClientId() + "/users/"+uuid)
            .header("Authorization", "Bearer " + adminAccessToken)
            .retrieve()
            .bodyToMono(Void.class)
            .doOnSuccess(v -> log.info("[Keycloak] 회원 탈퇴 성공: uuid={}", uuid))
            .doOnError(e -> log.error("[Keycloak] 회원 탈퇴 실패: uuid={}, cause={}", uuid, e.getMessage()))
            .then();
    }

    public Mono<Void> saveRedisKey(String email, String refreshToken){
        return stringRedisRepository.redisSaveKey(RedisConstants.AUTH_REDIS_KEY, email, refreshToken)
        .then();
    }

}
