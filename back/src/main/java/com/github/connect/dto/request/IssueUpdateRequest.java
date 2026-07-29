package com.github.connect.dto.request;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;


public record IssueUpdateRequest(
    @JsonProperty("priorityCode") Long priorityCode,
    @JsonProperty("statusCode") Long statusCode,
    @JsonProperty("dueDate") OffsetDateTime dueDate,
    // GitHub 연동 필드
    @JsonProperty("githubRepoId") Long githubRepoId,
    @JsonProperty("githubRepoName") String githubRepoName,
    @JsonProperty("githubBranch") String githubBranch,

    // Figma 연동 필드 (URL이 아닌 정규식으로 파싱된 pure key 수신)
    @JsonProperty("figmaFileKey") String figmaFileKey,
    @JsonProperty("figmaFileName") String figmaFileName,

    // Notion 연동 필드 (String으로 들어온 UUID 구조 -> java.util.UUID로 자동 변환)
    @JsonProperty("notionPageId") UUID notionPageId,
    @JsonProperty("notionPageTitle") String notionPageTitle,
    @JsonProperty("notionDbId") UUID notionDbId,
    @JsonProperty("notionDbTitle") String notionDbTitle
) {}