package com.github.connect.aspect;

import java.util.concurrent.atomic.AtomicBoolean;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Aspect
@Component
public class AppApiMonitoringAspect {
    
    private static final Logger log = LoggerFactory.getLogger(AppApiMonitoringAspect.class);

    @Pointcut("execution(* com.github.connect.service.api..*(..)) || " +
                "execution(* com.github.connect.service.repository.AppTokenRedisRepository..*(..)) || " +
                "execution(* com.github.connect.service.config.CacheConfig..*(..))")
    public void githubApiServiceMethods() {}

    @Around("githubApiServiceMethods()")
    public Object apiLogReactiveStream(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();

        log.info("[App Api AOP] Method start : {} | Args : {}",methodName, args);

        Object result = joinPoint.proceed();

        if (result instanceof Flux) {
            AtomicBoolean hasData = new AtomicBoolean(false);
            return ((Flux<?>) result)
                    .doOnNext(data -> {
                        hasData.set(true);
                        log.info("[Reactive-AOP] ✅ [Flux Data] {} -> Emission: {}", methodName, data);
                    })
                    .doOnComplete(() -> {
                        if (!hasData.get()) {
                            log.warn("[Reactive-AOP] ⚠️ [Flux Empty] {} finished with NO data.", methodName);
                        } else {
                            log.info("[Reactive-AOP] 🏁 [Flux Complete] {}", methodName);
                        }
                    })
                    .doOnError(error -> log.error("[Reactive-AOP] ❌ [Flux Error] {} -> Message: {}", methodName, error.getMessage()));
        }

        // 2. 반환 타입이 Mono인 경우
        if (result instanceof Mono) {
            AtomicBoolean hasData = new AtomicBoolean(false);
            return ((Mono<?>) result)
                    .doOnNext(data -> {
                        hasData.set(true);
                        log.info("[Reactive-AOP] ✅ [Mono Data] {} -> Emission: {}", methodName, data);
                    })
                    .doOnSuccess(data -> {
                        if (!hasData.get()) {
                            log.warn("[Reactive-AOP] ⚠️ [Mono Empty] {} finished with NO data (Empty).", methodName);
                        }
                    })
                    .doOnError(error -> log.error("[Reactive-AOP] ❌ [Mono Error] {} -> Message: {}", methodName, error.getMessage()));
        }

        // 일반 객체 반환 시 그대로 반환
        return result;
    }
}
