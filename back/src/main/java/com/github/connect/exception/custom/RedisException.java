package com.github.connect.exception.custom;

public class RedisException extends RuntimeException{

    public RedisException(String message){
        super(message);
    }
}
