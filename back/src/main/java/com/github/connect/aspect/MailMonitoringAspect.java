package com.github.connect.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class MailMonitoringAspect {
    
    @Pointcut("execution(* com.github.connect.service.JoinEmailVerifyServiceImpl.*(..)")
    public void emailServiceMethods(){}

    @AfterReturning("emailServiceMethods()")
    public void successMailService(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        if(args.length > 1){
            log.info("[MAIL MONITOR SUCCESS 2차] 메서드 : {}, 수신자: {}, 코드: {}, 시간: {}", methodName, args[0], args[1], System.currentTimeMillis());
        }else{
            log.info("[MAIL MONITOR SUCCESS 1차] 메서드: {}, 수신자: {}, 시간: {}", methodName, args[0], System.currentTimeMillis());
        }
    }

    @AfterThrowing("emailServiceMethods()")
    public void errorMailService(JoinPoint joinPoint, Exception e){
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.error("[MAIL MONITOR ERROR] 메서드: {}, 수신자: {}, 에러 메세지: {}", methodName, args[0], e.getMessage());
    }
}
