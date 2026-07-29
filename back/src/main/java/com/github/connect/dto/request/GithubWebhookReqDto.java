package com.github.connect.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class GithubWebhookReqDto {
    private final String name;
    private final Boolean active;
    private final List<String> events;
    private final WebhookConfig config;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class WebhookConfig {
        @JsonProperty("url")
        private final String url;

        @JsonProperty("content_type")
        private final String contentType; // "json"으로 설정

        @JsonProperty("insecure_ssl")
        private final String insecureSsl;

        @JsonProperty("secret")
        private final String secret; // Webhook 검증용 비밀키 (선택)
    }
}
