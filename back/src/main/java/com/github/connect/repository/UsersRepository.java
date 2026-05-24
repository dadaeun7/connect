package com.github.connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer>{
    
}
