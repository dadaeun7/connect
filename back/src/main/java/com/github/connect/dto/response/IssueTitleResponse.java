package com.github.connect.dto.response;

import java.time.OffsetDateTime;

public record IssueTitleResponse(
    Long id,
    String title,
    String state,
    Long statusCode,
    Long priorityCode,
    OffsetDateTime dueDate,
    Long projectId,
    String githubRepoName,
    String figmaFileKey,
    String notionDbId,   
    OffsetDateTime modifyAt,
    OffsetDateTime createdAt
) {
    
}
