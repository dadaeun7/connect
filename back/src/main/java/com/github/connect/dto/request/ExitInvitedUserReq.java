package com.github.connect.dto.request;

public record ExitInvitedUserReq(
    String email,
    Long projectId
) {
}