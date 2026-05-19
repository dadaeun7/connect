package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal=true)
@SuperBuilder(toBuilder = true)
public class JoinExternalUserReq extends CreateUserRequest{

    @NotBlank(message="이름은 필수 입력 항목입니다.")
    private String name;

    @NotBlank(message="외부 FK ID는 필수 항목입니다.")
    private String externalId;

    @NotBlank(message="외부 연동 주체 항목은 필수 입니다.")
    private String type;
}
