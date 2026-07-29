package com.github.connect.dto.internal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FigmaFileMetaResponse {
        // 피그마 루트 "file": { ... } 구조
    private FileMetaInfo file; 

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileMetaInfo {
        
        private String name;

        // 💡 피그마의 "thumbnail_url" 스네이크 명칭을 자바 필드에 강제 매핑
        @JsonProperty("thumbnail_url")
        private String thumbnailUrl; 

        // 💡 피그마의 "last_touched_at" 스네이크 명칭을 자바 필드에 강제 매핑
        @JsonProperty("last_touched_at")
        private String lastTouchedAt;

        private String url;
    }
}
