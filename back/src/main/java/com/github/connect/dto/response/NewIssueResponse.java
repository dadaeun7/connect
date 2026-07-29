package com.github.connect.dto.response;

import java.time.OffsetDateTime;

public record NewIssueResponse(
    Long id,
    String matchKeyword,
    String status,
    OffsetDateTime createdAt,
    String originalMessage,
    String slackUrl,
    String detectedMessage
) {
    
}
