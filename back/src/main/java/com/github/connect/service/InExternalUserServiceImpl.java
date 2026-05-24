package com.github.connect.service;

import org.springframework.stereotype.Service;

import com.github.connect.dto.request.JoinExternalUserReq;
import com.github.connect.entity.Users;
import com.github.connect.entity.Users.RoleType;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.impl.ExternalJoinSevice;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InExternalUserServiceImpl implements ExternalJoinSevice{

    private final UsersRepository usersRepository;

    @Override
    public void join(JoinExternalUserReq userRequest) {
        
        Users externalUser = new Users();
        externalUser.setName(userRequest.getName());
        externalUser.setEmail(userRequest.getEmail());
        externalUser.setExternalId(userRequest.getExternalId());
        externalUser.setJoinType(userRequest.getType().equals("github") ? RoleType.GITHUB : RoleType.GMAIL);

        usersRepository.save(externalUser);
    }
    
}
