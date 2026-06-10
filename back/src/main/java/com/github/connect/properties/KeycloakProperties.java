package com.github.connect.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "spring.keycloak")
@Getter @Setter
public class KeycloakProperties {
    private String baseUrl;
    private String clientId;
    private String username;
    private String password;
    private String secretClient;
    private String gmailRedirectUrl;
    private String githubRedirectUrl;
}