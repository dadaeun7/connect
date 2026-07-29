package com.github.connect.service.project;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.request.IssueCreateRequest;
import com.github.connect.dto.request.IssueUpdateRequest;
import com.github.connect.dto.response.ActivityResponse;
import com.github.connect.dto.response.IssueHistoryResponse;
import com.github.connect.dto.response.IssueTitleListResponse;
import com.github.connect.dto.response.IssueTitleResponse;
import com.github.connect.dto.response.IssueViewResponse;
import com.github.connect.dto.response.IssueDetailResponse;
import com.github.connect.entity.Issue;
import com.github.connect.entity.IssueHistory;
import com.github.connect.repository.ActivityRepository;
import com.github.connect.repository.IssueHistoryRepository;
import com.github.connect.repository.IssueRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.service.api.GithubApiService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueService {
    
    private final ActivityRepository activityRepository;
    private final IssueRepository issueRepository;
    private final IssueHistoryRepository issueHistoryRepository;
    private final UserCacheManager userCacheManager;
    private final GithubApiService githubApiService;
    private final Clock clock;


    public Mono<Long> countAllIssue(Long projectId){
        return issueRepository.countByAllIssue(projectId);
    }

    public Flux<IssueTitleResponse> getMonthlyRange(OffsetDateTime startDate, OffsetDateTime endDate, Long projectId){
        return issueRepository.findByMonthlyRange(startDate, endDate, projectId);
    }

    public Flux<IssueTitleListResponse> getIssueTitleAllList(Long projectId){
        return issueRepository.getIssueTitleByProjectId(projectId);
    }

    public Mono<Void> createIssue(IssueCreateRequest request, String email) {
        return userCacheManager.findCacheUserId(email) 
                .flatMap(userId -> saveIssueAndHistory(request, userId) 
                        .flatMap(savedIssue -> {
                            if (savedIssue.getGithubRepoName() == null || savedIssue.getGithubRepoName().isBlank()) {
                                return Mono.empty();
                            }
                            return checkGitWebHook(email, savedIssue.getGithubRepoName(), savedIssue.getGithubRepoId())
                                    .then(updateIssueWebhookStatusByGithub(savedIssue.getId()));
                        })
                )
                .then();
    }

    private Mono<Issue> saveIssueAndHistory(IssueCreateRequest request, Long userId) {
        Issue issue = Issue.builder()
                .title(request.title())
                .state("create")
                .projectId(request.projectId())
                .statusCode(request.statusCode())
                .priorityCode(request.priorityCode())
                .dueDate(request.dueDate()) 
                .createdUser(userId)
                .modifyAt(OffsetDateTime.now(clock)) 
                .githubRepoId(request.githubRepoId())
                .githubRepoName(request.githubRepoName()) // github 웹훅 체크 시 사용
                .githubBranch(request.githubBranch())
                .figmaFileKey(request.figmaFileKey()) // figma 웹훅 체크 시 사용
                .figmaFileName(request.figmaFileName())
                .notionDbId(request.notionDbId())
                .notionDbTitle(request.notionDbTitle())
                // github_webhook 컬럼이 테이블에 false 상태로 우선 저장됩니다.
                .githubWebhook(false) 
                .build();

        return issueRepository.save(issue)
                .flatMap(savedIssue -> {
                    IssueHistory history = IssueHistory.builder()
                            .issueId(savedIssue.getId())
                            .modifierUserId(userId)
                            .category(EntityFieldStandardType.ISSUE_CREATE)
                            .content("새 이슈가 생성되었습니다.")
                            .createdAt(OffsetDateTime.now(clock))
                            .build();

                    return issueHistoryRepository.save(history)
                            .thenReturn(savedIssue); // 뒷단 처리를 위해 생성된 Issue 객체를 스트림 아래로 전달
                });
    }

    private Mono<Void> updateIssueWebhookStatusByGithub(Long issueId) {
        return issueRepository.findById(issueId)
                .flatMap(issue -> {
                    issue.setGithubWebhook(true);
                    issue.setModifyAt(OffsetDateTime.now(clock));
                    return issueRepository.save(issue);
                })
                .then();
    }

    public Mono<Void> checkGitWebHook(String email, String fullRepo, Long repoId){

        String[] splitFullRepo = fullRepo.split("/");
        String owner = splitFullRepo[0];
        String repo = splitFullRepo[1];

        return issueRepository.findRepoWebHookCheck(fullRepo, repoId)
        .defaultIfEmpty(false)
        .flatMap(hasWebhook -> {
            if(Boolean.TRUE.equals(hasWebhook)){
                log.info("이미 동일 레파지토리로 등록된 웹훅이 있어 스킵합니다. repository full name: {}", fullRepo);
                return Mono.empty();
            }
            log.info("해당 레파지토리에 등록된 웹훅이 없어 신규 등록을 합니다. {}", fullRepo);
            return githubApiService.registerGithubWebhook(email, owner, repo);
        });

    }

    public Flux<IssueViewResponse> getViewIssue(Long projectId, Long pageId){

        return issueRepository.findByProjectId(projectId, pageId * 10)
        .flatMap(issue -> {
            // 💡 2. 각 이슈 ID에 해당하는 액티비티 5개를 조회하여 단일 List로 비동기 취합 (Mono<List<ActivityResponse>>)
            return activityRepository.activityByIssueIdLimit(issue.id())
                .collectList()
                .map(activities -> {
                    // 💡 3. 수집된 최신 5개 액티비티 리스트를 넣어 최종 IssueViewResponse DTO 객체로 맵핑
                    return new IssueViewResponse(
                        new IssueTitleResponse(issue.id(), 
                        issue.title(),
                        issue.state(), 
                        issue.statusCode(),
                        issue.priorityCode(), 
                        issue.dueDate(), 
                        projectId, 
                        issue.githubRepoName(),
                        issue.figmaFileKey(),
                        issue.notionDbId(),
                        issue.modifyAt(), 
                        issue.createdAt()), 
                    activities);

                });
        });
    }

    public Mono<IssueDetailResponse> getIssueDetail(Long issueId){
        return issueRepository.findByIssueDetail(issueId);
    }

    public Flux<ActivityResponse> getIssueActivity(Long issueId, Long pageId){
        return activityRepository.activityByIssueIdAll(issueId, pageId * 10);
    }

    public Flux<IssueHistoryResponse> getIssueHistory(Long issueId) {
        return issueHistoryRepository.findByIssueId(issueId)
            .flatMap(history -> { 
                return userCacheManager.findCacheUserEmail(history.getModifierUserId())
                    .map(email -> { // 2. 단일 값 변환 map 사용
                        return IssueHistoryResponse.builder()
                            .id(history.getId())
                            .issueId(issueId)
                            .modifierEmail(email)
                            .category(history.getCategory())
                            .content(history.getContent())
                            .createdAt(history.getCreatedAt())
                            .build();
                    });
            });
    }

    public Mono<Void> deleteIssue(Long issueId){
        return issueRepository.deleteById(issueId);
    }

    public Mono<Void> updateIssue(Long issueId, IssueUpdateRequest request, String email) {

        return userCacheManager.findCacheUserId(email)
            .flatMap(userId -> issueRepository.findById(issueId)
                .switchIfEmpty(Mono.error(new NoSuchElementException("Issue not found: " + issueId)))
                .flatMap(existingIssue -> {

                    String changeLog = buildChangeLog(existingIssue, request);

                    updateIssueBasicFields(existingIssue, request);
                    updateExternalResources(existingIssue, request);

                    existingIssue.setModifyAt(OffsetDateTime.now(clock));

                    log.info("update after issue: {}, changeLog: {}", existingIssue, changeLog);
                    // 4. 저장 및 히스토리 기록
                    return issueRepository.save(existingIssue)
                        .flatMap(savedIssue -> saveHistory(savedIssue, userId, changeLog).thenReturn(savedIssue)
                        .flatMap(result -> {
                            if (!StringUtils.hasText(savedIssue.getGithubRepoName()) || savedIssue.getGithubRepoId() == null) {
                                return Mono.empty();
                            }
                            return checkGitWebHook(email, savedIssue.getGithubRepoName(), savedIssue.getGithubRepoId())
                                    .then(updateIssueWebhookStatusByGithub(savedIssue.getId()));
                        })
                        )
                        .doOnError(error -> log.error("[IssueUpdate] 저장 실패: {}", error.getMessage()));
                })
            );
    }

    private void updateIssueBasicFields(Issue existingIssue, IssueUpdateRequest request) {
        existingIssue.setPriorityCode(request.priorityCode());
        existingIssue.setStatusCode(request.statusCode());
        existingIssue.setDueDate(request.dueDate());
    }

    private void updateExternalResources(Issue existingIssue, IssueUpdateRequest request) {
        existingIssue.setGithubRepoId(request.githubRepoId());
        existingIssue.setGithubRepoName(request.githubRepoName());
        existingIssue.setGithubBranch(request.githubBranch());
        existingIssue.setFigmaFileKey(request.figmaFileKey());
        existingIssue.setFigmaFileName(request.figmaFileName());
        existingIssue.setNotionDbId(request.notionDbId());
        existingIssue.setNotionDbTitle(request.notionDbTitle());
    }

    private String buildChangeLog(Issue existingIssue, IssueUpdateRequest request) {
        List<String> changes = new ArrayList<>();

        // 기본 정보 비교
        checkAndAddChange(changes, "우선순위", existingIssue.getPriorityCode(), request.priorityCode());
        checkAndAddChange(changes, "상태", existingIssue.getStatusCode(), request.statusCode());
        checkAndAddChange(changes, "마감일", existingIssue.getDueDate(), request.dueDate());

        // 외부 리소스 비교
        checkAndAddChange(changes, "GitHub Repo", existingIssue.getGithubRepoId(), request.githubRepoId());
        checkAndAddChange(changes, "GitHub Branch", existingIssue.getGithubBranch(), request.githubBranch());
        checkAndAddChange(changes, "Figma Source", existingIssue.getFigmaFileKey(), request.figmaFileKey());
        checkAndAddChange(changes, "Notion DB", existingIssue.getNotionDbId(), request.notionDbId());

        if (changes.isEmpty()) {
            return "변경사항 없음";
        }

        return String.join(", ", changes);
    }

    private <T> void checkAndAddChange(List<String> changes, String fieldName, T oldValue, T newValue) {
        boolean isChanged;

        if (oldValue instanceof OffsetDateTime && newValue instanceof OffsetDateTime) {
            // toLocalDate()로 타임존 시차를 적용한 해당 지역의 '연-월-일'만 추출
            isChanged = !((OffsetDateTime) oldValue).toLocalDate().equals(((OffsetDateTime) newValue).toLocalDate());
        } else {
            isChanged = !Objects.equals(oldValue, newValue);
        }

        if (isChanged) {
            changes.add(String.format("[%s: %s -> %s]", 
                fieldName, 
                oldValue != null ? oldValue : "없음", 
                newValue != null ? newValue : "없음"));
        }
    }
    
    private Mono<Void> saveHistory(Issue savedIssue, Long userId, String changeLog) {
        IssueHistory history = IssueHistory.builder()
            .issueId(savedIssue.getId())
            .modifierUserId(userId)
            .category(EntityFieldStandardType.ISSUE_UPDATE)
            .content(changeLog)
            .createdAt(OffsetDateTime.now(clock))
            .build();
            
        return issueHistoryRepository.save(history).then();
    }
}
