package com.github.connect.service;

import java.security.SecureRandom;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.github.connect.service.impl.EmailVerifyService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinEmailVerifyServiceImpl implements EmailVerifyService{

    private final StringRedisTemplate redisTemplate;
    private final JavaMailSenderImpl sender = new JavaMailSenderImpl();
    private SecureRandom secureRandom = new SecureRandom();

    @Override
    public void sendEmail(String email) throws MessagingException{

        String code = createVerifyCode();
        sendCodeHtmlMail(email, code);
        saveVerifyCodeToRedis(email, code);
        
    }

    @Override
    public void checkCode(String email, String code) {
        checkVerifyCodeToRedis(email, code);
    }

    private void sendCodeHtmlMail(String email, String code) throws MessagingException {

        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setText(mailContent(code),true);
        sender.send(message);
    }

    private void checkVerifyCodeToRedis(String email, String code) {

        if(!code.equals(redisTemplate.opsForValue().get(email))){
            throw new IllegalArgumentException("만료되었거나 존재하지 않는 인증 코드입니다.");
        }
    }

    private void saveVerifyCodeToRedis(String email, String code) {
        redisTemplate.opsForValue().set(email, code);
    }

    private String createVerifyCode() {

        StringBuilder code = new StringBuilder(8);
        for(int i = 0; i < 8; i++){
            code.append(secureRandom.nextInt());
        }

        return code.toString();
    }

    private String mailContent(String verificationCode){
    return "<div style=\"background-color: #000000; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #cccccc; text-align: center;\">"
            + "  <div style=\"display: inline-block; width: 50px; height: 50px; border: 1px solid rgba(0, 255, 163, 0.3); bg-color: rgba(0, 255, 163, 0.05); border-radius: 12px; line-height: 50px; font-size: 20px; font-weight: 900; color: #00FFA3; font-style: italic; margin-bottom: 24px;\">C</div>"
            + "  <h2 style=\"color: #ffffff; font-size: 24px; font-weight: 900; tracking-tight: -0.05em; text-transform: uppercase; margin-bottom: 24px;\">Please verify your identity</h2>"
            + "  "
            + "  <div style=\"max-width: 480px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);\">"
            + "    <p style=\"font-size: 14px; color: #888888; margin-top: 0; margin-bottom: 24px; font-weight: 500;\">Here is your Connect Record sudo authentication code:</p>"
            + "    "
            + "    <div style=\"font-size: 32px; font-weight: 900; color: #00FFA3; letter-spacing: 0.3em; text-align: center; margin: 32px 0; padding: 12px; background-color: #000000; border-radius: 8px; border: 1px solid rgba(0, 255, 163, 0.1);\">"
            + "      " + verificationCode + ""
            + "    </div>"
            + "    "
            + "    <p style=\"font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 12px;\">This code is valid for <strong style=\"color: #ffffff;\">15 minutes</strong> and can only be used once.</p>"
            + "    <p style=\"font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;\"><strong style=\"color: #ffffff;\">Please don't share this code with anyone.</strong> We'll never ask for it on the phone or via email.</p>"
            + "  </div>"
            + "  "
            + "  <p style=\"font-size: 11px; color: #444444; margin-top: 32px; line-height: 1.5; max-width: 480px; margin-left: auto; margin-right: auto;\">"
            + "    You're receiving this email because a verification code was requested for your Connect Record account. If this wasn't you, please ignore this email."
            + "  </p>"
            + "</div>";
    }
    
}
