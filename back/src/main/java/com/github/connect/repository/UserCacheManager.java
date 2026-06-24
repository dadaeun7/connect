package com.github.connect.repository;

import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.AsyncCache;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class UserCacheManager {
 
    
    private final UsersRepository usersRepository;
    private final AsyncCache<String, Long> userEmailToIdsCache;
    private final AsyncCache<Long, String> userIdToEmailCache;
    
    public Mono<Long> findCacheUserId(String email){

        CompletableFuture<Long> future = userEmailToIdsCache.getIfPresent(email);

        if(future != null) return Mono.fromFuture(future);

        return usersRepository.findByUserId(email)
        .doOnNext(userId -> 
            userEmailToIdsCache.put(email,CompletableFuture.completedFuture(userId))
        );
    }

    public Mono<String> findCacheUserEmail(Long userId){
        CompletableFuture<String> future = userIdToEmailCache.getIfPresent(userId);

        if(future != null) return Mono.fromFuture(future);

        return usersRepository.findByUserEmail(userId)
        .doOnNext(userEmail -> 
            userIdToEmailCache.put(userId, CompletableFuture.completedFuture(userEmail))
        );
    }

    public Mono<Void> saveCacheUserId(Long userId, String email){
        return Mono.fromRunnable(()-> userEmailToIdsCache.put(email, CompletableFuture.completedFuture(userId)));
    }

    public Mono<Void> saveCacheUserEmail(Long userId, String email){
        return Mono.fromRunnable(()-> userIdToEmailCache.put(userId, CompletableFuture.completedFuture(email)));
    }
}
