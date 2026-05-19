package com.github.connect.dto.response;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponse;

public class DefaultErrorResponse implements ErrorResponse{

    private final String message;
    private final int status;

    public DefaultErrorResponse(String message, int status){
        this.message = message;
        this.status = status;
    }

    @Override
    public HttpStatusCode getStatusCode() {
        return HttpStatusCode.valueOf(this.status);
    }

    @Override
    public ProblemDetail getBody() {
        return ProblemDetail.forStatusAndDetail(getStatusCode(),this.message);
    }
}
