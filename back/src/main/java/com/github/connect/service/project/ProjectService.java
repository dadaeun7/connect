package com.github.connect.service.project;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.github.connect.buffer.ProjectWriteBuffer;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.response.ProjectListResponse;
import com.github.connect.entity.Project;
import com.github.connect.entity.ProjectRole;
import com.github.connect.exception.custom.SQLException;
import com.github.connect.repository.ProjectRepository;
import com.github.connect.repository.ProjectRoleRepository;
import com.github.connect.repository.UserCacheManager;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final UserCacheManager userCacheManager;
    // private final ProjectWriteBuffer projectWriteBuffer;

    public Mono<ProjectListResponse> saveProject(String name, String email){
        // return userCacheManager.findCacheUserId(email)
        // .doOnNext(id -> {
        //     Project project = new Project();
        //     project.setName(name);
        //     project.setUserId(id);
        //     projectWriteBuffer.push(project);
        // })
        // .then();

        return userCacheManager.findCacheUserId(email)
        .flatMap(userId ->{
            Project project = new Project();
            project.setName(name);
            project.setUserId(userId);
            return projectRepository.save(project)
                .onErrorMap(pe -> new SQLException("project 저장 중에 에러가 발생했습니다."+ pe.getMessage()))
                .flatMap(p -> 
                    saveProjectWithRole(p.getId(),userId)
                    .onErrorMap(err -> new SQLException("project 저장 후 role 저장 시 에러가 발생했습니다." + err.getMessage()))
                    .flatMap(prr -> {
                        ProjectListResponse projectListResponse = new ProjectListResponse(userId, name, prr.getRole());
                        return Mono.just(projectListResponse);
                    })
                );
        });
    }

    private Mono<ProjectRole> saveProjectWithRole(Long projectId, Long userId){
        ProjectRole role = new ProjectRole();
        role.setProjectId(projectId);
        role.setUserId(userId);
        role.setRole(EntityFieldStandardType.ROLE_AMDIN);
        role.setInvitedBy(userId);
        role.setInvitedAt(OffsetDateTime.now());
        
        return projectRoleRepository.save(role);
    }

    public Flux<ProjectListResponse> getProjects(String email){
        return userCacheManager.findCacheUserId(email)
        .flatMapMany(projectRepository::findProjectsByUserId);
    }

    public Mono<Void> saveProjectWithUserEmail(String name, String email){
        return projectRepository.saveProjectWithUserEmail(name, email);
    }

    public Flux<ProjectListResponse> getProjectsWithUserEmail(String email){
        return projectRepository.findProjectsByUserEmail(email);
    }
}
