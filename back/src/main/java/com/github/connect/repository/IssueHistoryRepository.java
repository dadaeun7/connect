package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.IssueHistory;

import reactor.core.publisher.Flux;

@Repository()
@Table(name="Issue_History")
public interface IssueHistoryRepository extends ReactiveCrudRepository<IssueHistory, Long>{
    
    @Query("SELECT * FROM \"Issue_History\" ih WHERE ih.issue_id = :issueId")
    Flux<IssueHistory> findByIssueId(Long issueId);

}
