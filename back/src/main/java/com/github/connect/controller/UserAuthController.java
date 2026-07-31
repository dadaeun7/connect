package com.github.connect.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.dto.request.CompanyUserGetAuthReq;
import com.github.connect.dto.request.ReAccessTokenRequest;
import com.github.connect.entity.Users;
import com.github.connect.service.user.CompanyUserGetAuthService;
import com.github.connect.service.user.ExternalUserGetAuth;
import com.github.connect.service.user.UserRefreshToAccessService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import com.github.connect.constants.ApiConstants;


// https://adjh54.tistory.com/648


@RestController
@RequiredArgsConstructor
public class UserAuthController {
    
    private final CompanyUserGetAuthService companyUserGetAuthService;
    private final UserRefreshToAccessService userRefreshToAccessService;
    private final ExternalUserGetAuth externalUserGetAuth;

    @PostMapping(ApiConstants.LOGIN_COMPANY)
    public Mono<ResponseEntity<Map<String, String>>> getKeycloakGetAuth(@RequestBody CompanyUserGetAuthReq req){

        return companyUserGetAuthService.authRequest(req)
            .map(result -> {
                if(result.containsKey("accessToken")){
                    String accessToken = result.get("accessToken");
                    return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, setCookie(accessToken).toString())
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
            .header(HttpHeaders.SET_COOKIE, setCookie(result).toString())
            .body("Token refreshed successfully");
        });
    }

    @GetMapping(ApiConstants.LOGIN_GMAIL)
    public Mono<ResponseEntity<Void>> getKeycloakGetGoogle(@RequestParam("code") String code){
        return externalUserGetAuth.getExternalAuth(code, ApiConstants.BACK+ApiConstants.LOGIN_GMAIL, Users.RoleType.GMAIL)
        .map(result -> {
            String accessToken = result.get("accessToken");
            return ResponseEntity.status(HttpStatusCode.valueOf(302))
            .location(URI.create(ApiConstants.FRONT+"/"))
            .header(HttpHeaders.SET_COOKIE, setCookie(accessToken).toString())
            .build();
        });
    }

    @GetMapping(ApiConstants.LOGIN_GITHUB)
    public Mono<ResponseEntity<Void>> getKeycloakGetGithub(@RequestParam("code") String code){

        return externalUserGetAuth.getExternalAuth(code, ApiConstants.BACK+ApiConstants.LOGIN_GITHUB, Users.RoleType.GITHUB)
        .map(result -> {
            String accessToken = result.get("accessToken");
            return ResponseEntity.status(HttpStatusCode.valueOf(302))
            .location(URI.create(ApiConstants.FRONT+"/"))
            .header(HttpHeaders.SET_COOKIE, setCookie(accessToken).toString())
            .build();
        });
    }

    private ResponseCookie setCookie(String accessToken){
        return ResponseCookie.from("accessToken", accessToken)
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(3600)
            .build();
    }
}
