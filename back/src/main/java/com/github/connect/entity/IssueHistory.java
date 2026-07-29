package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table("Issue_History")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class IssueHistory {
    
    @Id
    Long id;

    @Column("issue_id")
    Long issueId;

    @Column("modifier_user_id")
    Long modifierUserId;

    @Column("category")
    String category;

    @Column("content")
    String content;

    @Column("created_at")
    OffsetDateTime createdAt;
}
