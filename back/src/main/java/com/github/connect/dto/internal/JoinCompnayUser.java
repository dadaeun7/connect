package com.github.connect.dto.internal;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class JoinCompnayUser {
    String name;
    String email;
    String code;

    public JoinCompnayUser(String name, String email, String code){
        this.name = name;
        this.email = email;
        this.code = code;
    }

}
