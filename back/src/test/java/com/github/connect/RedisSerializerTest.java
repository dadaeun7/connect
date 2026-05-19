package com.github.connect;

import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.repository.JoinCompanyUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.FixedHostPortGenericContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;

import java.util.Optional;

@SpringBootTest
@ActiveProfiles("test")
public class RedisSerializerTest {

    @Container
    public static GenericContainer<?> redisContainer =
            new FixedHostPortGenericContainer<>("redis:7.0")
                    .withFixedExposedPort(6379, 6379)
                    .withReuse(true);


    static {
        redisContainer.start();
    }


    @Autowired
    JoinCompanyUserRepository joinCompanyUserRepository;

    @Test
    void testRedisSerial(){

        String testEmail = "dadaeun7@gmail.com";
        String testName = "홍길동";
        String testCode = "98743456";

        JoinCompnayUser user = new JoinCompnayUser(testName, testEmail,testCode);

        String targetKey = joinCompanyUserRepository.redisJoinKey(testEmail);
        joinCompanyUserRepository.saveAuthCode(targetKey, user);
        Optional<JoinCompnayUser> result = joinCompanyUserRepository.find(targetKey);
        assert(result).isPresent();
    }


}
