package com.github.connect.dto.response;

import java.util.List;

public record IssueViewResponse(
    IssueTitleResponse preveiw,
    List<ActivityResponse> activity
) {
    
}
