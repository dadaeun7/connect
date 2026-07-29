package com.github.connect.entity;

import java.time.OffsetDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="Activity")
public class Activity {

    @Id
    private Long id;

    @Column("issue_id")
    private Long issueId;

    @Column("app_type")
    private String appType;

    @Column("resource_target")
    private String resourceTarget;

    @Column("external_event_id")
    private String externalEventId;

    @Column("activity_title")
    private String activityTitle;

    @Column("activity_content")
    private String activityContent;

    @Column("created_at")
    private OffsetDateTime createdAt;

    @Column("origin_url")
    private String originUrl;
}
