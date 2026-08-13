package com.github.connect.constants;

public class ApiConstants {

    private ApiConstants() {}

    public static final String FRONT = ApiProperties.FRONT;
    public static final String BACK = ApiProperties.BACK;
    
    // ******************** auth 
    public static final String LOGIN_AUTH_BASE = "/auth";
    public static final String LOGIN_COMPANY  = LOGIN_AUTH_BASE + "/login";
    public static final String LOGIN_GITHUB = LOGIN_AUTH_BASE + "/github";
    public static final String LOGIN_GMAIL = LOGIN_AUTH_BASE + "/gmail";
    public static final String LOGOUT = "/user/logout";
    public static final String WITHDRAW = "/user/withdraw";

    // ******************** info 
    public static final String GET_INFO = "/info";
    public static final String UPDATE_INFO = "/update/info";

    // ******************** retoken 
    public static final String REFRESH_TOKEN = "/retoken";

    // ******************** app connect  
    public static final String API_BASE = "/api";
    public static final String APP_PREPARE = API_BASE + "/oauth/prepare";
    public static final String NOTION_REPREPARE = API_BASE + "/oauth/reprepare";
    public static final String APP_CONNECT = API_BASE + "/auth/callback";
    public static final String APP_DELETE = API_BASE + "/app/delete";

    // ******************** project 
    public static final String PROJECT_BASE = "/project";
    public static final String PROJECT_LIST_UP = PROJECT_BASE + "/list";
    public static final String PROJECT_SAVE = PROJECT_BASE + "/save";

    // ******************* app
    public static final String APP_LISTS = "/app/list";

    // ******************* issue
    public static final String ISSUE_COUNT = "/issue/count";
    public static final String ISSUE_VIEW_LIST = "/issue/view/list";
    public static final String ISSUE_MONTH_LIST = "/issue/month/list";
    public static final String ISSUE_DETAIL = "/issue/detail";
    public static final String ISSUE_CREATED = "/issue/create";
    public static final String ISSUE_MODIFY = "/issue/modify";
    public static final String ISSUE_DELETE = "/issue/delete";
    public static final String ISSUE_TITLE_LIST = "/issue/title/list";
    public static final String ISSUE_HISTORY_LIST = "/issue/history/list";
    public static final String ISSUE_ACTIVITY_LIST = "/issue/activity/list";

    // ******************* new issue
    public static final String KEYWORD_CREATE = "/new-issue/keyword/create";
    public static final String KEYWORD_DELETE = "/new-issue/keyword/delete";
    public static final String GET_NEW_ISSUE = "/new-issue/get";
    public static final String GET_NEW_MERGE = "/new-issue/merge";
    public static final String DELETE_NEW_ISSUE = "/new-issue/delete";
    public static final String KEYWORD_GET = "/keyword/get";

    // ******************* invite
    public static final String INVITE_USER = "/invite/user";
    public static final String INVITE_ACCEPT = "/invite/accept";
    public static final String INVITE_HISTORY_LIST = "/invite/history/list";
    public static final String INVITE_PROJECT_LIST = "/invite/project/list";
    public static final String INVITE_CURRENT_USERS = "/invite/current/users";
    public static final String INVITE_USER_EXIT = "/invite-user/exit";
}
