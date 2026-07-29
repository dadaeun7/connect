package com.github.connect.dto.internal;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotionQueryResponse {
    private List<NotionPage> results;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class NotionPage {
        private String id;
        private String url;

        @JsonProperty("created_time")
        private String createdTime;

        @JsonProperty("last_edited_time")
        private String lastEditedTime;
        
        private Map<String, NotionProperty> properties; // 상세 타이틀 추출용
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class NotionProperty {
        private String id;
        private String type; // "title", "number" 등
        private List<NotionTitle> title; // type이 "title"일 때 채워짐
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class NotionTitle {
        @JsonProperty("plain_text")
        private String plainText;
        private NotionText text;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class NotionText {
        private String content;
    }
}
