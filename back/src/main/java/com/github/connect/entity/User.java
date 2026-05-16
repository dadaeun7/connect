package com.github.connect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    /**
     * @param company 자사
     * @param github 외부
     * @param gmail 외부
     */
    @Column(nullable = false, name="join_type")
    private RoleType type;

    @Column
    private String externalId;


    public enum RoleType{
        COMPANY, GITHUB, GMAIL
    } 
}
