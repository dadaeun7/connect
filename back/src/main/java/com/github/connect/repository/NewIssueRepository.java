package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.response.NewIssueResponse;
import com.github.connect.entity.NewIssue;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository()
@Table(name="New_Issue")
public interface NewIssueRepository extends ReactiveCrudRepository<NewIssue, Long>{
    
    @Query("SELECT id, match_keyword, status, created_at, original_message, slack_url, detected_message "+
    "FROM \"New_Issue\" ni WHERE ni.user_id = :userId")
    Flux<NewIssueResponse> getByUserId(Long userId);

    @Query("SELECT ni.match_keyword FROM \"New_Issue\" ni WHERE ni.user_id = :userId ORDER BY ni.created_at DESC LIMIT 1")
    Mono<String> getIssueKeyword(Long userId);

    @Modifying
    @Query("DELETE FROM \"New_Issue\" ni WHERE ni.id = :newIssueId")
    Mono<Void> deleteNewIssue(Long newIssueId);

    @Modifying
    @Query("UPDATE \"New_Issue\" SET status = :status WHERE id = :newIssueId")
    Mono<Void> updateNewIssueState(String status, long newIssueId);
}
