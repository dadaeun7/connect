package com.github.connect.dto.request;

public record UpdateUserInfoReq(
    String name,
    String affiliation
) {
}