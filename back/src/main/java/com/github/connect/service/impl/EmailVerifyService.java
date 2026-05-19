package com.github.connect.service.impl;

import jakarta.mail.MessagingException;

public interface EmailVerifyService {

    void sendEmail(String name, String email);
    void checkCode(String email, String code);
}
