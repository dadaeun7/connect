package com.github.connect.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.connect.dto.request.JoinCompanyUserReq;
import com.github.connect.entity.User;
import com.github.connect.entity.User.RoleType;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.impl.CompanyJoinService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinUserServiceImpl implements CompanyJoinService{

    private final UsersRepository usersRepository;

    @Override
    public void join(JoinCompanyUserReq userReqest) {
        
        
        User companyUser = new User();
        companyUser.setName(userReqest.getName());
        companyUser.setEmail(userReqest.getEmail());


        String encodePassword = passwordEncode(userReqest.getPassword());
        companyUser.setPassword(encodePassword);

        companyUser.setType(RoleType.COMPANY);
        usersRepository.save(companyUser);

    }

    @Override
    public String passwordEncode(String password) {

        PasswordEncoder encoder = new BcryptPassword4jPasswordEncoder();
        return encoder.encode(password);
    }
}
