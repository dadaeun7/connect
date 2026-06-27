package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.internal.AppRefreshDto;
import com.github.connect.entity.AppConnect;

import reactor.core.publisher.Mono;

@Repository()
@Table(name ="App_Connect")
public interface AppConnectRepository extends ReactiveCrudRepository<AppConnect, Long>{

    @Query("SELECT ac.refresh_token, ac.client_id, ac.client_secret FROM \"App_Connect\" WHERE ac.user_id = :userId")
    Mono<AppRefreshDto> getClientInfo(Long userId);
}
