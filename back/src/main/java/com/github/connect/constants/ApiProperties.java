package com.github.connect.constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class ApiProperties {

    @Value("${app.front.base}")
    private String frontBaseUrl;

    @Value("${app.backend.base}")
    private String backendBaseUrl;

    public static String FRONT;
    public static String BACK;

    @PostConstruct
    public void init() {
        FRONT = this.frontBaseUrl;
        BACK = this.backendBaseUrl;
    }
}