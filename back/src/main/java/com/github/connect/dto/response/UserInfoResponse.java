package com.github.connect.dto.response;

public record UserInfoResponse(
    String name,
    String email,
    String affiliation,
    String joinType
) {
} 