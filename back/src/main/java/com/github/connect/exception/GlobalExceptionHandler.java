package com.github.connect.exception;

import com.github.connect.dto.response.DefaultErrorResponse;
import com.github.connect.exception.custom.UserNotActiveException;
import com.github.connect.exception.custom.EmailSendException;
import com.github.connect.exception.custom.KeycloakConnectException;

import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import org.eclipse.angus.mail.util.MailConnectException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.SocketTimeoutException;

@RestControllerAdvice
public class GlobalExceptionHandler extends Throwable{

    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<DefaultErrorResponse> handleMessagingException(EmailSendException ex){

        MessagingException mex = (MessagingException) ex.getCause();
        Exception statusEx = mex.getNextException();

        if(statusEx instanceof AuthenticationFailedException){
            return createDefaultErrorResponse("서버 내부 설정에 문제가 발생했습니다. 관리자에게 문의하세요", 506);
        }

        if(statusEx instanceof SendFailedException){
            return createDefaultErrorResponse("유효하지 않은 이메일입니다. 다시 확인 후 요청해주세요", 404);
        }

        if(statusEx instanceof SocketTimeoutException || statusEx instanceof MailConnectException) {
            return createDefaultErrorResponse("서버 네트워크 상태 확인이 필요합니다. 관리자에게 문의하세요", 502);
        }

        return createDefaultErrorResponse("알 수 없는 에러가 발생했습니다. 관리자에게 문의하세요", 500);
    }

    @ExceptionHandler(UserNotActiveException.class)
    public ResponseEntity<DefaultErrorResponse> handleCodeException(UserNotActiveException e){
        return createDefaultErrorResponse(e.getMessage(), 401);
    }

    @ExceptionHandler(KeycloakConnectException.class)
    public ResponseEntity<DefaultErrorResponse> handleKeycloakConnectException(KeycloakConnectException e){
        return createDefaultErrorResponse(e.getMessage(), 500);
    }

    private ResponseEntity<DefaultErrorResponse> createDefaultErrorResponse(String message, int statusCode){
        DefaultErrorResponse response = new DefaultErrorResponse(message, statusCode);
        return new ResponseEntity<>(response, response.getStatusCode());
    }
}
