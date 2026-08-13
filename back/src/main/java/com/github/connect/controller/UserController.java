package com.github.connect.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.UpdateUserInfoReq;
import com.github.connect.dto.response.UserInfoResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.user.UsersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UsersService usersService;

        @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @Value("${app.cookie.same-site}")
    private String cookieSameSite;

    @Value("${app.cookie.domain:}")
    private String cookieDomain;

    @GetMapping(ApiConstants.GET_INFO)
    public Mono<UserInfoResponse> getUserInfo(@LoginUser String email){
        return usersService.getUserInfo(email);
    }

    @PostMapping(ApiConstants.UPDATE_INFO)
    public Mono<Void> updateUserInfo(@RequestBody UpdateUserInfoReq req, @LoginUser String email){
        return usersService.updateUserInfo(req.name(), req.affiliation(), email);
    }

    @PostMapping(ApiConstants.LOGOUT)
    public Mono<Void> userLogout(@LoginUser String email, ServerWebExchange exchange){
        exchange.getResponse().addCookie(deleteCookie());
        return usersService.userLogout(email);
    }

    @PostMapping(ApiConstants.WITHDRAW)
    public Mono<Void> userWithDraw(@LoginUser String email, ServerWebExchange exchange){
        exchange.getResponse().addCookie(deleteCookie());
        return usersService.userWithdraw(email);
    }

    private ResponseCookie deleteCookie(){
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from("accessToken", "")
            .httpOnly(true)
            .secure(cookieSecure)
            .path("/")
            .maxAge(0);

        if(cookieSameSite != null && !cookieSameSite.isBlank()){
            builder.sameSite(cookieSameSite);
        }

        if(cookieDomain != null && !cookieDomain.isBlank()){
            builder.domain(cookieDomain);
        }

        return builder.build();
    }
}
