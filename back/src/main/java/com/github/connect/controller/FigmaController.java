package com.github.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.dto.response.FigmaValidateResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.api.FigmaApiService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class FigmaController {
    
    private final FigmaApiService figmaApiService;
    
    @GetMapping("/get/figma-state")
    public Mono<FigmaValidateResponse> getFigmaState(@LoginUser String email, @RequestParam("fileUrl")String url){
        return figmaApiService.validateFigmaFile(email, url);
    }
}
