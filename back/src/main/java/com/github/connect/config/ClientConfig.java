package com.github.connect.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
class ClientConfig {
    
    @Bean
    public WebClient keycloakClient(@Value("${spring.security.oauth2.resourceserver.base-url}") String baseUrl){
        return WebClient.builder()
        .baseUrl(baseUrl)
        .build();
    }

    @Bean
    public WebClient defauClient(){
        return WebClient.builder()
        .build();
    }
}

