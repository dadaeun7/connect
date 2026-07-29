package com.github.connect.service.project;

import java.time.Clock;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.internal.SlackHookInfoDto;
import com.github.connect.dto.response.NewIssueResponse;
import com.github.connect.entity.IssueHistory;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.IssueHistoryRepository;
import com.github.connect.repository.NewIssueRepository;
import com.github.connect.repository.ProjectRoleRepository;
import com.github.connect.repository.SlackHookInfoRedisRepository;
import com.github.connect.repository.UserCacheManager;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class NewIssuesService {
 
    private final SlackHookInfoRedisRepository slackHookInfoRedisRepository;
    private final AppConnectRepository appConnectRepository;
    private final UserCacheManager userCacheManager;
    private final NewIssueRepository newIssueRepository;
    private final IssueHistoryRepository issueHistoryRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final Clock clock;

    public Mono<Void> registrySlackInfo(String email, String keyword){

        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> appConnectRepository.getAppPkId(id)
                .flatMap(teamId -> {
                    SlackHookInfoDto dto = new SlackHookInfoDto();
                    dto.setKeyword(keyword);
                    dto.setUserId(id);

                    return slackHookInfoRedisRepository.redisSetKey(teamId, dto);
                })
        ).then();
    }

    public Mono<Void> deleteNewIssue(Long newIssueId){
        return newIssueRepository.deleteNewIssue(newIssueId)
        .then();
    }

    public Flux<NewIssueResponse> getNewIssue(Long projectId, String email){
        return userCacheManager.findCacheUserId(email)
        .flatMap(id -> projectRoleRepository.getAdmingUserId(projectId, id))
            .flatMapMany(adminId -> newIssueRepository.getByUserId(adminId));
    }

    public Mono<Void> deleteKeyword(String email){
        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> appConnectRepository.getAppPkId(id)
                .flatMap(teamId -> slackHookInfoRedisRepository.redisDeleteValue(teamId)));
    }

    public Mono<String> getIssueKeyword(Long projectId,String email){
        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> projectRoleRepository.getAdmingUserId(projectId, id))
                .flatMap(adminId -> newIssueRepository.getIssueKeyword(adminId));
    }

    public Mono<Void> mergeIssue(String email, Long issueId, Long newIssueId){
        
        return userCacheManager.findCacheUserId(email)
            .flatMap(id->{
                IssueHistory history = IssueHistory.builder()
                    .issueId(issueId)
                    .modifierUserId(id)
                    .category(EntityFieldStandardType.ISSUE_MERGE)
                    .content(String.format("새이슈 [%s] 번과 머지되었습니다.", newIssueId.toString()))
                    .createdAt(OffsetDateTime.now(clock))  
                    .build();

                Mono<IssueHistory> saveHistoryMono = issueHistoryRepository.save(history);
                Mono<Void> updateStatusMono = newIssueRepository.updateNewIssueState(EntityFieldStandardType.ISSUE_MERGE, newIssueId);

                return Mono.zip(saveHistoryMono,updateStatusMono);
            }).then();
    }
 
}
