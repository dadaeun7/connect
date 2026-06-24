package com.github.connect.entity;

import java.time.Instant;
import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="Milestone")
public class Milestone {
    
    @Id
    private Long id;

    private String title;

    private String description;

    @Column("due_date")
    private OffsetDateTime dueDate;

    @Column("modify_at")
    private Instant modifyAt;

    @Column("modify_user")
    private Long modifyUser;

    @Column("created_at")
    private Instant createAt;

    @Column("created_user")
    private Long createdUser;

    @Column("project_id")
    private Long projectId;
}
