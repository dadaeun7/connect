package com.github.connect.buffer;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.AsyncCache;
import com.github.connect.entity.Users;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class DatabaseTestBuffer {
    
    private final AsyncCache<String, Long> userEmailToIdsCache;
    private final DatabaseClient databaseClient;


    public void caffeineDel(){
        userEmailToIdsCache.asMap().clear(); 
    }

    public Mono<Long> bulkInsertUsers(List<Users> users){
        if(users.isEmpty()) return Mono.just(0L);

        String insertUsersQuery = users.stream()
                    .map(u -> 
                            String.format(
                        "('%s','%s','%s','%s')", 
                                u.getUuid().replace("'", "''"),
                                u.getEmail().replace("'", "''"),
                                u.getJoinType().name(),
                                u.getIsActive().replace("'", "''")
                    ))
                    .collect(Collectors.joining(", "));

        String sql = "INSERT INTO \"Users\" (uuid, email, join_type, is_active) VALUES"+insertUsersQuery;

        return databaseClient.sql(sql)
        .fetch()
        .rowsUpdated();
    }

}
