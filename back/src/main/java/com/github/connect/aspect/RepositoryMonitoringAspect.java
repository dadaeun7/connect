package com.github.connect.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class RepositoryMonitoringAspect {
 
    @Pointcut("execution(* com.github.connect.repository..*(..))")
    public void repositoryLayer() {}

    private final ThreadLocal<Long> startTimeStore = new ThreadLocal<>();

    @Before("repositoryLayer()")
    public void doBefore(JoinPoint joinPoint){
        startTimeStore.set(System.currentTimeMillis());
    }

    @After("repositoryLayer()")
    public void doAfter(JoinPoint joinPoint){
        Long startTime = startTimeStore.get();

        if(startTime == null){
            return;
        }

        try{
            long executionTime = System.currentTimeMillis() - startTime;

            String fParam = joinPoint.getSignature().getDeclaringTypeName();
            String sParam = joinPoint.getSignature().getName();

            if(executionTime >= 500){
                log.warn(setLogForm("Delay", fParam, sParam, executionTime));
            }else{
                log.info(setLogForm("Save", fParam, sParam, executionTime));
            }

        }finally {
            startTimeStore.remove();
        }

    }

    private String setLogForm(String type, String fParam, String sParam, Long duration){

        return "["+type+" Query] " + fParam + "." +sParam + "() took "+duration+"ms";
    }

//    @AfterReturning(pointcut = "repositoryLayer() && execution(* save(..))",
//        returning = "result")
//    public void logAfterSave(JoinPoint joinPoint, Object result){
//        log.info("[DB Success] Entity: {} -> Saved Content: {}",
//            joinPoint.getSignature().getDeclaringType().getSimpleName(),
//            result);
//    }

//    @Around("repositoryLayer()")
//    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
//        long start = System.currentTimeMillis();
//
//        try{
//            return joinPoint.proceed();
//        }finally{
//            long executionTime = System.currentTimeMillis() - start;
//            if(executionTime >= 500){
//                log.warn("[Delay Query] {}.{}() took {}ms",
//                    joinPoint.getSignature().getDeclaringTypeName(),
//                    joinPoint.getSignature().getName(),
//                    executionTime);
//            }else{
//                log.info("[Save Query] {}.{}() took {}ms",
//                    joinPoint.getSignature().getDeclaringTypeName(),
//                    joinPoint.getSignature().getName(),
//                    executionTime
//                );
//            }
//        }
//    }
}
