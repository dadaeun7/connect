package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level=AccessLevel.PRIVATE)
@NoArgsConstructor
public class ReAccessTokenRequest {
    
    @NotBlank(message="이메일은 필수 입력 항목입니다.")
    String email;

}
