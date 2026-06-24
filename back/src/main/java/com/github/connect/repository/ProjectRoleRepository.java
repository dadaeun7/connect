package com.github.connect.repository;

import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.entity.ProjectRole;

@Repository()
@Table(name ="Project_Role")
public interface ProjectRoleRepository extends ReactiveCrudRepository<ProjectRole, Long>{
    
}
