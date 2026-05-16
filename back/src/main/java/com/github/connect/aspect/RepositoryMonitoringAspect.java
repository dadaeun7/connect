package com.github.connect.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class RepositoryMonitoringAspect {
 
    @Pointcut("execution(* com.github.connect.repository..*(..))")
    public void repositoryLayer() {}

    @AfterReturning(pointcut = "repositoryLayer() && execution(* save(..))",
        returning = "result")
    public void logAffterSave(JoinPoint joinPoint, Object result){
        log.info("[DB Success] Entity: {} -> Saved Content: {}",
            joinPoint.getSignature().getDeclaringType().getSimpleName(),
            result);
    }

    @Around("repositoryLayer()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        try{
            return joinPoint.proceed();
        }finally{
            long executionTime = System.currentTimeMillis() - start;
            if(executionTime >= 500){
                log.warn("[Delay Query] {}.{}() took {}ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    executionTime);
            }else{
                log.info("[Save Query] {}.{}() took {}ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    executionTime
                );
            }
        }
    }
}
