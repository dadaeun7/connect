package com.github.connect.exception.custom;

public class UserNotActiveException extends RuntimeException{
    public UserNotActiveException(String message){
        super(message);
    }
}
