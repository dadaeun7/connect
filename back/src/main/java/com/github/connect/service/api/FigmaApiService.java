package com.github.connect.service.api;

import org.springframework.stereotype.Service;

import com.github.connect.repository.AppTokenRedisRepository;
import com.github.connect.util.AesUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FigmaApiService{


    private final AesUtil aesUtil;
    private final AppTokenRedisRepository appTokenRedisRepository;
}