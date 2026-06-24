package com.github.connect.dto.internal;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level=AccessLevel.PRIVATE)
@NoArgsConstructor
public class AppConnecInfoDto {
    private Long userId;
    private String clientId;
    private String secretKey;
}
