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
    
    @Query("SELECT u.isActive FROM \"Users\" u WHERE u.email = :email")
    Mono<String> findIsActiveByEmail(String email);

    Mono<Users> findByEmail(String email);

    @Query("SELECT u.id FROM \"Users\" u WHERE u.email = :email")
    Mono<Long> findByUserId(String email);

    @Modifying
    @Query("UPDATE \"Users\" SET is_active = :isActive WHERE email = :email")
    Mono<Integer> updateIsActiveByEmail(String email, String isActive);

    @Modifying
    @Query("DELETE FROM \"Users\" WHERE email LIKE '%@test.com'")
    Mono<Void> deleteTestUsers();

    @Modifying
    @Query("SELECT u.email FROM \"Users\" u WHERE u.id = :userId")
    Mono<String> findByUserEmail(Long userId);
}
