package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.internal.AppRefreshDto;
import com.github.connect.dto.internal.NotionReConnectDto;
import com.github.connect.entity.AppConnect;

import reactor.core.publisher.Mono;

@Repository()
@Table(name ="App_Connect")
public interface AppConnectRepository extends ReactiveCrudRepository<AppConnect, Long>{

    @Query("SELECT ac.refresh_token, ac.client_id, ac.client_secret FROM \"App_Connect\" ac WHERE ac.user_id = :userId AND ac.type = :type")
    Mono<AppRefreshDto> getClientInfo(Long userId, String type);

    @Query("SELECT ac.client_id, ac.client_secret FROM \"App_Connect\" ac WHERE ac.user_id = :userId AND ac.type = 'NOTION'")
    Mono<NotionReConnectDto> getNotionInfo(Long userId);

    @Query("SELECT ac.app_pk_id FROM \"App_Connect\" ac WHERE ac.user_id = :userId "
        +" AND ac.type = 'SLACK' "
    )
    Mono<String> getAppPkId(Long userId);

    @Query("DELETE FROM \"App_Connect\" ac WHERE ac.user_id = :userId "+
        "AND ac.type = :type")
    Mono<Void> deleteAppInfo(Long userId, String type);

}
