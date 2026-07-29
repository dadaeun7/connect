package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="New_Issue")
public class NewIssue {
 
    @Id
    private Long id;

    @Column("match_keyword")
    private String matchKeyword;

    @Column("status")
    private String status;
    
    @Column("created_at")
    private OffsetDateTime createdAt;

    @Column("team_id")
    private String teamId;
    
    @Column("user_id")
    private long userId;

    @Column("original_message")
    private String originalMessage;

    @Column("slack_url")
    private String slackUrl;

    @Column("detected_message")
    private String detectedMessage;
}
