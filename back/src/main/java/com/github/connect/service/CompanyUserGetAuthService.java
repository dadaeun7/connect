package com.github.connect.service;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.KeycloakAccessTokenDto;
import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.entity.Users;
import com.github.connect.exception.custom.KeycloakConnectException;
import com.github.connect.exception.custom.UserNotActiveException;
import com.github.connect.repository.UsersRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CompanyUserGetAuthService {

    private final UsersRepository usersRepository;
    private final WebClient keycloakClient;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${spring.keycloak.client-id}")
    private String clientId;

    @Value("${spring.keycloak.username}")
    private String username;

    @Value("${spring.keycloak.password}")
    private String password;

    public Mono<String> authRequest(CompanyUserGetAuthReq req) {

        return usersRepository.findByEmail(req.getEmail())
                    .flatMap(user -> checkUserIsActive(req.getEmail()).then(Mono.just(user)))
                    .flatMap(user -> getAccessToken(req.getEmail(), req.getPassword()))
                    .switchIfEmpty(Mono.defer(() -> 
                        getAccessTokenKeycloak()
                            .flatMap(accessToken -> getUserUUID(accessToken, req.getEmail(), req.getPassword()))
                            .flatMap(uuid -> createUserInDB(req.getEmail(), uuid))
                            .flatMap(newUser -> Mono.empty())
                    ));
    }

    private Mono<Void> checkUserIsActive(String email){
        return usersRepository.findIsActiveByEmail(email)
        .flatMap(state -> {
            if(state.equals(EntityFieldStandardType.USER_PENDING)){
                return Mono.error(new UserNotActiveException("사용자 계정이 활성화되지 않았습니다. 관리자에게 문의하세요."));
            } else if(state.equals(EntityFieldStandardType.USER_SUSPENDED)){
                return Mono.error(new UserNotActiveException("사용자 계정이 정지되었습니다. 관리자에게 문의하세요."));
            }
            return Mono.empty();
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

    public Mono<Void> successAuth(String email){
        return usersRepository.findIsActiveByEmail(email)
            .flatMap(state -> {
                if (state.equals(EntityFieldStandardType.USER_PENDING)) {
                    return usersRepository.updateIsActiveByEmail(email, EntityFieldStandardType.USER_ACTIVE);
                }
                return Mono.empty();
            });
    }

    private Mono<String> getAccessToken(String email, String password){
        return keycloakClient.post()
        .uri(issuerUri+"/realms/"+clientId+"/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", clientId)
            .with("username", email)
            .with("password", password)
            .with("grant_type", "password"))
            .retrieve()
            .onStatus(HttpStatusCode::isError, response -> Mono.error(new KeycloakConnectException("로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요. " + response.toString())))
            .bodyToMono(KeycloakAccessTokenDto.class)
            .map(KeycloakAccessTokenDto::getAccessToken);
    }

    private Mono<String> getUserUUID(String accessToken, String email, String password){

        return keycloakClient.post()
        .uri(issuerUri + "/admin/realms/"+clientId+"/users")
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .body(BodyInserters.fromValue(Map.of(
            "username", email,
            "email", email,
            "enabled", true,
            "emailVerified", false,
            "credentials", Map.of(
                "type", "password",
                "value", password,
                "temporary", false
            )
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

    private Mono<String> getAccessTokenKeycloak()
    {

        return keycloakClient.post()
        .uri(issuerUri+"/realms/master/protocol/openid-connect/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(BodyInserters.fromFormData("client_id", clientId)
            .with("username", username)
            .with("password", password)
            .with("grant_type", "password"))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> Mono.error(new KeycloakConnectException("로그인 인증 서버에 문제가 발생했습니다. 관리자에게 문의하세요. " + response.toString())))
        .bodyToMono(KeycloakAccessTokenDto.class)
        .map(KeycloakAccessTokenDto::getAccessToken);
    }
    
}
