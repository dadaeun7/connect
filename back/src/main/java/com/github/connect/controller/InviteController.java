package com.github.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.ExitInvitedUserReq;
import com.github.connect.dto.request.InviteAcceptReq;
import com.github.connect.dto.request.InvtieUserReq;
import com.github.connect.dto.response.CurrentProjectRolesResponse;
import com.github.connect.dto.response.InviteHistoryResponse;
import com.github.connect.dto.response.InviteProjectListResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.project.InviteProjectService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class InviteController {
    private final InviteProjectService inviteProjectService;

    @PostMapping(ApiConstants.INVITE_USER)
    public Mono<Void> submitInviteUser(@RequestBody InvtieUserReq req, @LoginUser String email){

        return inviteProjectService.inviteUser(req.projectId(), req.toEmail(), req.role(), email);
    }

    @PostMapping(ApiConstants.INVITE_ACCEPT)
    public Mono<Void> acceptInvite(@RequestBody InviteAcceptReq req, @LoginUser String email){
        if(req.token() != null){
            return inviteProjectService.checkInviteByToken(email, req.token());
        }else{
            return inviteProjectService.checkInviteByProjectId(email, req.projectId());
        }
    }

    @PostMapping(ApiConstants.INVITE_USER_EXIT)
    public Mono<Void> exitInvitedUser(@RequestBody ExitInvitedUserReq req){
        return inviteProjectService.exitUser(req.email(), req.projectId());
    }

    @GetMapping(ApiConstants.INVITE_HISTORY_LIST)
    public Flux<InviteHistoryResponse> getInviteHistory(@RequestParam("projectId")Long projectId){
        return inviteProjectService.getInviteHistory(projectId);
    }

    @GetMapping(ApiConstants.INVITE_PROJECT_LIST)
    public Flux<InviteProjectListResponse> getInviteProjects(@LoginUser String email){
        return inviteProjectService.getInviteProject(email);
    }

    @GetMapping(ApiConstants.INVITE_CURRENT_USERS)
    public Flux<CurrentProjectRolesResponse> getCurrentUsers(@RequestParam("projectId")Long projectId){
        return inviteProjectService.getCurrentInvite(projectId);
    }

}
