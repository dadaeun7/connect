package com.github.connect.dto.response;

public record IssueDetailResponse(
    // 외부 리소스 연동 스펙 (순수 문자열 처리 및 파싱용 데이터)
    String githubRepoName,
    String githubBranch,    
    Long githubRepoId,
    String figmaFileKey,
    String figmaFileName,
    String notionDbId,      
    String notionDbTitle
) {

}
