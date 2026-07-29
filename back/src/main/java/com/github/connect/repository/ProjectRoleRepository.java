package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.response.InviteProjectListResponse;
import com.github.connect.entity.ProjectRole;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository()
@Table(name ="Project_Role")
public interface ProjectRoleRepository extends ReactiveCrudRepository<ProjectRole, Long>{
    
    @Query("SELECT EXISTS (SELECT 1 FROM \"Project_Role\" pr WHERE pr.project_id = :projectId AND pr.user_id = :userId)")
    Mono<Boolean> existsByProjectIdAndUserId(Long projectId, Long userId);

    @Modifying
    @Query("INSERT INTO \"Project_Role\" (project_id, user_id, project_role, invited_by, state) " +
       "VALUES (:projectId, :userId, :role, :senderId, :type) " +
       "ON CONFLICT (project_id, user_id) " + //  어떤 유니크 제약조건에서 충돌을 감지할지 지정
       "DO UPDATE SET project_role = EXCLUDED.project_role, " + // 충돌 시 업데이트할 필드 지정
       "              invited_by = EXCLUDED.invited_by, " +
       "              state = EXCLUDED.state")
    Mono<Void> saveProjectRole(Long projectId, Long userId, String role, Long senderId, String type);

    @Query("SELECT * FROM \"Project_Role\" pr WHERE pr.project_id = :projectId "+
        " AND pr.user_id = :userId "+
        " AND pr.state = 'PENDING'")
    Mono<ProjectRole> findByProjectIdAndUserId(Long projectId, Long userId);

    @Query("SELECT * FROM \"Project_Role\" pr WHERE pr.project_id = :projectId "+
        " AND pr.state = 'ACCEPTED'")
    Flux<ProjectRole> getCurrentInviteUserByProjectId(Long projectId);

    @Query("SELECT * FROM \"Project_Role\" pr WHERE pr.project_id = :projectId ")
    Flux<ProjectRole> getHistoryByProjectId(Long projectId);

    @Query("SELECT p.name, pr.project_role " +
           "FROM \"Project_Role\" pr " +
           "JOIN \"Project\" p ON pr.project_id = p.id " +
           "WHERE pr.user_id = :userId "+
            "AND pr.project_role NOT IN('ADMIN')")
    Flux<InviteProjectListResponse> findProjectNameAndRoleByProjectId(Long userId);

    @Modifying
    @Query("DELETE FROM \"Project_Role\" WHERE user_id = :userId "+
        " AND project_id = :projectId")
    Mono<Void> deleteProjectRole(Long userId, Long projectId);

    @Query("SELECT pr.invited_by FROM \"Project_Role\" pr WHERE pr.project_id = :projectId "+
        "AND pr.user_id = :userId AND pr.state='ACCEPTED'")
    Mono<Long> getAdmingUserId(Long projectId, Long userId);
}
