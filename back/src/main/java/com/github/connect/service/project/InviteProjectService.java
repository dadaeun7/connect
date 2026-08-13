package com.github.connect.service.project;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.github.connect.constants.ApiConstants;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.response.CurrentProjectRolesResponse;
import com.github.connect.dto.response.InviteHistoryResponse;
import com.github.connect.dto.response.InviteProjectListResponse;
import com.github.connect.entity.ProjectInvitation;
import com.github.connect.entity.Users;
import com.github.connect.repository.ProjectInvitationRepository;
import com.github.connect.repository.ProjectRoleRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.repository.UsersRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class InviteProjectService {

    private final JavaMailSender mailSender;
    private final UserCacheManager userCacheManager;
    private final UsersRepository usersRepository;
    private final ProjectInvitationRepository projectInvitationRepository;
    private final ProjectRoleRepository projectRoleRepository;

    public Mono<Void> inviteUser(Long projectId, String toEmail, String role, String fromEmail) {
        
        // 초대자
        Mono<Long> senderIdMono = userCacheManager.findCacheUserId(fromEmail);
        
        // 초대 받는자
        Mono<Optional<Users>> targetUserMono = usersRepository.findByEmail(toEmail)
                .map(Optional::of)
                .defaultIfEmpty(Optional.empty());

        return Mono.zip(senderIdMono, targetUserMono)
            .flatMap(tuple -> {
                Long senderId = tuple.getT1();
                Optional<Users> targetUserOpt = tuple.getT2();

                log.info("[Long senderId] 의 getId(): {}", senderId);

                if (targetUserOpt.isPresent()) {
                    Users targetUser = targetUserOpt.get();
                    // [케이스 A] 이미 가입된 회원인 경우
                    log.info("[targetUserOpt.isPresent()] getId() : {}", targetUser.getId());
                    
                    return projectRoleRepository.existsByProjectIdAndUserId(projectId, targetUser.getId())
                        .flatMap(exists -> {
                            if (exists) {
                                return Mono.error(new IllegalStateException("이미 프로젝트에 소속되어 있거나 초대 대기 중인 회원입니다."));
                            }
                            // 1. Project_Role에 바로 매핑 저장 (기존 1안 설계 기준: PENDING 상태)
                            return projectRoleRepository.saveProjectRole(projectId, targetUser.getId(), role, senderId, EntityFieldStandardType.INVITE_PENDING)
                                    // 2. 가입 유저이므로 UUID token은 null로 넘겨서 projectId 링크가 나가게 처리
                                .then(sendInviteMail(toEmail, null, projectId, role));
                        });
                } else {
                    // [케이스 B] 미가입 회원인 경우
                    return projectInvitationRepository.existsByProjectIdAndUserEmail(projectId, toEmail, EntityFieldStandardType.INVITE_PENDING)
                        .flatMap(exists -> {
                            if (exists) {
                                return Mono.error(new IllegalStateException("이미 초대 대기 중인 이메일입니다."));
                            }
                            
                            UUID setUuid = UUID.randomUUID();
                            // 2. 저장 후 생성된 UUID token을 넘겨서 토큰 링크가 나가게 처리
                            return projectInvitationRepository.saveProjectRole(setUuid, projectId, toEmail, role, senderId, EntityFieldStandardType.INVITE_PENDING)
                            .then(sendInviteMail(toEmail, setUuid, projectId, role));
                        });
                }
            });
    }

    public Mono<Void> checkInviteByToken(String email, UUID token){

        Mono<Long> getUserId = userCacheManager.findCacheUserId(email);
        Mono<ProjectInvitation> invitatedInfo = projectInvitationRepository.findById(token);

        return Mono.zip(getUserId, invitatedInfo)
        .flatMap(tuple ->{

            log.info("로그인 유저 ID (getT1) : {}", tuple.getT1());
            log.info("초대장 프로젝트 ID: {}, 초대한 사람: {}, 권한: {}", 
                tuple.getT2().getProjectId(), tuple.getT2().getInvitedBy(), tuple.getT2().getState());

            ProjectInvitation updateStateInvitation = tuple.getT2();
            updateStateInvitation.setState(EntityFieldStandardType.INVITE_ACCEPTED);

            return Mono.zip(projectRoleRepository.saveProjectRole(tuple.getT2().getProjectId(), tuple.getT1(), tuple.getT2().getProjectRole(), tuple.getT2().getInvitedBy(),  EntityFieldStandardType.INVITE_ACCEPTED),
                projectInvitationRepository.save(updateStateInvitation));
        })
        .then();
    }

    public Mono<Void> checkInviteByProjectId(String email, Long projectId){

        return userCacheManager.findCacheUserId(email)
            .flatMap(id -> projectRoleRepository.findByProjectIdAndUserId(projectId, id)
            .flatMap(role -> projectRoleRepository.saveProjectRole(projectId, id, role.getRole(), role.getInvitedBy(), EntityFieldStandardType.INVITE_ACCEPTED)
            ));
    }
    
    public Flux<InviteHistoryResponse> getInviteHistory(Long projectId) {

        // 1. 이미 멤버가 된 이력 (Role 기준)
        Flux<InviteHistoryResponse> joinedHistory = projectRoleRepository.getHistoryByProjectId(projectId)
            .filter(role -> !Objects.equals(role.getUserId(), role.getInvitedBy()))
            .flatMap(role -> userCacheManager.findCacheUserEmail(role.getUserId())
                .map(email -> new InviteHistoryResponse(email, role.getState(), role.getInvitedAt())));

        // 2. 아직 대기 중인 초대 이력 (Invitation 기준)
        Flux<InviteHistoryResponse> pendingHistory = projectInvitationRepository.findByProjectId(projectId);

        // 두 스트림을 순차적으로 합쳐서 하나의 Flux로 반환
        return Flux.concat(joinedHistory, pendingHistory);
    }

    public Flux<InviteProjectListResponse> getInviteProject(String email){
        return userCacheManager.findCacheUserId(email)
            .flatMapMany(id -> projectRoleRepository.findProjectNameAndRoleByProjectId(id));
    }

    public Flux<CurrentProjectRolesResponse> getCurrentInvite(Long projectId){
        return projectRoleRepository.getCurrentInviteUserByProjectId(projectId)
            .flatMap(pr -> userCacheManager.findCacheUserEmail(pr.getUserId())
                .map(email -> CurrentProjectRolesResponse.builder()
                    .email(email)
                    .role(pr.getRole())
                    .build()
                ));
    }

    public Mono<Void> exitUser(String exitEmail, Long projectId){
        return userCacheManager.findCacheUserId(exitEmail)
            .flatMap(id -> projectRoleRepository.deleteProjectRole(id, projectId))
            .flatMap(un -> projectInvitationRepository.updateInviteHistory(exitEmail, projectId));
    }

    private Mono<Void> sendInviteMail(String toEmail, UUID token, Long projectId, String role){
        return Mono.fromRunnable(()->{
            try{
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(toEmail);
                helper.setSubject("[Connect] 프로젝트 초대 메일이 도착했습니다.");

                String inviteLink = (token != null) 
                        ? String.format(ApiConstants.FRONT+"/invite/accept?token=%s", token+":"+toEmail)
                        : String.format(ApiConstants.FRONT+"/invite/accept?projectId=%s", projectId+":"+toEmail);

                String htmlContent = String.format(
                    "<div style='background-color: #fafafa; padding: 40px 20px; font-family: \"Pretendard\", \"Google Sans\", \"Gothic A1\", sans-serif; color: #111318; line-height: 1.6;'>" +
                        "  <div style='max-width: 520px; margin: 0 auto; background-color: #ffffff; padding: 32px; border: 1px solid #e4e5eb; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);'>" +
                        "    <h2 style='font-size: 20px; font-weight: 700; color: #18181b; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px;'>프로젝트 초대 알림</h2>" +
                        "    " +
                        "    <p style='font-size: 15px; color: #111318; margin-bottom: 20px;'>" +
                        "      Connect 플랫폼의 프로젝트 구성을 위해 초대 메일이 발송되었습니다.<br>" +
                        "      아래 내용을 확인하신 후 초대를 수락해 주세요." +
                        "    </p>" +
                        "    " +
                        "    <div style='background-color: #f0f1f3; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; border: 1px solid #e4e5eb;'>" +
                        "      <table style='width: 100%%; border-collapse: collapse; font-size: 14px;'>" +
                        "        <tr>" +
                        "          <td style='width: 90px; color: #5a5e6e; font-weight: 600; padding-bottom: 6px;'>초대 권한</td>" +
                        "          <td style='color: #111318; font-weight: 700; padding-bottom: 6px;'>%s</td>" +
                        "        </tr>" +
                        "        <tr>" +
                        "          <td style='color: #5a5e6e; font-weight: 600;'>안내 사항</td>" +
                        "          <td style='color: #5a5e6e;'>로그인 또는 가입 후 해당 프로젝트 구성원으로 즉시 연동됩니다.</td>" +
                        "        </tr>" +
                        "      </table>" +
                        "    </div>" +
                        "    " +
                        "    <div style='text-align: center; margin-bottom: 12px;'>" +
                        "      <a href='%s' style='display: inline-block; padding: 12px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px; transition: background-color 0.2s;'>초대 수락하기</a>" +
                        "    </div>" +
                        "  </div>" +
                        "</div>",
                        role, inviteLink
                );

                helper.setText(htmlContent,true);
                mailSender.send(message);
            }catch(Exception e){
                throw new RuntimeException("이메일 발송에 실패했습니다.",e);
            }
        });
    }
}
