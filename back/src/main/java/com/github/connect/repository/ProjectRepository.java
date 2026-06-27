package com.github.connect.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.github.connect.dto.response.ProjectListResponse;
import com.github.connect.entity.Project;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository()
@Table(name="Project")
public interface ProjectRepository extends ReactiveCrudRepository<Project, Long>{
    
    // find ------------------------------------------------------------------------
    @Query("SELECT p.id as id, p.name as name, pr.project_role as my_role " +
           "FROM \"Project\" p " +
           "JOIN \"Project_Role\" pr ON p.id = pr.project_id " +
           "WHERE pr.user_id = :userId")
    Flux<ProjectListResponse> findProjectsByUserId(Long userId);

    // test ------------------------------------------------------------------------
    //테스트를 위해 만든 메소드로 실제 운영 환경에서 사용하지 않음
    @Query("SELECT p.id, p.name FROM \"Project\" p JOIN \"Users\" u ON "
    +"p.user_id=u.id WHERE u.email=:email")
    Flux<ProjectListResponse> findProjectsByUserEmail(String email);

    @Modifying
    @Query("INSERT INTO \"Project\" (name, user_id) "+
        "SELECT :name, u.id FROM \"Users\" u WHERE u.email =:email")
    Mono<Void> saveProjectWithUserEmail(String name, String email);

    @Modifying
    @Query("DELETE FROM \"Project\" WHERE name LIKE '[Test]%'")
    Mono<Void> deleteTestProjects();
}
