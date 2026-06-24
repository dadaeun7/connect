package com.github.connect;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.r2dbc.test.autoconfigure.DataR2dbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.github.benmanes.caffeine.cache.AsyncCache;
import com.github.connect.buffer.DatabaseTestBuffer;
import com.github.connect.buffer.ProjectWriteBuffer;
import com.github.connect.config.CacheConfig;
import com.github.connect.config.PostgreConfig;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.entity.Users;
import com.github.connect.repository.ProjectRepository;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.project.ProjectService;

import reactor.core.publisher.Flux;

@DataR2dbcTest
@ActiveProfiles("test")
@Import({CacheConfig.class, ProjectService.class, PostgreConfig.class, ProjectWriteBuffer.class, DatabaseTestBuffer.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SubQueryAnInMemoryTest {

    @Autowired
    AsyncCache<String, Long> userEmailToIdsCache;

    @Autowired
    ProjectWriteBuffer projectWriteBuffer;

    @Autowired
    DatabaseTestBuffer databaseTestBuffer;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UsersRepository usersRepository;

    private List<String> userEmails;

    private static final int TEST_SCALE = 20000;


    @BeforeEach
    void setup() throws InterruptedException{

        userEmails = IntStream.rangeClosed(1, TEST_SCALE)
            .mapToObj(i -> "user" + i + "@test.com")
            .toList();

        projectRepository.deleteTestProjects().block(Duration.ofMinutes(2));
        usersRepository.deleteTestUsers().block(Duration.ofMinutes(2));

        Instant start = Instant.now();


    // 1. 2만 개 이메일을 Users 객체 100개씩 묶은 List 200개로 변환
        List<List<Users>> chunkedContext = Flux.fromIterable(userEmails)
            .map(email -> {
                Users user = new Users();
                user.setEmail(email);
                user.setUuid(UUID.randomUUID().toString());
                user.setJoinType(Users.RoleType.COMPANY);
                user.setIsActive(EntityFieldStandardType.USER_ACTIVE);
                return user; 
            })
            .buffer(100)
            .collectList()
            .block(); // 메모리에 200개 묶음 완벽 확보

        // 2. 자바 표준 for 루프로 순차 처리 (스레드 경합 제로, 오버플로우 제로)
        if (chunkedContext != null) {
            for (List<Users> batch : chunkedContext) {
                // A. 100개 패킷이 DB에 완전히 저장될 때까지 대기 (Mono<Long> 리턴 정상 처리)
                databaseTestBuffer.bulkInsertUsers(batch).block(); 
                
                // B. 저장 후 방금 100개만 DB에서 실제 오토인크리먼트 ID 조회해서 캐시 채우기
                Flux.fromIterable(batch)
                    .concatMap(user -> usersRepository.findByUserId(user.getEmail())
                        .doOnNext(id -> {
                            userEmailToIdsCache.put(user.getEmail(), CompletableFuture.completedFuture(id));
                        })
                    )
                    .blockLast(); // 100건 예열 완료 시까지 대기
            }
        }

        System.out.println("===== 테스트용 Users 더미 데이터 Caffeine 캐시 등록완료 " + TEST_SCALE + "====== 소요시간: " + Duration.between(start, Instant.now()).toMillis() +"ms");
    }

    @AfterAll
    void cleanUpAll() throws InterruptedException{
        Thread.sleep(500);

        projectRepository.deleteTestProjects().block(Duration.ofMinutes(2));
        usersRepository.deleteTestUsers().block(Duration.ofMinutes(2));
        databaseTestBuffer.caffeineDel();

        System.out.println("===== 벤치마크 전용 데이터 (Users, PRoject) 및 캐시 초기화 완료 =====");
    }

    @Test
    void cachingQueryRealTest() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(TEST_SCALE);
        // projectWriteBuffer.setLatch(latch);

        Instant start = Instant.now();

        Flux.fromIterable(userEmails)
            .flatMap(email -> projectService.saveProject("[Test] 캐싱 쿼리 프로젝트", email))
            .blockLast();

        System.out.println("===== 2단계: 버퍼 큐에 Project 2만건 주입 완료 (백그라운드 인서트 시작) =====");

        boolean isSuccess = latch.await(3, TimeUnit.MINUTES);

        long totalElapsed = Duration.between(start, Instant.now()).toMillis();

        if (isSuccess) {
            System.out.println("✨ [벤치마크 성공] 2만건이 DB에 완벽히 저장되었습니다.");
        } else {
            System.out.println("⚠️ [벤치마크 타임아웃] 제한 시간 내에 일부 데이터가 저장되지 못했습니다.");
        }

        System.out.println("⏱️ 최초 캐시 조회부터 최종 DB 저장 완료까지 총 소요시간: " + totalElapsed + " ms");

        // 4. 최종 저장 개수 눈으로 확인
        Long finalCount = projectRepository.count().block();
        System.out.println("📊 최종 검증 - 실제 DB에 저장된 Project 총 개수: " + finalCount + " / 20000");
    }


    // @Test
    // void subQueryRealTest(){
    //     Instant start = Instant.now();

    //     Flux.fromIterable(userEmails)
    //     .flatMap(email -> projectService.saveProjectWithUserEmail("[Test] 서브쿼리 프로젝트", email))
    //     .collectList()
    //     .block(Duration.ofMinutes(5));

    //     long elapsed = Duration.between(start, Instant.now()).toMillis();
    //     System.out.println("===== [실제 DB] SQL 서브쿼리 방식 총 소요시간: " + elapsed + " ms =====");
    // }

}
