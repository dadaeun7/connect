package com.github.connect.service;

import java.security.SecureRandom;
import java.util.Optional;

import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.exception.custom.JoinCompanyException;
import com.github.connect.exception.custom.EmailSendException;
import com.github.connect.repository.JoinCompanyUserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.github.connect.service.impl.EmailVerifyService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinEmailVerifyServiceImpl implements EmailVerifyService{

    private final JoinCompanyUserRepository joinCompanyUserRepository;
    private final JavaMailSender mailSender;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void sendEmail(String name, String email){
        /* 중복 요청 확인 로직*/
        retryAuthToRedis(email);

        String code = createVerifyCode();
        sendCodeHtmlMail(email, code);
        joinCompanyUserRepository.saveAuthCode(name, email, code);
    }

    @Override
    public void checkCode(String email, String code) {
        JoinCompnayUser user = checkVerifyCode(email, code);
        joinCompanyUserRepository.saveVerifyUser(email, user);
        joinCompanyUserRepository.deleteAuthCode(email);
    }

    private void sendCodeHtmlMail(String email, String code){

        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[connect] 이메일 인증 번호 입니다.");
            helper.setText(mailContent(code),true);
            mailSender.send(message);

        }catch(MessagingException e){
            throw new EmailSendException(e);
        }

    }

    private void retryAuthToRedis(String email){
        if(joinCompanyUserRepository.find(email).isPresent()){
            throw new JoinCompanyException("이미 요청 된 작업이 있습니다. 메일을 확인해주세요");
        }
    }

    public JoinCompnayUser checkVerifyCode(String email, String code) {

        Optional<JoinCompnayUser> user = joinCompanyUserRepository.find(email);

        if(user.isEmpty()){
            throw new JoinCompanyException("만료된 코드로 시도되어 처리가 불가합니다.");
        }

        if(!user.get().getCode().equals(code)){
            throw new JoinCompanyException("입력하신 코드가 일치하지 않습니다. 코드를 다시 확인해주세요");
        }

        return user.get();
    }


    private String createVerifyCode() {

        StringBuilder code = new StringBuilder(8);
        for(int i = 0; i < 8; i++){
            code.append(secureRandom.nextInt(10));
        }

        return code.toString();
    }

    private String mailContent(String verificationCode){
    return "<div style=\"background-color: #000000; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #cccccc; text-align: center;\">"
            + "  <div style=\"display: inline-block; width: 50px; height: 50px; border: 1px solid rgba(0, 255, 163, 0.3); bg-color: rgba(0, 255, 163, 0.05); border-radius: 12px; line-height: 50px; font-size: 20px; font-weight: 900; color: #00FFA3; font-style: italic; margin-bottom: 24px;\">C</div>"
            + "  <h2 style=\"color: #ffffff; font-size: 24px; font-weight: 900; tracking-tight: -0.05em; text-transform: uppercase; margin-bottom: 24px;\">본인확인을 위한 인증 코드를 확인해주세요.</h2>"
            + "  "
            + "  <div style=\"max-width: 480px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);\">"
            + "    <p style=\"font-size: 14px; color: #888888; margin-top: 0; margin-bottom: 24px; font-weight: 500;\">다음은 가입에 필요한 인증 코드입니다:</p>"
            + "    "
            + "    <div style=\"font-size: 32px; font-weight: 900; color: #00FFA3; letter-spacing: 0.3em; text-align: center; margin: 32px 0; padding: 12px; background-color: #000000; border-radius: 8px; border: 1px solid rgba(0, 255, 163, 0.1);\">"
            + "      " + verificationCode + ""
            + "    </div>"
            + "    "
            + "    <p style=\"font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 12px;\">이 코드는 <strong style=\"color: #ffffff;\">15 분 동안</strong> 유효하며 한 번만 사용할 수 있습니다.</p>"
            + "    <p style=\"font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;\"><strong style=\"color: #ffffff;\">이 코드를 다른 사람과 공유하지 마세요. </strong> Connect 는 전화나 이메일을 통해 이 코드를 절대 요구하지 않습니다.</p>"
            + "  </div>"
            + "  "
            + "  <p style=\"font-size: 11px; color: #444444; margin-top: 32px; line-height: 1.5; max-width: 480px; margin-left: auto; margin-right: auto;\">"
            + "    이 이메일은 connect 계정 가입을 위한 인증 코드로 요청되어 발송되었습니다. 본인이 아닌 경우 이 이메일을 무시해주세요"
            + "  </p>"
            + "</div>";
    }
    
}
