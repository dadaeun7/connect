package com.github.connect.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KeycloakStandardDto {
    private String responseType;
    private String clientId;
    private String redirectUrl;
    private String scope;
    private String state;

    @Builder
    public KeycloakStandardDto(
        String responseType,
        String clientId,
        String redirectUrl,
        String scope,
        String state
    ){
        this.responseType = responseType;
        this.clientId = clientId;
        this.redirectUrl = redirectUrl;
        this.scope = scope;
        this.state = state;
    }
}
