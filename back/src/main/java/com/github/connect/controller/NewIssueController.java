package com.github.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.response.NewIssueResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.project.NewIssuesService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class NewIssueController {
 
    private final NewIssuesService newIssuesService;

    @PostMapping(ApiConstants.KEYWORD_CREATE)
    public Mono<Void> keywordCreate(@RequestParam("keyword") String keyword, @LoginUser String email){
        return newIssuesService.registrySlackInfo(email, keyword);
    }

    @PostMapping(ApiConstants.KEYWORD_DELETE)
    public Mono<Void> keywordDelete(@LoginUser String email){
        return newIssuesService.deleteKeyword(email);
    }

    @PostMapping(ApiConstants.DELETE_NEW_ISSUE)
    public Mono<Void> deleteNewIssue(@RequestParam("newIssueId") Long id){
        return newIssuesService.deleteNewIssue(id);
    }

    @GetMapping(ApiConstants.KEYWORD_GET)
    public Mono<String> getKeyword(@RequestParam("projectId") Long projectId, @LoginUser String email){
        return newIssuesService.getIssueKeyword(projectId, email);
    }

    @GetMapping(ApiConstants.GET_NEW_ISSUE)
    public Flux<NewIssueResponse> getNewIssue(@RequestParam("projectId") Long projectId, @LoginUser String email){
        return newIssuesService.getNewIssue(projectId, email);
    }

    @PostMapping(ApiConstants.GET_NEW_MERGE)
    public Mono<Void> mergetIssue(
        @LoginUser String email,
        @RequestParam("issueId") Long issueId,
        @RequestParam("newIssueId") Long newIssueId){

        return newIssuesService.mergeIssue(email, issueId, newIssueId);
    }

}
