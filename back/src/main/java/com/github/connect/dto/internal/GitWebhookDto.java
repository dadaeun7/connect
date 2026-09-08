package com.github.connect.dto.internal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GitWebhookDto {
    String owner;
    String repo;
    String hookId;
    String accessToken;
}
