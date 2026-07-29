package com.github.connect.dto.response;

public record FigmaValidateResponse(
    Boolean success,
    String fileKey,
    String name,
    String url,
    String message
) {
    public static FigmaValidateResponse error(String message){
        return new FigmaValidateResponse(false, "", "", "", message);
    }
}
