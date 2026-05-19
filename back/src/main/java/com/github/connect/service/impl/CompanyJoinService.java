package com.github.connect.service.impl;

import com.github.connect.dto.internal.JoinCompnayUser;

public interface CompanyJoinService {
    
    void join(String email, String password);
    String passwordEncode(String password);

}
