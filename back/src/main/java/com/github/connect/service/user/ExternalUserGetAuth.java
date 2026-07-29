package com.github.connect.service.user;

import java.util.Base64;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.entity.Users;
import com.github.connect.exception.custom.JwtDecodedException;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.keycloak.KeycloakAuthService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ExternalUserGetAuth {
    
    private final KeycloakAuthService keycloakAuthService;
    private final ObjectMapper objectMapper;
    private final UsersRepository usersRepository;

    public Mono<Map<String, String>> getExternalAuth(String authCode, String redirectUri, Users.RoleType type){
        return keycloakAuthService.getCodeToAccessToken(authCode, redirectUri)
        .flatMap(dto -> idTokenDecoded(dto.getIdToken())
            .flatMap(map -> usersRepository.findByEmail(map.get("email").toString())
                .flatMap(unused -> returnAccessToken(map.get("email").toString(), dto.getUAccessToken(), dto.getURefreshToken()))
                .switchIfEmpty(Mono.defer(()->
                    newUserInsert(map, dto.getUAccessToken(), dto.getURefreshToken(), type)
                ))));
    }

    private Mono<Map<String, String>> newUserInsert(Map<String, Object> map, String accessToken, String refreshToken, Users.RoleType type){
        return createUser(map, type)
        .then(returnAccessToken(map.get("email").toString(), accessToken, refreshToken));
    }

    private Mono<Void> createUser(Map<String, Object> map, Users.RoleType type){

        if(map.get("email") == null || map.get("sub") == null){
            return Mono.error(new JwtDecodedException("필수 정보가 누락되어있습니다. (email or sub)"));
        }
        
        return usersRepository.insertIgnoreOnConflict(
            map.get("sub").toString(),
            map.get("email").toString(),
            type.toString(),
            EntityFieldStandardType.USER_ACTIVE).then();
    }

    private Mono<Map<String, String>> returnAccessToken(String email, String accessToken, String refreshToken){
        return keycloakAuthService.saveRedisKey(email, refreshToken)
        .then(Mono.just(Map.of("accessToken", accessToken)));
    }


    private Mono<Map<String, Object>> idTokenDecoded(String idToken){

        String[] parts = idToken.split("\\.");

        String payload = parts[1];
        byte[] decoded = Base64.getUrlDecoder().decode(payload);
        String json = new String(decoded);

        return Mono.just(objectMapper.readValue(json, new TypeReference<Map<String,Object>>() {}));
    }

}
