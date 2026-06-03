package com.github.connect.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "Users")
public class Users {
    
    @Id
    private Long id;

    private String uuid;
    
    private String email;

    /**
     * @param company 자사
     * @param github 외부
     * @param gmail 외부
     */
    @Column("join_type")
    private RoleType joinType;

    @Column("is_active")
    private String isActive;

    public enum RoleType{
        COMPANY, GITHUB, GMAIL
    } 
}
