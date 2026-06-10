package com.github.connect.service;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.internal.KeycloakAccessTokenDto;
import com.github.connect.dto.internal.KeycloakEmailVerifiedDto;
import com.github.connect.dto.internal.KeycloakUserTokenDto;
import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.entity.Users;
import com.github.connect.exception.custom.KeycloakConnectException;
import com.github.connect.exception.custom.UserNotActiveException;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.repository.StringRedisRepository;
import com.github.connect.repository.UsersRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CompanyUserGetAuthService {

    private final UsersRepository usersRepository;
    private final WebClient keycloakClient;
    private final StringRedisRepository stringRedisRepository;
    
    @Value("${spring.security.oauth2.resourceserver.base-url}")
    private String baseUrl;

    @Value("${spring.keycloak.client-id}")
    private String clientId;

    @Value("${spring.keycloak.username}")
    private String username;

    @Value("${spring.keycloak.password}")
    private String password;

    @Value("${spring.keycloak.secret-client}")
    private String secretClient;

    public Mono<Map<String, String>> authRequest(CompanyUserGetAuthReq req) {

        return usersRepository.findByEmail(req.getEmail())
                    .flatMap(user -> authRequestCheck(req.getEmail(), req.getPassword()))
                    .switchIfEmpty(Mono.defer(() -> 
                        createUser(req.getEmail(), req.getPassword())
                    ));
    }

    private Mono<Map<String, String>> authRequestCheck(String email, String password){

        return getAccessTokenKeycloak()
        .flatMap(keycloakDto -> getUserUUID(keycloakDto.getAccessToken(), email, password)
            .flatMap(uuid -> checkUserIsActive(uuid, keycloakDto.getAccessToken())
                .flatMap(isActive -> {
                    if(Boolean.FALSE.equals(isActive)){
                        return Mono.error(new UserNotActiveException("이메일 인증전 상태입니다. 메일을 확인해주세요."));
                    }
                    return usersRepository.updateIsActiveByEmail(email, EntityFieldStandardType.USER_ACTIVE)
                        .then(getAccessToken(email, password))
                        .flatMap(token -> 
                            stringRedisRepository.redisSaveKey(RedisConstants.authRedisKey, email, token.getURefreshToken())
                            .then(Mono.just(Map.of("accessToken", token.getUAccessToken())))
                    );
                })
        ));
    }

    private Mono<Map<String, String>> createUser(String email, String password){
        return getAccessTokenKeycloak()
        .flatMap(keycloakDto -> createUserUUID(keycloakDto.getAccessToken(), email, password)
            .flatMap(uuid -> createUserInDB(email, uuid)
                .then(sendVerifyEmail(uuid, keycloakDto.getAccessToken())
                    .then(Mono.just(Map.of("registration", "등록 완료. 이메일 확인 필요")))
        )));
    }

    private Mono<Boolean> checkUserIsActive(String uuid, String accessToken){

        return keycloakClient.get()
        .uri(baseUrl + "/admin/realms/"+clientId+"/users/"+uuid)
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> 
                Mono.error(new KeycloakConnectException("사용자 정보를 가져오지 못했습니다. " + response.toString())))
        .bodyToMono(KeycloakEmailVerifiedDto.class)
        .map(KeycloakEmailVerifiedDto::getEmailVerified);
    }


    private Mono<String> getUserUUID(String accessToken, String email, String password){
        return keycloakClient.get()
            .uri(baseUrl + "/admin/realms/" + clientId + "/users?email=" + email)
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

    private Mono<Void> createUserInDB(String email, String uuid){

        Users newUser = new Users();
        newUser.setEmail(email);
        newUser.setUuid(uuid);
        newUser.setJoinType(Users.RoleType.COMPANY);
        newUser.setIsActive(EntityFieldStandardType.USER_PENDING);
        return usersRepository.save(newUser).then();

    }

    private Mono<Void> sendVerifyEmail(String uuid, String accessToken){
        return keycloakClient.put()
        .uri(baseUrl + "/admin/realms/"+clientId+"/users/"+uuid+"/send-verify-email")
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .retrieve()
        .toBodilessEntity()
        .then();
    }

    private Mono<KeycloakUserTokenDto> getAccessToken(String email, String password){
        return keycloakClient.post()
        .uri(baseUrl+"/realms/"+clientId+"/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", clientId)
            .with("client_secret", secretClient)
            .with("username", email)
            .with("password", password)
            .with("grant_type", "password"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> 
            Mono.error(new KeycloakConnectException("[gat] 로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요.")))
        .bodyToMono(KeycloakUserTokenDto.class)
        .doOnNext(dto -> {
            System.out.println("DEBUG: AccessToken=" + dto.getUAccessToken());
            System.out.println("DEBUG: RefreshToken=" + dto.getURefreshToken());
        });
    }

    private Mono<String> createUserUUID(String accessToken, String email, String password){

        return keycloakClient.post()
        .uri(baseUrl + "/admin/realms/"+clientId+"/users")
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

    private Mono<KeycloakAccessTokenDto> getAccessTokenKeycloak()
    {

        return keycloakClient.post()
        .uri(baseUrl+"/realms/master/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", "admin-cli")
            .with("username", username)
            .with("password", password)
            .with("grant_type", "password"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> Mono.error(new KeycloakConnectException("[gatk] 로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요.")))
        .bodyToMono(KeycloakAccessTokenDto.class);
    }
    
}
