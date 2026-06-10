package com.github.connect.dto.internal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access=AccessLevel.PROTECTED)
public class KeycloakUserTokenDto {
    
    @JsonProperty("access_token")
    private String uAccessToken;

    @JsonProperty("refresh_token")
    private String uRefreshToken;

}
