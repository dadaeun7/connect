package com.github.connect.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.ProjectSaveReq;
import com.github.connect.dto.response.ProjectListResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.project.ProjectService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;

    @GetMapping(ApiConstants.PROJECT_LIST_UP)
    public Mono<ResponseEntity<List<ProjectListResponse>>> projectListUp(@LoginUser String email, String accessToken){

        return projectService.getProjects(email)
        .collectList()
        .map(ResponseEntity::ok);
    }

//     @GetMapping(value =ApiConstants.PROJECT_LIST_UP, produces = MediaType.APPLICATION_JSON_VALUE)
    // public Flux<ProjectListResponse> projectListUp(@LoginUser String email, String accessToken){

    //     return projectService.getProjects(email);
    // }

    @PostMapping(ApiConstants.PROJECT_SAVE)
    public Mono<ResponseEntity<ProjectListResponse>> projectSave(@LoginUser String email, String accessToken, @RequestBody ProjectSaveReq req){

        return projectService.saveProject(req.getName(), email)
        .map(res -> {
            return ResponseEntity.ok()
            .body(res);
        });
    }
}
