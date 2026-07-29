package com.github.connect.controller;

import java.time.OffsetDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.IssueCreateRequest;
import com.github.connect.dto.request.IssueUpdateRequest;
import com.github.connect.dto.response.ActivityResponse;
import com.github.connect.dto.response.IssueHistoryResponse;
import com.github.connect.dto.response.IssueTitleListResponse;
import com.github.connect.dto.response.IssueTitleResponse;
import com.github.connect.dto.response.IssueViewResponse;
import com.github.connect.dto.response.IssueDetailResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.project.IssueService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class IssueController {
    
    private final IssueService issueService;

    @PostMapping(ApiConstants.ISSUE_CREATED)
    public Mono<Void> createIssue(@LoginUser String email, @RequestBody IssueCreateRequest request){
        return issueService.createIssue(request, email);
    }

    @GetMapping(ApiConstants.ISSUE_VIEW_LIST)
    public Flux<IssueViewResponse> getIssueViewList(@RequestParam("projectId")Long projectId, @RequestParam(defaultValue = "0") Long page){
        return issueService.getViewIssue(projectId,page);
    }

    @GetMapping(ApiConstants.ISSUE_DETAIL)
    public Mono<IssueDetailResponse> getIssueDetail(@RequestParam("issueId")Long issueId){
        return issueService.getIssueDetail(issueId);
    }

    @GetMapping(ApiConstants.ISSUE_HISTORY_LIST)
    public Flux<IssueHistoryResponse> getIssueHistory(@RequestParam("issueId")Long issueId){
        return issueService.getIssueHistory(issueId);
    }

    @GetMapping(ApiConstants.ISSUE_ACTIVITY_LIST)
    public Flux<ActivityResponse> getIssueActivity(@RequestParam("issueId")Long issueId, @RequestParam(defaultValue = "0") Long page){
        return issueService.getIssueActivity(issueId, page);
    }

    @PostMapping(ApiConstants.ISSUE_MODIFY)
    public Mono<Void> modifyIssue(@RequestParam("issueId")Long issueId, @RequestBody IssueUpdateRequest req, @LoginUser String email){
        return issueService.updateIssue(issueId, req, email);
    }

    @PostMapping(ApiConstants.ISSUE_DELETE)
    public Mono<Void> deleteIssue(@RequestParam("issueId")Long issueId){
        return issueService.deleteIssue(issueId);
    }

    @GetMapping(ApiConstants.ISSUE_TITLE_LIST)
    public Flux<IssueTitleListResponse> getIssueTitleAllList(@RequestParam("projectId")Long projectId){
        return issueService.getIssueTitleAllList(projectId);
    }

    @GetMapping(ApiConstants.ISSUE_COUNT)
    public Mono<Long> getCountAllIssue(@RequestParam("projectId")Long projectId){
        return issueService.countAllIssue(projectId);
    }

    @GetMapping(ApiConstants.ISSUE_MONTH_LIST)
    public Flux<IssueTitleResponse> getMonthlyRang(
        @RequestParam("startDate")OffsetDateTime startDate,
        @RequestParam("endDate")OffsetDateTime endDate,
        @RequestParam("projectId")Long projectId){
            
        return issueService.getMonthlyRange(startDate, endDate, projectId);
    }
}
