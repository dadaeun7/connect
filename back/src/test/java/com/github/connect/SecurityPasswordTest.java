package com.github.connect;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class SecurityPasswordTest {

    @Test
    void testPassword(){

        String testPassword = "Test12@3%";
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String result = encoder.encode(testPassword);
        assertThat(encoder.matches(testPassword, result)).isTrue();

    }
}
