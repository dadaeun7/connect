package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.internal.UserUuidAndIdDto;
import com.github.connect.dto.response.UserInfoResponse;
import com.github.connect.entity.Users;
import reactor.core.publisher.Mono;

@Repository()
@Table(name = "Users")
public interface UsersRepository extends ReactiveCrudRepository<Users, Long>{
    
    @Modifying
    @Query("DELETE FROM \"Users\" u WHERE u.email = :email")
    Mono<Void> withDrawUser(String email);

    @Query("SELECT u.isActive FROM \"Users\" u WHERE u.email = :email")
    Mono<String> findIsActiveByEmail(String email);

    @Query("INSERT INTO \"Users\" (uuid, email, join_type, is_active) " +
           "VALUES (:uuid, :email, :joinType, :isActive) " +
           "ON CONFLICT (email) DO NOTHING")
    Mono<Void> insertIgnoreOnConflict(String uuid, String email, String joinType, String isActive);

    Mono<Users> findByEmail(String email);

    @Query("SELECT u.id FROM \"Users\" u WHERE u.email = :email")
    Mono<Long> findByUserId(String email);

    @Modifying
    @Query("UPDATE \"Users\" SET is_active = :isActive WHERE email = :email")
    Mono<Integer> updateIsActiveByEmail(String email, String isActive);

    @Modifying
    @Query("DELETE FROM \"Users\" WHERE email LIKE '%@test.com'")
    Mono<Void> deleteTestUsers();

    @Query("SELECT u.email FROM \"Users\" u WHERE u.id = :userId")
    Mono<String> findByUserEmail(Long userId);

    @Query("SELECT u.uuid, u.id, ac.app_pk_id FROM \"Users\" u "+
        "JOIN \"App_Connect\" ac ON u.id = ac.user_id "+
        "WHERE u.email = :email AND ac.type = 'SLACK'")
    Mono<UserUuidAndIdDto> findUuidAndUserIdByEmail(String email);

    @Query("SELECT u.name, u.email, u.affiliation, u.join_type FROM \"Users\" u WHERE u.email = :email")
    Mono<UserInfoResponse> getUserInfo(String email);

    @Modifying
    @Query("UPDATE \"Users\" SET name = :name, affiliation = :affiliation WHERE email = :email")
    Mono<Integer> updateUserInfo(String name, String affiliation, String email);
}
