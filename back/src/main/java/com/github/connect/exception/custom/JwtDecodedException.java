package com.github.connect.exception.custom;

public class JwtDecodedException extends RuntimeException{
    public JwtDecodedException(String message){
        super(message);
    }
}
