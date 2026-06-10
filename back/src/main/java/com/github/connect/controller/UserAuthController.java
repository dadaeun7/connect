package com.github.connect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.result.view.Rendering;

import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.dto.request.ReAccessTokenRequest;
import com.github.connect.properties.KeycloakProperties;
import com.github.connect.service.CompanyUserGetAuthService;
import com.github.connect.service.UserRefreshToAccessService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import com.github.connect.constants.ApiConstants;


// https://adjh54.tistory.com/648


@RestController
@RequiredArgsConstructor
public class UserAuthController {
    
    private final CompanyUserGetAuthService companyUserGetAuthService;
    private final UserRefreshToAccessService userRefreshToAccessService;
    private final KeycloakProperties keycloakProperties;

    @PostMapping(ApiConstants.LOGIN_COMPANY)
    public Mono<ResponseEntity<Map<String, String>>> getKeycloakGetAuth(@RequestBody CompanyUserGetAuthReq req){

        return companyUserGetAuthService.authRequest(req)
            .map(result -> {
                if(result.containsKey("accessToken")){
                    String accessToken = result.get("accessToken");
                    return ResponseEntity.ok()
                        .header("Authorization", "Bearer " + accessToken)
                        .body(Map.of("loginIn", "로그인 성공"));
                }

                return ResponseEntity.ok().body(result);
            });
    }

    @PostMapping(ApiConstants.REFRESH_TOKEN)
    public Mono<ResponseEntity<String>> refreshToAccessToken(@RequestBody ReAccessTokenRequest req){
        return userRefreshToAccessService.getReAccessToken(req.getEmail())
        .map(result -> {
            return ResponseEntity.ok()
            .header("Authorization", "Bearer " + result.toString())
            .body("Token refreshed successfully");
        });
    }
}
