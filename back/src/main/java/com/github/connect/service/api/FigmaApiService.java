package com.github.connect.service.api;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.FigmaFileMetaResponse;
import com.github.connect.dto.response.FigmaValidateResponse;
import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.service.app.FigmaConnectIntegration;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class FigmaApiService{

    private final AesUtil aesUtil;
    private final UserCacheManager userCacheManager;
    private final AppTokenRedisRepository appTokenRedisRepository;
    private final WebClient defauClient;
    private final FigmaConnectIntegration figmaConnectIntegration;


    private static final Pattern FIGMA_URL_PATTERN =
        Pattern.compile("https://([\\w\\.-]+)?figma\\.com/[^/]+/([a-zA-Z0-9_-]{16,50})");

    public Mono<FigmaValidateResponse> validateFigmaFile(String email, String url){
        String fileKey = extractFigmaFileKey(url);

        if(fileKey == null){
            return Mono.just(FigmaValidateResponse.error("올바른 피그마 파일 URL 형식이 아닙니다."));
        }

        return userCacheManager.findCacheUserId(email)
        .flatMap(id -> appTokenRedisRepository.redisGetValue(id, EntityFieldStandardType.APP_FIGMA)
            .flatMap(dto -> requestFigmaFile(fileKey, aesUtil.decrypt(dto.getAccessToken()))
                .onErrorResume(e -> {
                    log.info("Figma Access Token 만료로 재발급 시도합니다");
                    return figmaConnectIntegration.getRefreshAccessToken(email)
                        // .flatMap(newToken -> newAccessTokenRedisSave(id, newToken))
                        .flatMap(newToken -> requestFigmaFile(fileKey, newToken));
                })
                .map(apiResponse -> new FigmaValidateResponse(true, fileKey, apiResponse.getFile().getName(), apiResponse.getFile().getUrl(), "success"))
                .onErrorResume(e->{
                    log.error("Figma 검증 최종 실패: {}",e.getMessage());
                    return Mono.just(FigmaValidateResponse.error("피그마 리소스를 가져올 수 없습니다."));
                })));
    }

    private Mono<FigmaFileMetaResponse> requestFigmaFile(String fileKey, String accessToken){
        return defauClient.get()
            .uri("https://api.figma.com/v1/files/{fileKey}/meta", fileKey)
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .onStatus(status -> status.isError(), clientResponse ->
                        Mono.error(new RuntimeException("Figma API 호출 실패 "+clientResponse.statusCode())))
            .bodyToMono(FigmaFileMetaResponse.class)
            .doOnError(error -> log.error("[requestFigmaFile] fileKey: {}, accessToken: {}, error: {}",
                fileKey, accessToken, error.getMessage()
            ));
    }

    public String extractFigmaFileKey(String url){
        if(url == null) return null;
        Matcher matcher = FIGMA_URL_PATTERN.matcher(url);
        return matcher.find() ? matcher.group(2) : null;
    }
}