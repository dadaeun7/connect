package com.github.connect.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Table("Issue")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Issue {
    @Id
    private Long id;
    private String title;
    private String state;
    
    @Column("modify_at") private OffsetDateTime modifyAt;
    @Column("created_user") private Long createdUser;
    
    @Column("status_code") private Long statusCode;
    @Column("priority_code") private Long priorityCode;
    @Column("due_date") private OffsetDateTime dueDate;
    @Column("project_id") private Long projectId;

    // 연동 관련 스키마 영역
    @Column("github_repo_id") private Long githubRepoId;
    @Column("github_repo_name") private String githubRepoName;
    @Column("github_branch") private String githubBranch;
    
    @Builder.Default
    @Column("github_webhook")
    private Boolean githubWebhook = false;
    
    @Column("figma_file_key") private String figmaFileKey;
    @Column("figma_file_name") private String figmaFileName; 

    @Column("notion_db_id") private UUID notionDbId;
    @Column("notion_db_title") private String notionDbTitle;

}