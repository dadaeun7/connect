package com.github.connect.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.github.connect.constants.ApiConstants;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;


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
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt((jwt) -> jwt.jwkSetUri(keycloakJwkSetUri))
                .bearerTokenConverter(exchange -> {
                    var cookies = exchange.getRequest().getCookies().get("accessToken");
                    if(cookies != null && !cookies.isEmpty()){
                        String tokenValue = cookies.get(0).getValue();
                        return Mono.just(new BearerTokenAuthenticationToken(tokenValue));
                    }
                    return Mono.empty();
                })
            )
            .authorizeExchange(auth -> auth
                .pathMatchers( 
                    "/auth/**", 
                    "/",  ApiConstants.ISSUE_VIEW_LIST,
                ApiConstants.REFRESH_TOKEN, ApiConstants.APP_CONNECT+"/**","/webhooks/**").permitAll()
                .anyExchange().authenticated());

        
        return http.build();
    }
}
