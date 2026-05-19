package com.github.connect;

import com.github.connect.service.JoinEmailVerifyServiceImpl;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.FixedHostPortGenericContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;


@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class EmailCodeTest {

    @Container
    public static GenericContainer<?> redisContainer =
            new FixedHostPortGenericContainer<>("redis:7.0")
                    .withFixedExposedPort(6379, 6379)
                    .withReuse(true);


    static {
        redisContainer.start();
    }

    @Autowired
    JoinEmailVerifyServiceImpl joinEmailVerifyService;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Test
    void redisTest() throws MessagingException {
        // 테스트 로직 작성
        System.out.println("Redis 호스트: " + redisContainer.getHost());

        String testEmail = "dadaeun7@gmail.com";
        String testName = "홍길동";
        joinEmailVerifyService.sendEmail(testName, testEmail);

        String code = stringRedisTemplate.opsForValue().get(testEmail);
        joinEmailVerifyService.checkCode(testEmail, code);

    }
}
