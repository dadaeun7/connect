package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.Users;
import reactor.core.publisher.Mono;

@Repository()
@Table(name = "Users")
public interface UsersRepository extends ReactiveCrudRepository<Users, Long>{
    
    @Query("SELECT u.isActive FROM Users u WHERE u.email = :email")
    Mono<String> findIsActiveByEmail(String email);

    Mono<Users> findByEmail(String email);

    @Modifying
    @Query("UPDATE \"Users\" SET is_active = :isActive WHERE email = :email")
    Mono<Integer> updateIsActiveByEmail(String email, String isActive);
}
