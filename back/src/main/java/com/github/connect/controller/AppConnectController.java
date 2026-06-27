package com.github.connect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.internal.AppTokenCacheDto;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.app.AppConnectInfoServcie;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class AppConnectController {
    
    private final AppConnectInfoServcie appConnectInfoServcie;

    @GetMapping(ApiConstants.APP_LISTS)
    public Mono<ResponseEntity<Map<String,AppTokenCacheDto>>> getAppList(@LoginUser String email){
        
        return appConnectInfoServcie.getAppList(email)
        .map(ResponseEntity::ok);
    }
}
