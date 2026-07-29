package com.github.connect.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InvtieUserReq(
    @JsonProperty("projectId") Long projectId,
    @JsonProperty("role") String role,
    @JsonProperty("toEmail") String toEmail
){

}
