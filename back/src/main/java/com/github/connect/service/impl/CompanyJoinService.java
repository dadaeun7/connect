package com.github.connect.service.impl;


import reactor.core.publisher.Mono;

public interface CompanyJoinService {
    
    Mono<Void> join(String email, String password);
    String passwordEncode(String password);

}
