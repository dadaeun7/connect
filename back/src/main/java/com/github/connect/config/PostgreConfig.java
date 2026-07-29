package com.github.connect.config;

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import io.r2dbc.spi.ConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableR2dbcRepositories
public class PostgreConfig extends AbstractR2dbcConfiguration {

    @Value("${spring.r2dbc.host}") 
    private String host;
    
    @Value("${spring.r2dbc.port}") 
    private int port;
    
    @Value("${spring.r2dbc.database}") 
    private String database;
    
    @Value("${spring.r2dbc.username}") 
    private String username;
    
    @Value("${spring.r2dbc.password}") 
    private String password;

    // 1. PostgresqlConnectionFactory 전용 구성 빈 선언
    @Bean
    public PostgresqlConnectionFactory postgresqlConnectionFactory() {
        PostgresqlConnectionConfiguration config = PostgresqlConnectionConfiguration.builder()
            .host(host)
            .port(port)
            .database(database)
            .username(username)
            .password(password)
            .timeZone("Asia/Seoul")
            .build();

        return new PostgresqlConnectionFactory(config);
    }

    // 2. 부팅 에러를 내던 추상 메서드를 상단 빈과 완벽히 동치 처리
    @Override
    @Bean
    public ConnectionFactory connectionFactory() {
        return postgresqlConnectionFactory();
    }

    // 3. 내장 컨버터 풀에 LocalDateTime ↔ OffsetDateTime 변환기 안전하게 주입
    @Override
    @Bean
    public R2dbcCustomConversions r2dbcCustomConversions() {
        List<Object> converters = new ArrayList<>();
        converters.add(new LocalDateTimeToOffsetDateTimeConverter());
        converters.add(new OffsetDateTimeToLocalDateTimeConverter());
        
        return new R2dbcCustomConversions(getStoreConversions(), converters);
    }

    // 4. DB의 LocalDateTime(드라이버 파싱 파편) -> 자바 엔티티의 OffsetDateTime 매핑
    @ReadingConverter
    public static class LocalDateTimeToOffsetDateTimeConverter implements Converter<LocalDateTime, OffsetDateTime> {
        @Override
        public OffsetDateTime convert(LocalDateTime source) {
            if (source == null) {
                return null;
            }
            // Asia/Seoul 시간대 가중치(+09:00)를 명시적으로 부여하여 OffsetDateTime 생성
            return source.atOffset(ZoneOffset.ofHours(9));
        }
    }

    // 5. 자바 엔티티의 OffsetDateTime -> DB 적재용 LocalDateTime 매핑
    @WritingConverter
    public static class OffsetDateTimeToLocalDateTimeConverter implements Converter<OffsetDateTime, LocalDateTime> {
        @Override
        public LocalDateTime convert(OffsetDateTime source) {
            if (source == null) {
                return null;
            }
            return source.toLocalDateTime();
        }
    }
}