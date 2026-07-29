package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="Project_Role")
public class ProjectRole {

    @Column("project_id")
    private Long projectId;

    @Column("user_id")
    private Long userId;

    @Column("project_role")
    private String role;
    
    @Column("invited_by")
    private Long invitedBy;

    @Column("invited_at")
    private OffsetDateTime invitedAt;

    @Column("state")
    private String state;

}
