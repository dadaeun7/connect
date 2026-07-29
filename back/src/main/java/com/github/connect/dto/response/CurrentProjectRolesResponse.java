package com.github.connect.dto.response;

import lombok.Builder;

@Builder
public record CurrentProjectRolesResponse(
    String email,
    String role
) {
}
