package com.github.connect.service;

import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.exception.custom.JoinCompanyException;
import com.github.connect.repository.JoinCompanyUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.connect.entity.User;
import com.github.connect.entity.User.RoleType;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.impl.CompanyJoinService;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JoinUserServiceImpl implements CompanyJoinService{

    private final UsersRepository usersRepository;
    private final JoinCompanyUserRepository joinCompanyUserRepository;

    @Override
    public void join(String email, String password) {

        JoinCompnayUser dtoUser = checkStatus(email);

        User companyUser = new User();
        companyUser.setName(dtoUser.getName());
        companyUser.setEmail(dtoUser.getEmail());
        String encodePassword = passwordEncode(password);
        companyUser.setPassword(encodePassword);

        companyUser.setType(RoleType.COMPANY);
        usersRepository.save(companyUser);

        joinCompanyUserRepository.deleteVerifyUser(joinCompanyUserRepository.redisVerifyKey(email));
    }

    @Override
    public String passwordEncode(String password) {

        PasswordEncoder encoder = new BcryptPassword4jPasswordEncoder();
        return encoder.encode(password);
    }


    private JoinCompnayUser checkStatus(String email){

        Optional<JoinCompnayUser> user = joinCompanyUserRepository.find(joinCompanyUserRepository.redisVerifyKey(email));

        if(user.isEmpty()){
            throw new JoinCompanyException("가입 인증 유효시간이 지났습니다. 다시 인증해주세요");
        }

        return user.get();
    }
}