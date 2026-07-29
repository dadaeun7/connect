package com.github.connect.repository;

import java.time.OffsetDateTime;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.internal.ActiveFigmaLink;
import com.github.connect.dto.internal.ActiveNotionDbLink;
import com.github.connect.dto.response.IssueDetailResponse;
import com.github.connect.dto.response.IssueTitleListResponse;
import com.github.connect.dto.response.IssueTitleResponse;
import com.github.connect.entity.Issue;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository()
@Table(name="Issue")
public interface IssueRepository extends ReactiveCrudRepository<Issue, Long>{

    @Query("SELECT COUNT(i) FROM \"Issue\" i " +
           "WHERE i.created_at >= :startDate AND i.created_at < :endDate "+
            "i.project_id = :projectId")
    Mono<Long> countByMonthlyRange(OffsetDateTime startDate,OffsetDateTime endDate, Long projectId);

    @Query("SELECT COUNT(i) FROM \"Issue\" i " +
            "WHERE i.project_id = :projectId")
    Mono<Long> countByAllIssue(Long projectId);

    @Query("SELECT id, title, state, status_code, priority_code, " +
       "due_date as due_date, project_id, " +
       "github_repo_name, figma_file_key, " +
       "notion_db_id::text as notion_db_id, " +
       "modify_at as modify_at, " +        
       "created_at as created_at " +
       "FROM \"Issue\" " +
       "WHERE created_at >= :startDate AND created_at < :endDate " +
       " AND project_id = :projectId ORDER BY created_at DESC")
    Flux<IssueTitleResponse> findByMonthlyRange(OffsetDateTime startDate, OffsetDateTime endDate, Long projectId);

    @Query("SELECT id, title, state, status_code, priority_code, " +
       "due_date as due_date, project_id, " +
       "github_repo_name, figma_file_key, " +
       "notion_db_id::text as notion_db_id, " +
       "modify_at as modify_at, " +        
       "created_at as created_at " +
       "FROM \"Issue\" WHERE project_id = :projectId ORDER BY created_at DESC "+
       "LIMIT 10 OFFSET :pageId")
    Flux<IssueTitleResponse> findByProjectId(Long projectId, Long pageId);

    @Query("SELECT github_repo_name, github_branch, github_repo_id, "+
        "figma_file_key, figma_file_name, " +
        "notion_db_id::text as notion_db_id, notion_db_title " +
        "FROM \"Issue\" WHERE id = :issueId")
    Mono<IssueDetailResponse> findByIssueDetail(Long issueId);

    @Query("SELECT id, title FROM \"Issue\" WHERE project_id = :projectId ORDER BY created_at DESC")
    Flux<IssueTitleListResponse> getIssueTitleByProjectId(Long projectId);

    @Query("SELECT * FROM \"Issue\" i WHERE i.id = :issueId")
    Mono<Issue> findById(Long issueId);

    @Query("SELECT i.github_webhook FROM \"Issue\" i WHERE i.github_repo_name = :repoFullName "+
        "AND i.github_repo_id = :repoId LIMIT 1")
    Mono<Boolean> findRepoWebHookCheck(String repoFullName, Long repoId);

    @Query("SELECT DISTINCT created_user "+
        "FROM \"Issue\" "+
        "WHERE state NOT IN ('COMPLETE') "+
        " AND figma_file_key IS NOT NULL"
    )
    Flux<Long> findActiveFigmaOwnerIds();

    @Query("SELECT DISTINCT created_user "+
        "FROM \"Issue\" "+
        "WHERE state NOT IN ('COMPLETE') "+
        " AND notion_db_id IS NOT NULL"
    )
    Flux<Long> findActiveNotionDbOwnerIds();

    @Query("SELECT id, notion_db_id " +
        "FROM \"Issue\" " +
        "WHERE created_user = :userId " +
        " AND state NOT IN ('COMPLETE') "+
        " AND notion_db_id IS NOT NULL")
    Flux<ActiveNotionDbLink> findActiveNotionDbLinksByUserId(Long userId);

    @Query("SELECT figma_file_key, id " +
        "FROM \"Issue\" " +
        "WHERE created_user = :userId " +
        " AND state NOT IN ('COMPLETE') "+
        " AND figma_file_key IS NOT NULL")
    Flux<ActiveFigmaLink> findActiveFigmaLinksByUserId(Long userId);

    @Query("SELECT id FROM \"Issue\" " +
        "WHERE github_repo_name = :repoFullName " +
        " AND state NOT IN ('COMPLETE') ")
    Flux<Long> findActiveIssueIdsByRepo(String repoFullName);

    @Query("SELECT id FROM \"Issue\" " +
        "WHERE figma_file_key = :fileKey " +
        " AND state NOT IN ('COMPLETE') ")
    Flux<Long> findActiveIssueIdsByFileKey(String fileKey);
}
