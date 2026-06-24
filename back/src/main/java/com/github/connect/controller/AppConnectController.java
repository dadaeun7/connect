package com.github.connect.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.service.app.AppConnectInfoServcie;
import com.github.connect.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class AppConnectController {
    
    private final AppConnectInfoServcie appConnectInfoServcie;

    @GetMapping(ApiConstants.APP_LISTS)
    public Mono<ResponseEntity<Map<String,AppTokenCacheDto>>> getAppList(@CookieValue(name="accessToken", required = false) String accessToken){
        
        if(accessToken == null){
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }
        
        String userEmail = JwtUtil.extractEmail(accessToken);
        
        return appConnectInfoServcie.getAppList(userEmail)
        .map(ResponseEntity::ok);
    }
}
