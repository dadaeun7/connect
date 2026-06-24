package com.github.connect.config.resolver;

import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.stereotype.Component;

import org.springframework.core.MethodParameter;
import com.github.connect.global.common.annotation.LoginUser;
import com.github.connect.util.JwtUtil;

import reactor.core.publisher.Mono;

@Component
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver{
    

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
            return parameter.hasParameterAnnotation(LoginUser.class)
                && parameter.getParameterType().equals(String.class);
    }

    @Override
    public Mono<Object> resolveArgument(MethodParameter parameter, BindingContext bindingContext,
            ServerWebExchange exchange) 
    {
        var cookies = exchange.getRequest().getCookies().get("accessToken");

        if(cookies == null || cookies.isEmpty()){
            return Mono.empty();
        }

        String accessToken = cookies.get(0).getValue();
        try{
            String email = JwtUtil.extractEmail(accessToken);

            if(email == null || email.isBlank()){
                return Mono.empty();
            }
            return Mono.just(email);
        }catch(Exception e){
            System.out.println("accessToken 디코딩 중 에러 발생 e :" + e.getMessage());
            return Mono.empty();
        }
    }
}
