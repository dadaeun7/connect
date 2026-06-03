package com.github.connect.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;

@Configuration
@EnableR2dbcRepositories
public class PostgreConfig {
    
    @Bean
    public PostgresqlConnectionFactory postgresqlConnectionFactory(
        @Value("${spring.r2dbc.host}") String host,
        @Value("${spring.r2dbc.port}") int port,
        @Value("${spring.r2dbc.database}") String database,
        @Value("${spring.r2dbc.username}") String username,
        @Value("${spring.r2dbc.password}") String password
    ){
        PostgresqlConnectionConfiguration config = PostgresqlConnectionConfiguration
            .builder()
            .host(host)
            .port(port)
            .database(database)
            .username(username)
            .password(password)
            .build();

        return new PostgresqlConnectionFactory(config);
    }
}
