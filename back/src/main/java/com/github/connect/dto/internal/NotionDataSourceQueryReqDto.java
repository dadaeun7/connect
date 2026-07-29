package com.github.connect.dto.internal;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotionDataSourceQueryReqDto {
    
    private final Filter filter;

    @Getter
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Filter {
        // "last_edited_time" 또는 "created_time"
        private final String timestamp; 

        @JsonProperty("last_edited_time")
        private final LastEditedTimeCondition lastEditedTime;
    }

    @Getter
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class LastEditedTimeCondition {
        // ISO 8601 형식 문자열 (예: "2026-07-22T00:00:00.000Z")
        private final String after; 
    }
}
