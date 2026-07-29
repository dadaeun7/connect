package com.github.connect.constants;

public class EntityFieldStandardType {

    private EntityFieldStandardType(){}

    public static final String USER_PENDING = "PENDING";
    public static final String USER_ACTIVE = "ACTIVE";
    public static final String USER_SUSPENDED = "SUSPENDED";

    public static final String APP_GITHUB = "GITHUB";
    public static final String APP_FIGMA = "FIGMA";
    public static final String APP_NOTION = "NOTION";
    public static final String APP_SLACK = "SLACK";

    public static final String ROLE_AMDIN = "ADMIN";
    public static final String ROLE_WRITER = "EDITOR";
    public static final String ROLE_VIEWER = "VIEWER";

    public static final String INVITE_PENDING = "PENDING";
    public static final String INVITE_ACCEPTED = "ACCEPTED";
    public static final String INVITE_EXPIRED = "EXPIRED";
    public static final String INVITE_EXIT = "EXIT";

    public static final String ISSUE_COMPLETE = "COMPLETE";
    public static final String ISSUE_CREATE = "CREATE";
    public static final String ISSUE_UPDATE = "UPDATE";
    public static final String ISSUE_MERGE = "MERGE";
    public static final String ISSUE_OPEN= "OPEN";


    public static final String NOTION_API_VERSION = "2026-03-11";
}