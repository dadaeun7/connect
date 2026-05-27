package com.github.connect.constants;

public class ApiConstants {

    private ApiConstants() {}

    public static final String FRONT = "http://localhost:3000";
    public static final String LOGIN_AUTH_BASE = "/auth";

    public static final String LOGIN_COMPANY  = LOGIN_AUTH_BASE + "/login";
    public static final String LOGIN_GITHUB = LOGIN_AUTH_BASE + "/github";
    public static final String LOGIN_GMAIL = LOGIN_AUTH_BASE + "/gmail";

    public static final String SIGN_UP_COMPANY = LOGIN_AUTH_BASE + "/signup";
    public static final String SIGN_UP_VERIFY = LOGIN_AUTH_BASE + "/verify";
    public static final String SIGN_UP_REGISTER = LOGIN_AUTH_BASE + "/register";

    public static final String API_BASE = "/api";
    public static final String CONNECT_GITHUB = API_BASE + "/github";
    public static final String CONNECT_FIGMA = API_BASE + "/figma";
    public static final String CONNECT_NOTION = API_BASE + "/notion";
    public static final String CONNECT_SLACK = API_BASE + "/slack";

    public static final String REALM_NAME = "connect";
    public static final String KEYCLOAK_BASE = "http://localhost:8079";
    public static final String KEYCLOAK_AUTH = KEYCLOAK_BASE + "/realms/"+REALM_NAME+"/protocol/openid-connect/auth";
    public static final String KEYCLOAK_TOKEN = KEYCLOAK_BASE + "/realms/"+REALM_NAME+"/protocol/openid-connect/token";

}
