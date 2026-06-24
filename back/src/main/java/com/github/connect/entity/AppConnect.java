package com.github.connect.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table("App_Connect")
public class AppConnect {
 
    @Id
    private Long id;

    @Column("app_pk_id")
    private String appPkId;

    @Column("refresh_token")
    private String refreshToken;

    @Column("client_id")
    private String clientId;

    @Column("client_secret")
    private String clientSecret;

    private String type;
    
    @Column("user_id")
    private Long userId;

}
