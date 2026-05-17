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
    
    @NotBlank(message="External id is required")
    private String externalId;

    @NotBlank(message="External Type is required")
    private String type;
}
