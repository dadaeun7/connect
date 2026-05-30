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
@Table(name = "Users")
public class Users {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String uuid;
    
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * @param company 자사
     * @param github 외부
     * @param gmail 외부
     */
    @Column(nullable = false, name="join_type", columnDefinition = "SMALLINT")
    private RoleType joinType;

    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private String isActive;


    public enum RoleType{
        COMPANY, GITHUB, GMAIL
    } 
}
