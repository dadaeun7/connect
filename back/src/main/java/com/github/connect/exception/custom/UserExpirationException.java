package com.github.connect.exception.custom;

public class UserExpirationException extends RuntimeException{
    public UserExpirationException(String message){
        super(message);
    }
}
