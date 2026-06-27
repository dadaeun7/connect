package com.github.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.dto.response.GithubBranchResponse;
import com.github.connect.dto.response.GithubRepoResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.api.GithubApiService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class GithubController {
    
    private final GithubApiService githubApiService;

    @GetMapping("/repos")
    public Flux<GithubRepoResponse> getGithubRepo(@LoginUser String userEmail){
        return githubApiService.getUserRepositories(userEmail);
    }

    @GetMapping("/branches")
    public Flux<GithubBranchResponse> getGithubBranches(@LoginUser String userEmail, @RequestParam("repoFullName") String repoFullName){
        return githubApiService.getUserBranches(userEmail, repoFullName);
    }
}
