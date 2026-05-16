package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class JoinCompanyUserReq extends CreateUserRequest{

    @NotBlank(message="Password id is required")
    private String password;
}
