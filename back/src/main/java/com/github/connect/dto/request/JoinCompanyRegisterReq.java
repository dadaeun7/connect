package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@FieldDefaults(level=AccessLevel.PRIVATE, makeFinal=true)
@SuperBuilder(toBuilder = true)
public class JoinCompanyRegisterReq extends CreateUserRequest{

    @NotBlank(message="비밀번호는 필수 입력 항목입니다.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$",
            message = "비밀번호는 8자 이상 20자 이하, 영문, 숫자, 특수문자를 모두 포함해야 합니다."
    )
    private String password;
}
