package com.github.connect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import com.github.connect.constants.ApiConstants;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {


    // 운영 환경
    // CookieServerCsrfTokenRepository repository = new CookieServerCsrfTokenRepository();
    // 필요에 따라 쿠키 설정을 커스텀 가능
    // repository.setCookiePath("/");

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http){
        http
        // 개발환경 특성상 다른 도메인에서 요청이 들어오므로, csrf 는 일시적으로 비활성화
        // 운영 환경에서는 같은 도메인으로 설정하고 .csrf(csrf -> csrf.csrfTokenRepository(repository)) 으로 진행해야함
            .csrf(CsrfSpec::disable)
            .authorizeExchange(auth -> auth
                    .pathMatchers( "/auth/**", "/").permitAll()
                    .anyExchange().authenticated());
            // .passwordManagement(manage -> manage
            //     .changePasswordPage("/update-password")
            // );

        
        return http.build();
    }

    @Bean
    CorsWebFilter corsWebFilter(){
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin(ApiConstants.FRONT);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
