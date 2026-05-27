package com.github.connect.service.impl;

import reactor.core.publisher.Mono;

public interface EmailVerifyService {

    Mono<Void> sendEmail(String name, String email);
    Mono<Void> checkCode(String email, String code);
}
