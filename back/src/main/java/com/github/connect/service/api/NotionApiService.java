package com.github.connect.service.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.response.NotionApiResponse;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotionApiService {
    
    private final UserCacheManager userCacheManager;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final AesUtil aesUtil;
    private final WebClient defauClient;

    public Flux<NotionApiResponse> getNotionList(String query, String value, String email){

        Map<String, Object> requestBody = new HashMap<>();

        // 검색어(query)가 들어온 경우 추가
        if (StringUtils.hasText(query)) {
            requestBody.put("query", query);
        }
        // sort 조건
        requestBody.put("sort", Map.of(
            "timestamp", "last_edited_time",
            "direction", "descending"
        ));
        // filter 조건 ("page" 또는 "database"일 때만 필터 추가)
        if ("page".equalsIgnoreCase(value) || "database".equalsIgnoreCase(value)) {
            requestBody.put("filter", Map.of(
                "property", "object",
                "value", value.toLowerCase(),
                "in_trash",false
            ));
        }


        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> appTokenRedisRepository.redisGetValue(id, EntityFieldStandardType.APP_NOTION))
            .flatMap(dto -> {
                String decryptedAccessToken = aesUtil.decrypt(dto.getAccessToken());

                return defauClient.post()
                .uri("https://api.notion.com/v1/search")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("Notion-Version", EntityFieldStandardType.NOTION_API_VERSION)
                .header(HttpHeaders.AUTHORIZATION, "Bearer "+ decryptedAccessToken)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> 
                    clientResponse.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            log.error("[getNotionList] Notion API 4xx Error Detail : {}", errorBody);
                            return Mono.error(new RuntimeException("Notion API Error: " + errorBody));
                        })
                )
                .bodyToMono(Map.class)
                .doOnNext(r -> log.info("[getNotionList] 결과 : {}", r))
                .doOnError(e->log.error("[getNotionList] API call error : {}", e.getMessage()));
            })
            .flatMapMany(response -> {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                if(results == null) return Flux.empty();

                return Flux.fromIterable(results).filter(item -> {String objectType = (String) item.get("object");
                    return "database".equals(objectType) || "data_source".equals(objectType);
                }).map(item -> {
                        String type = (String) item.get("object");
                        String title = extractTitle(item, type);
                        String originalId = (String) item.get("id");
                        String notionUrl = (String) item.get("url");
                        String displayType = "database";
                    return new NotionApiResponse(originalId, displayType, title, notionUrl);
                });
            })
            .doOnError(e -> log.error("[getNotionList] Pipe Line error : {}", e.getMessage()));
    }

    private String extractTitle(Map<String, Object> item, String type){
        try {
            if ("data_source".equals(type)) {
                List<Map<String, Object>> titleProp = (List<Map<String, Object>>) item.get("title");
                if (titleProp != null && !titleProp.isEmpty()) {
                    return (String) titleProp.get(0).get("plain_text");
                }
            }
        } catch (Exception e) {
            log.error("[extractTitle] Exception 발생: {}",e.getMessage());
        }
        return "Untitled";
    }
}
