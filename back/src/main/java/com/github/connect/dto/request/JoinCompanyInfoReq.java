package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal=true)
@SuperBuilder(toBuilder = true)
public class JoinCompanyInfoReq extends CreateUserRequest{

    @NotBlank(message = "이름은 필수 입력 항목입니다")
    private String name;
}
