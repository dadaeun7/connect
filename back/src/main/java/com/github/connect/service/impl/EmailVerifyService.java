package com.github.connect.service.impl;

import jakarta.mail.MessagingException;

public interface EmailVerifyService {
    void sendEmail(String email) throws MessagingException;
    void checkCode(String email, String code);
}
