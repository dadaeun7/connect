package com.github.connect.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubRepoResponse(
    Long id,
    @JsonProperty("full_name")
    String fullName
) {
    
}
