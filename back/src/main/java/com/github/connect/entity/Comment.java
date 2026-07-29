package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name="Comment")
public class Comment {
    
    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("file")
    private String file;

    @Column("new_issue_id")
    private Long newIssueId;
    
    @Column("created_at")
    private OffsetDateTime createdAt;
}
