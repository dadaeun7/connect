package com.github.connect.dto.response;

import java.time.OffsetDateTime;

public record ActivityResponse(
    String appType,
    String resourceTarget,
    String activityTitle,
    String activityContent,
    OffsetDateTime createdAt,
    String originUrl
) {
    
}
