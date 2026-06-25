package com.github.connect.repository;

import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.AppConnect;

@Repository()
@Table(name ="App_Connect")
public interface AppConnectRepository extends ReactiveCrudRepository<AppConnect, Long>{
    
}
