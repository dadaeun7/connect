package com.github.connect.dto.internal;

public record AppRefreshDto(String refreshToken, String clientId, String clientSecret) {
}
