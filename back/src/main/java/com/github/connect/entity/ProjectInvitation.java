package com.github.connect.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;

@Getter
@Table(name="Project_Invitation")
public class ProjectInvitation{
    
    @Id
    private UUID id;

    @Column("project_id")
    private Long projectId;

    @Column("email")
    private String email;

    @Column("project_role")
    private String projectRole;

    @Column("invited_by")
    private Long invitedBy;

    @Column("invited_at")
    private OffsetDateTime invitedAt;

    @Column("state")
    private String state;

    public void setState(String state){
        this.state = state;
    }
}
