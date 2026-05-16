package com.github.connect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class JoinExternalUserReq extends CreateUserRequest{
    
    @NotBlank(message="External id is required")
    private String externalId;

    @NotBlank(message="External Type is required")
    private String type;
}
