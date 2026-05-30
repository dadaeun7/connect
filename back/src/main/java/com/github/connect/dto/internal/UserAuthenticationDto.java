package com.github.connect.dto.internal;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserAuthenticationDto {
    String uuid;
    String email;

    public UserAuthenticationDto(String uuid, String email){
        this.uuid = uuid;
        this.email = email;
    }

}
