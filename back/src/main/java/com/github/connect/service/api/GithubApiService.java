package com.github.connect.service.api;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.dto.response.GithubBranchResponse;
import com.github.connect.dto.response.GithubRepoResponse;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GithubApiService {
    
    private final WebClient defauClient;
    private final AesUtil aesUtil;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final UserCacheManager userCacheManager;


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
}
