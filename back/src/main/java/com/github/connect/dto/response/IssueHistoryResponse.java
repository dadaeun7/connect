package com.github.connect.dto.response;

import java.time.OffsetDateTime;

import lombok.Builder;

@Builder
public record IssueHistoryResponse(
    Long id,
    Long issueId,
    String modifierEmail,
    String category,
    String content,
    OffsetDateTime createdAt
) {

}
