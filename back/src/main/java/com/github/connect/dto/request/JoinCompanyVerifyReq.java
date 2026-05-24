package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class JoinCompanyVerifyReq extends CreateUserRequest{

    @NotBlank(message="인증 코드는 필수 입력 항목입니다.")
    @Size(min=8, max=8, message="인증 코드는 8자리여야 합니다.")
    private String code;

}
