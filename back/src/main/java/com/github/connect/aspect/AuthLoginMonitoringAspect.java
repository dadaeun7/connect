package com.github.connect.aspect;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Aspect
@Component
public class AuthLoginMonitoringAspect {

    @Pointcut("execution(* com.github.connect.service.user.*(..))")
    public void authLoginMonitoring(){}

    @Around("authLoginMonitoring()")
    public Object monitorAuthLogin(ProceedingJoinPoint joinPoint) throws Throwable {
   
            String className = joinPoint.getSignature().getDeclaringTypeName();
            String methodName = joinPoint.getSignature().getName();
            String arguments = Arrays.toString(joinPoint.getArgs());

            Object result = joinPoint.proceed();

            if(result instanceof Mono){
                return ((Mono<?>) result)
                .doOnError(throwable -> { //  Mono.error() 확인 가능
                    log.error("[Reactive Service Error] {}.{}() | 파라미터: {}", className, methodName, arguments);
                    log.error("[Error Message] 사유: {}", throwable.getMessage());
                });
            }
            return result;

    }
}