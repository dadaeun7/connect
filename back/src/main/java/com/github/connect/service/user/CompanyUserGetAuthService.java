package com.github.connect.service.user;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.entity.Users;
import com.github.connect.exception.custom.UserNotActiveException;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.keycloak.KeycloakAuthService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CompanyUserGetAuthService {

    private final UsersRepository usersRepository;
    private final KeycloakAuthService keycloakAuthService;

    private final KeycloakProperties keycloakProperties;
    private final WebClient keycloakClient;
    private final UserCacheManager userCacheManager;

    public Mono<Map<String, String>> authRequest(CompanyUserGetAuthReq req) {

        return usersRepository.findByEmail(req.getEmail())
                    .flatMap(user -> authRequestCheck(req.getEmail(), req.getPassword()))
                    .switchIfEmpty(Mono.defer(() -> 
                        createUser(req.getEmail(), req.getPassword())
                    ));
    }

    private Mono<Map<String, String>> authRequestCheck(String email, String password){

        return keycloakAuthService.getAccessTokenKeycloak()
        .flatMap(keycloakDto -> keycloakAuthService.getUserUUID(keycloakDto.getAccessToken(), email, password)
            .flatMap(uuid -> keycloakAuthService.checkUserIsActive(uuid, keycloakDto.getAccessToken())
                .flatMap(isActive -> {
                    if(Boolean.FALSE.equals(isActive)){
                        return Mono.error(new UserNotActiveException("이메일 인증전 상태입니다. 메일을 확인해주세요."));
                    }
                    return usersRepository.updateIsActiveByEmail(email, EntityFieldStandardType.USER_ACTIVE)
                    .flatMap(unused -> keycloakAuthService.getAccessToken(email, password)
                        .flatMap(token -> keycloakAuthService.saveRedisKey(email,token.getURefreshToken())
                            .then(Mono.just(Map.of("accessToken", token.getUAccessToken())))));
                })
        ));
    }

    private Mono<Map<String, String>> createUser(String email, String password){
        return keycloakAuthService.getAccessTokenKeycloak()
        .flatMap(keycloakDto -> keycloakAuthService.createUserUUID(keycloakDto.getAccessToken(), email, password)
            .flatMap(uuid -> createUserInDB(email, uuid)
                .then(sendVerifyEmail(uuid, keycloakDto.getAccessToken())
                    .then(Mono.just(Map.of("registration", "등록 완료. 이메일 확인 필요")))
        )));
    }

    private Mono<Void> createUserInDB(String email, String uuid){

        Users newUser = new Users();
        newUser.setEmail(email);
        newUser.setUuid(uuid);
        newUser.setJoinType(Users.RoleType.COMPANY);
        newUser.setIsActive(EntityFieldStandardType.USER_PENDING);

        return usersRepository.save(newUser).
        flatMap(savedUser->{
            Long userId = savedUser.getId();
            String userEmail = savedUser.getEmail();

            return Mono.zip(userCacheManager.saveCacheUserId(userId, userEmail), 
                        userCacheManager.saveCacheUserEmail(userId, email));
        }).then();
    }

    private Mono<Void> sendVerifyEmail(String uuid, String accessToken){
        return keycloakClient.put()
        .uri( keycloakProperties.getBaseUrl()+ "/admin/realms/"+keycloakProperties.getClientId()+"/users/"+uuid+"/send-verify-email")
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .retrieve()
        .toBodilessEntity()
        .then();
    }
    
}
