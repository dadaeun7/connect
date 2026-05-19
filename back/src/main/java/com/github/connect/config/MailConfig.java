package com.github.connect.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    JavaMailSender mailSender(
            @Value("${spring.mail.host}") String host,
            @Value("${spring.mail.port}") int port,
            @Value("${spring.mail.username}") String username,
            @Value("${spring.mail.password}") String password,
            @Value("${spring.mail.properties.mail.smtp.auth}") Boolean auth,
            @Value("${spring.mail.properties.mail.smtp.starttls.enable}") Boolean tlsEnable,
            @Value("${spring.mail.properties.mail.smtp.starttls.required}") Boolean tlsRequired,
            @Value("${spring.mail.properties.mail.smtp.connectiontimeout}") int cTimeout,
            @Value("${spring.mail.properties.mail.smtp.timeout}") int timeout,
            @Value("${spring.mail.properties.mail.smtp.writetimeout}") int wTimeout
    ){
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", tlsEnable);
        props.put("mail.smtp.starttls.required", tlsRequired);

        props.put("mail.smtp.connectiontimeout", cTimeout);
        props.put("mail.smtp.timeout", timeout);
        props.put("mail.smtp.writetimeout", wTimeout);

        return mailSender;
    }
}
