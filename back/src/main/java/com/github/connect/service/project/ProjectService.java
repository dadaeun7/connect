package com.github.connect.service.project;

import java.time.Clock;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

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
    private final Clock clock;

    public Mono<ProjectListResponse> saveProject(String name, String email){

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

    public Flux<ProjectListResponse> getProjects(String email){
        return userCacheManager.findCacheUserId(email)
        .flatMapMany(projectRepository::findProjectsByUserId);
    }

    private Mono<ProjectRole> saveProjectWithRole(Long projectId, Long userId){
        ProjectRole role = new ProjectRole();
        role.setProjectId(projectId);
        role.setUserId(userId);
        role.setRole(EntityFieldStandardType.ROLE_AMDIN);
        role.setInvitedBy(userId);
        role.setInvitedAt(OffsetDateTime.now(clock));
        role.setState(EntityFieldStandardType.INVITE_ACCEPTED);
        
        return projectRoleRepository.save(role);
    }

    /**
     * 테스트를 위해 만든 메소드로 실제 운영 환경에서 사용하지 않음
     */
    // public Mono<Void> saveProjectWithUserEmail(String name, String email){
    //     return projectRepository.saveProjectWithUserEmail(name, email);
    // }

    // public Flux<ProjectListResponse> getProjectsWithUserEmail(String email){
    //     return projectRepository.findProjectsByUserEmail(email);
    // }
}
