package com.github.connect.dto.response;

import java.time.OffsetDateTime;

public record InviteHistoryResponse(
    String email,
    String state,
    OffsetDateTime invitedAt
) {
}