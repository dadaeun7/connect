package com.github.connect.controller;

import org.springframework.web.bind.annotation.RestController;
import com.github.connect.service.CompanyUserGetAuthService;

import lombok.RequiredArgsConstructor;


// https://adjh54.tistory.com/648


@RestController
@RequiredArgsConstructor
public class UserAuthController {
    
    private final CompanyUserGetAuthService companyUserGetAuthService;
    
    // @PostMapping(ApiConstants.LOGIN_COMPANY)
    // public Mono<ResponseEntity<String>> getKeycloakGetAuth(@RequestBody CompanyUserGetAuthReq req){

    // }
}
