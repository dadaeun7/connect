package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="Project_Invite")
public class ProjectInvite {
    
    @Column("project_id")
    private Long projectId;

    @Column("user_email")
    private String userEmail;

    @Column("project_role")
    private String projectRole;

    @Column("send_at")
    private OffsetDateTime sendAt;

    @Column
    private String state;

    @Column("invite_code")
    private String inviteCode;

    @Column("expire_at")
    private OffsetDateTime expireAt;
}
