package com.github.connect.service.user;

import java.util.List;

import org.springframework.stereotype.Service;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.constants.RedisConstants;
import com.github.connect.dto.response.UserInfoResponse;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.SlackHookInfoRedisRepository;
import com.github.connect.repository.StringRedisRepository;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.keycloak.KeycloakAuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {
    
    private final UsersRepository usersRepository;
    private final KeycloakAuthService keycloakAuthService;
    private final StringRedisRepository stringRedisRepository;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final SlackHookInfoRedisRepository slackHookInfoRedisRepository;


    public Mono<UserInfoResponse> getUserInfo(String email){
        return usersRepository.getUserInfo(email);
    }

    public Mono<Void> updateUserInfo(String name, String affiliation, String email){
        return usersRepository.updateUserInfo(name, affiliation, email)
        .doOnError(error -> log.error("[updateUserInfo] update error: {}", error.fillInStackTrace()))
        .then();
    }

    public Mono<Void> userLogout(String email){
        return keycloakAuthService.keycloakLogout(email)
            .then(stringRedisRepository.redisDeleteValue(RedisConstants.AUTH_REDIS_KEY, email))
            .then();
    }

    public Mono<Void> userWithdraw(String email){

        List<String> appList = List.of(EntityFieldStandardType.APP_FIGMA,
            EntityFieldStandardType.APP_GITHUB, EntityFieldStandardType.APP_NOTION,
            EntityFieldStandardType.APP_SLACK);

        return usersRepository.findUuidAndUserIdByEmail(email)
            .flatMap(info -> 
                keycloakAuthService.getAccessTokenKeycloak()
                    .flatMap(dto -> {
                        // 1. Keycloak 회원탈퇴 Mono
                        Mono<Void> keycloakWithdrawMono = keycloakAuthService.keycloakWithdraw(dto.getAccessToken(), info.uuid());

                        // 2. Redis 앱 토큰 삭제 Mono들의 모음 (Flux -> Mono 변환)
                        Mono<Void> redisAppDeletes = Flux.fromIterable(appList)
                            .flatMap(app -> appTokenRedisRepository.redisDeleteValue(info.id(), app))
                            .then();

                        // 3. Slack Hook 정보 삭제 Mono
                        Mono<Void> slackDeleteMono = slackHookInfoRedisRepository.redisDeleteValue(info.appPkId());

                        // Mono.when을 사용해 모든 비동기 작업을 병렬/동시에 실행하고 전부 완료될 때까지 기다림
                        return Mono.when(keycloakWithdrawMono, redisAppDeletes, slackDeleteMono);
                    })
            )
            .then(usersRepository.withDrawUser(email))
            .then();
    }
}
