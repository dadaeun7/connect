package com.github.connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.connect.entity.User;

public interface UsersRepository extends JpaRepository<User, Integer>{
    
}
