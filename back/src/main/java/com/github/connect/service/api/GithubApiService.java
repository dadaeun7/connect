package com.github.connect.service.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.dto.request.GithubWebhookReqDto;
import com.github.connect.dto.response.GithubBranchResponse;
import com.github.connect.dto.response.GithubRepoResponse;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class GithubApiService {
    
    private final WebClient defauClient;
    private final AesUtil aesUtil;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final UserCacheManager userCacheManager;

    @Value("${app.webhook.github-url}")
    private String githubWebhookReceiverUrl;

    public Flux<GithubRepoResponse> getUserRepositories(String email){
        return getAccessToken(email)
        .flatMapMany(dto-> defauClient.get()
                    .uri("https://api.github.com/user/repos")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + aesUtil.decrypt(dto.getAccessToken()))
                    .retrieve()
                    .bodyToFlux(GithubRepoResponse.class));
    }

    public Flux<GithubBranchResponse> getUserBranches(String email, String repoFullName){
        String[] parts = repoFullName.split("/");
        String owner = parts[0];
        String repo = parts[1];

        return getAccessToken(email)
        .flatMapMany(dto-> defauClient.get()
                .uri("https://api.github.com/repos/{owner}/{repo}/branches", owner, repo)
                .header(HttpHeaders.AUTHORIZATION, "Bearer "+ aesUtil.decrypt(dto.getAccessToken()))
                .retrieve()
                .bodyToFlux(GithubBranchResponse.class));
    }

    private Mono<AppTokenCacheDto> getAccessToken(String email){
        return userCacheManager.findCacheUserId(email)
        .flatMap(id -> appTokenRedisRepository.redisGetValue(id, EntityFieldStandardType.APP_GITHUB));
    }

    public Mono<Void> registerGithubWebhook(String email, String owner, String repo){
        GithubWebhookReqDto reqDto = GithubWebhookReqDto.builder()
                                    .name("web")
                                    .active(true)
                                    .events(List.of("push","commit_comment"))
                                    .config(GithubWebhookReqDto.WebhookConfig.builder()
                                                .url(githubWebhookReceiverUrl)
                                                .contentType("json")
                                                .insecureSsl("0")
                                                .secret(null)
                                                .build())
                                    .build();

        return getAccessToken(email)
        .switchIfEmpty(Mono.error(new IllegalStateException("해당 사용자의 GitHub 액세스 토큰을 찾을 수 없습니다: " + email)))
        .flatMap(dto -> {
            String deAccessToken = aesUtil.decrypt(dto.getAccessToken()).trim();
            String cleanToken = deAccessToken
                    .replaceAll("(?i)Bearer\\s+", "") // 대소문자 구분 없이 "Bearer " 제거
                    .replaceAll("(?i)token\\s+", "")  // 대소문자 구분 없이 "token " 제거
                    .trim();

            String authHeader = "Bearer " + cleanToken;
            log.info("[GitHub API Debug] 실제 호출 헤더 형식: '{}', 토큰 시작: '{}'", authHeader.split(" ")[0], authHeader);
            return defauClient.post()
                .uri("https://api.github.com/repos/{owner}/{repo}/hooks", owner, repo)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .header(HttpHeaders.ACCEPT, "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2026-03-10")
                .bodyValue(reqDto)
                .retrieve()
                .toBodilessEntity() 
                .doOnSubscribe(sub -> log.info("[GitHub API] 웹훅 자동 등록 쿼리 전송 시작... 대상: {}/{}", owner, repo))
                .doOnSuccess(response -> log.info("GitHub 웹훅 자동 등록 성공: {}/{}", owner, repo))
                .doOnError(error -> log.error("GitHub 웹훅 자동 등록 실패: {}/{} - {}", owner, repo, error.getMessage()))
                .onErrorResume(WebClientResponseException.class, ex -> {
                            if (ex.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) { // 422
                                log.warn("[GitHub API] 이미 등록된 웹훅이거나 처리할 수 없는 요청입니다(422). 정상 흐름으로 진행합니다. 대상: {}/{}", owner, repo);
                                return Mono.empty(); 
                            }
                            return Mono.error(ex); // 그 외의 4xx, 5xx 에러는 그대로 전파
                        })
                        .doOnError(error -> log.error("GitHub 웹훅 자동 등록 실패: {}/{} - {}", owner, repo, error.getMessage()))
                        .then();
        });                  

    }

}
