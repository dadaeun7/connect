package com.github.connect;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;


@SpringBootTest
@Testcontainers
public class EmailCodeTest {

    @Container
    public static GenericContainer<?> redisContainer = 
            new GenericContainer<>(DockerImageName.parse("redis:7.0"))
                    .withExposedPorts(6379)
                    .withReuse(true);

    static {
        redisContainer.start();
    }

    // Spring Boot 설정에 동적으로 Redis 포트 주입
    @DynamicPropertySource
    static void redisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redisContainer::getHost);
        // 컨테이너 내부의 6379 포트가 외부 호스트의 어떤 무작위 포트로 매핑되었는지 가져옵니다.
        registry.add("spring.data.redis.port", redisContainer::getFirstMappedPort);
    }

    @Test
    void redisTest() {
        // 테스트 로직 작성
        System.out.println("Redis 호스트: " + redisContainer.getHost());
        System.out.println("Redis 포트: " + redisContainer.getFirstMappedPort());
    }
}
