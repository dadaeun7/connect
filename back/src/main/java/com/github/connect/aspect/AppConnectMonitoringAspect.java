package com.github.connect.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class AppConnectMonitoringAspect {
    
    @Pointcut("execution(* com.github.connect.service.app.*(..))")
    public void appConnectMonitoring(){}

    @AfterThrowing(value = "appConnectMonitoring()", throwing = "e")
    public void errorAppConnectService(JoinPoint joinPoint, Exception e){
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.error("[APP CONNECT MONITOR ERROR] 메서드: {}, 수신자: {}, 에러 메세지: {}", methodName, args[0], e.getMessage());
    }
}
