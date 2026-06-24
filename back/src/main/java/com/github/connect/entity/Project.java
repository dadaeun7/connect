package com.github.connect.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="Project")
public class Project {
    @Id
    private Long id;
    private String name;

    @Column("user_id")
    private Long userId;
}
