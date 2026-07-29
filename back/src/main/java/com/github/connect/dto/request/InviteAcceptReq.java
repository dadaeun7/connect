package com.github.connect.dto.request;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InviteAcceptReq(
    @JsonProperty("token") UUID token,
    @JsonProperty("projectId") Long projectId
) {
}