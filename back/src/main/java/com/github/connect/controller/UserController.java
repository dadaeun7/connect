package com.github.connect.controller;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.JoinCompanyInfoReq;
import com.github.connect.dto.request.JoinCompanyRegisterReq;
import com.github.connect.dto.request.JoinCompanyVerifyReq;
import com.github.connect.service.JoinEmailVerifyServiceImpl;
import com.github.connect.service.JoinUserServiceImpl;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class UserController{

    private final JoinUserServiceImpl joinUserService;
    private final JoinEmailVerifyServiceImpl joinEmailVerifyService;

    @PostMapping(ApiConstants.SIGN_UP_COMPANY)
    public Mono<ResponseEntity<String>> joinForm(@RequestBody JoinCompanyInfoReq joinCompanyInfoReq){

        return joinEmailVerifyService.sendEmail(joinCompanyInfoReq.getName(), joinCompanyInfoReq.getEmail()).
         then(Mono.just(ResponseEntity.status(201).body("success send email")));
    }

    @PostMapping(ApiConstants.SIGN_UP_VERIFY)
    public Mono<ResponseEntity<String>> codeCheck(@RequestBody JoinCompanyVerifyReq joinCompanyVerifyReq){

        return joinEmailVerifyService.checkCode(joinCompanyVerifyReq.getEmail(),joinCompanyVerifyReq.getCode())
        .then(Mono.just(ResponseEntity.status(201).body("success verify code")));
    }

    @PostMapping(ApiConstants.SIGN_UP_REGISTER)
    public Mono<ResponseEntity<String>> register(@RequestBody JoinCompanyRegisterReq joinCompanyRegisterReq){
        return joinUserService.join(joinCompanyRegisterReq.getEmail(), joinCompanyRegisterReq.getPassword())
        .then(Mono.just(ResponseEntity.status(201).body("success join")));
    }

}
