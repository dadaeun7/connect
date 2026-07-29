package com.github.connect.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SlackEventReq {
    @JsonProperty("team_id")
    private String teamId;
    
    private String type; // "url_verification" 또는 "event_callback"
    private String challenge;
    private EventDetail event;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EventDetail {
        private String type; // "message"
        private String channel;
        private String user;
        private String text; // 답글 본문
        private String ts;   // 답글 타임스탬프
        
        @JsonProperty("thread_ts")
        private String threadTs; // 답글일 경우 존재, 원본(부모) 메시지의 ts 값

        private String subtype; // "bot_message" 등 구분
    }
}
