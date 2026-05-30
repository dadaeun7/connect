package com.github.connect.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.Users;
import reactor.core.publisher.Mono;

@Repository
public interface UsersRepository extends ReactiveCrudRepository<Users, Integer>{
    
    @Query("SELECT u.isActive FROM Users u WHERE u.email = :email")
    Mono<String> findIsActiveByEmail(String email);

    Mono<Users> findByEmail(String email);

    @Query("UPDATE Users u SET u.isActive = :isActive WHERE u.email = :email")
    Mono<Void> updateIsActiveByEmail(String email, String isActive);
}
