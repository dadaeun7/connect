package com.github.connect.dto.internal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppTokenCacheDto {
    String clientId;
    String accessToken;
    String refreshToken;
}
