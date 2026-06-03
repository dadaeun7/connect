package com.github.connect.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Aspect
@Component
@Slf4j
public class RepositoryMonitoringAspect {
 
    @Pointcut("execution(* com.github.connect.repository..*(..))")
    public void repositoryLayer() {}

    @Around("repositoryLayer()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        
        long startTime = System.currentTimeMillis();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        Object result = joinPoint.proceed();

        if(result instanceof Mono){
            return ((Mono<?>) result)
            .doOnTerminate(()-> {
                long executionTime = System.currentTimeMillis() - startTime;
                log.info(setLogForm("Mono Query", className, methodName, executionTime-startTime));
            });
        } 

        if(result instanceof Flux){
            return ((Flux<?>) result)
            .doOnTerminate(()-> {
                long executionTime = System.currentTimeMillis() - startTime;
                log.info(setLogForm("Flux Query", className, methodName, executionTime-startTime));
            });
        }

        long executionTime = System.currentTimeMillis() - startTime;
        log.info(setLogForm("Sync Query", className, methodName, executionTime-startTime));
        return result;
    }

    private String setLogForm(String type, String fParam, String sParam, Long duration){

        return "["+type+" Query] " + fParam + "." +sParam + "() took "+duration+"ms";
    }
}
