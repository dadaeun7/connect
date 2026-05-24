package com.github.connect.service;

import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.exception.custom.JoinCompanyException;
import com.github.connect.repository.JoinCompanyUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.connect.entity.Users;
import com.github.connect.entity.Users.RoleType;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.impl.CompanyJoinService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class JoinUserServiceImpl implements CompanyJoinService{

    private final UsersRepository usersRepository;
    private final JoinCompanyUserRepository joinCompanyUserRepository;

    @Override
    public Mono<Void> join(String email, String password) {
        return checkStatus(email)
            .doOnNext(user -> {

                Users companyUser = new Users();
                companyUser.setName(user.getName());
                companyUser.setEmail(user.getEmail());
                String encodePassword = passwordEncode(password);
                companyUser.setPassword(encodePassword);

                companyUser.setJoinType(RoleType.COMPANY);
                usersRepository.save(companyUser);

                String key = joinCompanyUserRepository.redisVerifyKey(email);
                joinCompanyUserRepository.deleteVerifyUser(key);
            })
            .then();
    }

    @Override
    public String passwordEncode(String password) {

        PasswordEncoder encoder = new BcryptPassword4jPasswordEncoder();
        return encoder.encode(password);
    }


    private Mono<JoinCompnayUser> checkStatus(String email){

        String key = joinCompanyUserRepository.redisVerifyKey(email);
        return joinCompanyUserRepository.find(key)
        .switchIfEmpty(Mono.error(new JoinCompanyException("가입 인증 유효시간이 지났습니다. 다시 인증해주세요")))
        .flatMap(user -> {
            return Mono.just(user);
        });

    }
}