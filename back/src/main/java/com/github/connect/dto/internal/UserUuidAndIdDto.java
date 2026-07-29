package com.github.connect.dto.internal;

import java.util.UUID;

public record UserUuidAndIdDto(
    String uuid,
    Long id,
    String appPkId
) {
}
