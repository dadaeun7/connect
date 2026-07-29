package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.response.ActivityResponse;
import com.github.connect.entity.Activity;

import reactor.core.publisher.Flux;

@Repository()
@Table("Activity")
public interface ActivityRepository extends ReactiveCrudRepository<Activity,Long>{
   
    @Query("SELECT * FROM \"Activity\" a WHERE a.issue_id = :issueId ORDER BY a.created_at DESC LIMIT 5")
    Flux<ActivityResponse> activityByIssueIdLimit(Long issueId);

    @Query("SELECT * FROM \"Activity\" a WHERE a.issue_id = :issueId ORDER BY a.created_at DESC "+
        "LIMIT 10 OFFSET :pageId")
    Flux<ActivityResponse> activityByIssueIdAll(Long issueId, Long pageId);
}