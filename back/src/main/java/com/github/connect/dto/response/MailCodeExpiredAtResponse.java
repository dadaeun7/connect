package com.github.connect.dto.response;

public class MailCodeExpiredAtResponse {

    private String email;
    private long expiredAt;

    public MailCodeExpiredAtResponse(String email, long expiredAt){
        this.email = email;
        this.expiredAt = expiredAt;
    }

    public String getEmail(){
        return this.email;
    }

    public long getExpiredAt(){
        return this.expiredAt;
    }
}
