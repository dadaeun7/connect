package com.github.connect.repository;

import java.util.UUID;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.response.InviteHistoryResponse;
import com.github.connect.entity.ProjectInvitation;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository()
@Table(name="Project_Invitation")
public interface ProjectInvitationRepository extends ReactiveCrudRepository<ProjectInvitation, Long>{
    
    @Query("SELECT EXISTS (SELECT 1 FROM \"Project_Invitation\" "+
    "pi WHERE pi.project_id = :projectId "+
    " AND pi.email = :toUserEmail "+
    " AND pi.state = :state)")
    Mono<Boolean> existsByProjectIdAndUserEmail(Long projectId, String toUserEmail, String state);

    @Modifying
    @Query("INSERT INTO \"Project_Invitation\" (id, project_id, email, project_role, invited_by, state) " +
       "VALUES (:id, :projectId, :email, :role, :senderId, :type) " +
       "ON CONFLICT (project_id, email) " + // 어떤 유니크 제약조건에서 충돌 감지할지 지정
       "DO UPDATE SET project_role = EXCLUDED.project_role, " + // 충돌 시 업데이트할 필드 지정
       "              invited_by = EXCLUDED.invited_by, " +
       "              state = EXCLUDED.state")
    Mono<Void> saveProjectRole(UUID id, Long projectId, String email, String role, Long senderId, String type);
    
    @Query("SELECT * FROM \"Project_Invitation\" pi WHERE pi.id = :token")
    Mono<ProjectInvitation> findById(UUID token);

    @Query("SELECT pi.email, pi.state, pi.invited_at FROM \"Project_Invitation\" pi "+
        "WHERE pi.project_id = :projectId")
    Flux<InviteHistoryResponse> findByProjectId(Long projectId);

    @Modifying
    @Query("UPDATE \"Project_Invitation\" SET state = 'EXIT' WHERE email = :email "+
        " AND project_id = :projectId")
    Mono<Void> updateInviteHistory(String email, Long projectId);
}
