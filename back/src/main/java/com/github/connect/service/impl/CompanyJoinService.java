package com.github.connect.service.impl;

import com.github.connect.dto.request.JoinCompanyUserReq;

public interface CompanyJoinService {
    
    void join(JoinCompanyUserReq userReqest);
    String passwordEncode(String password);

}
