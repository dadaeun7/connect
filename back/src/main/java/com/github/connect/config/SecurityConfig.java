package com.github.connect.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationSuccessHandler;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {


    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http,
        @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}") String keycloakJwkSetUri) {
        http
        // keycloak는 CSRF 공격에 취약하지 않으므로 CSRF 보호를 비활성화
            .csrf(CsrfSpec::disable)
            .oauth2Login(oauth -> oauth.authenticationSuccessHandler(new RedirectServerAuthenticationSuccessHandler("/")))
            .authorizeExchange(auth -> auth
                    .pathMatchers( "/auth/**", "/").permitAll()
                    .pathMatchers("/project/**").authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(
                (jwt) -> jwt.jwkSetUri(keycloakJwkSetUri)
            ));

        
        return http.build();
    }
}
