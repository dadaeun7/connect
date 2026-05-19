package com.github.connect.controller;

import com.github.connect.constants.ApiConstants;
import com.github.connect.dto.request.JoinCompanyInfoReq;
import com.github.connect.dto.request.JoinCompanyRegisterReq;
import com.github.connect.dto.request.JoinCompanyVerifyReq;
import com.github.connect.service.JoinEmailVerifyServiceImpl;
import com.github.connect.service.JoinUserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class UserController{

    private final JoinUserServiceImpl joinUserService;
    private final JoinEmailVerifyServiceImpl joinEmailVerifyService;

    @PostMapping(ApiConstants.SIGN_UP_COMPANY)
    public ResponseEntity<String> joinForm(JoinCompanyInfoReq joinCompanyInfoReq){

        joinEmailVerifyService.sendEmail(joinCompanyInfoReq.getName(), joinCompanyInfoReq.getEmail());
        return ResponseEntity.status(201).body("success send email");
    }

    @PostMapping(ApiConstants.SIGN_UP_VERIFY)
    public ResponseEntity<String> codeCheck(JoinCompanyVerifyReq joinCompanyVerifyReq){

        joinEmailVerifyService.checkCode(joinCompanyVerifyReq.getEmail(),joinCompanyVerifyReq.getCode());
        return ResponseEntity.status(201).body("success verify code");
    }

    @PostMapping(ApiConstants.SIGN_UP_REGISTER)
    public ResponseEntity<String> register(JoinCompanyRegisterReq joinCompanyRegisterReq){
        joinUserService.join(joinCompanyRegisterReq.getEmail(), joinCompanyRegisterReq.getPassword());
        return ResponseEntity.status(201).body("success join");
    }

}
