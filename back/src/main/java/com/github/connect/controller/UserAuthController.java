package com.github.connect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.service.CompanyUserGetAuthService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import com.github.connect.constants.ApiConstants;


// https://adjh54.tistory.com/648


@RestController
@RequiredArgsConstructor
public class UserAuthController {
    
    private final CompanyUserGetAuthService companyUserGetAuthService;
    
    @PostMapping(ApiConstants.LOGIN_COMPANY)
    public Mono<ResponseEntity<Map<String, String>>> getKeycloakGetAuth(@RequestBody CompanyUserGetAuthReq req){

        return companyUserGetAuthService.authRequest(req)
            .map(result -> {
                if(result.containsKey("accessToken")){
                    String accessToken = result.get("accessToken");
                    return ResponseEntity.ok()
                        .header("Authorization", "Bearer " + accessToken)
                        .body(Map.of("message", "로그인 성공"));
                }

                return ResponseEntity.ok().body(result);
            });
    }
}
