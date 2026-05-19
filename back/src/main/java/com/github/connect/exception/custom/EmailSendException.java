package com.github.connect.exception.custom;

import jakarta.mail.MessagingException;

public class EmailSendException extends RuntimeException{
    public EmailSendException(MessagingException cause){
        super(cause);
    }
}
