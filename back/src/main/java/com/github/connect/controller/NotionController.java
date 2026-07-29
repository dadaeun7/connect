package com.github.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.connect.dto.response.NotionApiResponse;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.service.api.NotionApiService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class NotionController {

    private final NotionApiService notionApiService;

    @GetMapping("/notion/lists")
    public Flux<NotionApiResponse> getNotionLists(@LoginUser String email){

        return notionApiService.getNotionList("", "data_source", email);
    }
}
