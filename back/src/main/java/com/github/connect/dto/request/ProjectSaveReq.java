package com.github.connect.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level=AccessLevel.PROTECTED)
@NoArgsConstructor
public class ProjectSaveReq {
    String name;
}
