package com.github.connect.constants;

public class ApiConstants {

    private ApiConstants() {}

    public static final String FRONT = "http://localhost:3000";
    public static final String BACK = "http://localhost:8080";
    
    // ******************** auth 
    public static final String LOGIN_AUTH_BASE = "/auth";
    public static final String LOGIN_COMPANY  = LOGIN_AUTH_BASE + "/login";
    public static final String LOGIN_GITHUB = LOGIN_AUTH_BASE + "/github";
    public static final String LOGIN_GMAIL = LOGIN_AUTH_BASE + "/gmail";

    // ******************** retoken 
    public static final String REFRESH_TOKEN = "/retoken";

    // ******************** app connect  
    public static final String API_BASE = "/api";
    public static final String APP_PREPARE = API_BASE + "/oauth/prepare";
    public static final String APP_CONNECT = API_BASE + "/auth/callback";

    // ******************** project 
    public static final String PROJECT_BASE = "/project";
    public static final String PROJECT_LIST_UP = PROJECT_BASE + "/list";
    public static final String PROJECT_SAVE = PROJECT_BASE + "/save";

    // ******************* app
    public static final String APP_LISTS = "/app/list";
}
