package com.github.connect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MailCodeExpiredAtResponse {

    private String email;
    private long expiredAt;

}
