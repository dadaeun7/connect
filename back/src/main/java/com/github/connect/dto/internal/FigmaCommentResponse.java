package com.github.connect.dto.internal;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FigmaCommentResponse {
    private List<FigmaComment> comments;

    @Getter @Setter @NoArgsConstructor
    public static class FigmaComment {
        private String id;
        @JsonProperty("file_key")
        private String fileKey;
        @JsonProperty("created_at")
        private String createdAt; // "2026-07-15T01:34:00Z" (ISO-8601 포맷)
        private FigmaUser user;
        private String message;
    }

    @Getter @Setter @NoArgsConstructor
    public static class FigmaUser {
        private String handle;
    }
}