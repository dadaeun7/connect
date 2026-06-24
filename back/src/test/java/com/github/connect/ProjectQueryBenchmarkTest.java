package com.github.connect;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.dto.response.ProjectListResponse;
import com.github.connect.repository.ProjectRepository;
import com.github.connect.repository.UsersRepository;
import com.github.connect.service.project.ProjectService;

import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

@ExtendWith(MockitoExtension.class)
public class ProjectQueryBenchmarkTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
    }
 
    private static final List<String> SCENARIO1_USER_EMAILS = generateEmails(1, 100);
    private static final List<String> SCENARIO2_USER_EMAILS = generateEmails(1, 10000);

    private static List<String> generateEmails(int start, int end) {
        return java.util.stream.IntStream.rangeClosed(start, end)
                .mapToObj(i -> "user" + i + "@test.com")
                .toList();
    }

    // =========================================================
    // V1: email -> findByUserId(email) -> userId -> findProjectsByUserId(userId) (N+1)
    // =========================================================

    // @Test
    // @DisplayName("시나리오1: 유저 100명 - V1(N+1) 측정")
    // void scenario1_v1_benchmark() {
    //     mockV1();
    //     runWebFluxBenchmark("시나리오1-V1(N+1)", SCENARIO1_USER_EMAILS,
    //             email -> projectService.getProjectsWtihUserId(email));
    // }

    // @Test
    // @DisplayName("시나리오2: 유저 10,000명 - V1(N+1) 측정")
    // void scenario2_v1_benchmark() {
    //     mockV1();
    //     runWebFluxBenchmark("시나리오2-V1(N+1)", SCENARIO2_USER_EMAILS,
    //             email -> projectService.getProjectsWtihUserId(email));
    // }

    @Test
    @DisplayName("시나리오3: 유저 100명 - V2(JOIN) 측정")
    void scenario1_v2_benchmark(){
        mockV2();
        runWebFluxBenchmark("시나리오3-V2(JOIN)", SCENARIO1_USER_EMAILS, 
            email -> projectService.getProjectsWithUserEmail(email)
        );
    }

    @Test
    @DisplayName("시나리오4: 유저 100명 - V2(JOIN) 측정")
    void scenario2_v2_benchmark(){
        mockV2();
        runWebFluxBenchmark("시나리오3-V2(JOIN)", SCENARIO2_USER_EMAILS, 
            email -> projectService.getProjectsWithUserEmail(email)
        );
    }

    // private void mockV1() {
    //     // email -> userId 조회 (DB round-trip 1ms 시뮬레이션)
    //     Mockito.when(usersRepository.findByUserId(Mockito.anyString()))
    //             .thenAnswer(invocation -> Mono.just((long) (Math.random() * 100))
    //                     .delayElement(Duration.ofMillis(1)));

    //     // userId -> project 목록 조회 (DB round-trip 1ms 시뮬레이션, 결과 2~5건)
    //     Mockito.when(projectRepository.findProjectsByUserId(Mockito.anyLong()))
    //             .thenAnswer(invocation -> Flux.range(0, 2 + (int) (Math.random() * 4))
    //                     .map(i -> new ProjectListResponse((long) i, "project" + i))
    //                     .delayElements(Duration.ofMillis(1)));
    // }

    private void mockV2(){
        Mockito.when(projectRepository.findProjectsByUserEmail(Mockito.anyString()))
            .thenAnswer(invocation -> Flux.range(0,2+(int) (Math.random() * 4))
                .map(i->new ProjectListResponse((long)i, "project" + i, EntityFieldStandardType.ROLE_AMDIN))
                .delayElements(Duration.ofMillis(1)));
    }

    /**
     * 동기식 MVC 환경을 시뮬레이션하는 벤치마크 실행기
     * : Tomcat의 Thread-per-request(기본 200개 풀) 모델을 반영하여 동시 다발적 요청 처리
     */
    public <I, T> void runMvcBenchmark(String label, List<I> inputs, Function<I, Flux<T>> queryFn) {
        int tomcatMaxThreads = 200;
        ExecutorService executor = Executors.newFixedThreadPool(tomcatMaxThreads);
        
        AtomicLong totalNanos = new AtomicLong();
        
        // 1. Warm-up
        int warmUpSize = Math.min(10, inputs.size());
        for (int i = 0; i < warmUpSize; i++) {
            // 내부에서 block()을 걸어 동기식 예열 처리
            queryFn.apply(inputs.get(i)).collectList().block(Duration.ofSeconds(5));
        }

        Instant overallStart = Instant.now();
        List<Future<Long>> futures = new ArrayList<>();

        // 2. 동시 요청 밀어넣기
        for (I input : inputs) {
            futures.add(executor.submit(() -> {
                long start = System.nanoTime();
                
                // 💡 핵심: Flux 스트림을 collectList().block()하여 
                // 해당 스레드가 DB 응답을 받을 때까지 멈추는(Blocking) MVC 환경을 시뮬레이션합니다.
                queryFn.apply(input).collectList().block(Duration.ofSeconds(30)); 
                
                long elapsed = System.nanoTime() - start;
                totalNanos.addAndGet(elapsed);
                return elapsed;
            }));
        }

        // 3. 모든 스레드의 작업 완료 대기
        for (Future<Long> future : futures) {
            try {
                future.get(30, TimeUnit.SECONDS);
            } catch (Exception e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("MVC 벤치마크 실행 중 타임아웃 또는 인터럽트 발생", e);
            }
        }

        Instant overallEnd = Instant.now();
        executor.shutdown();

        long totalMs = Duration.between(overallStart, overallEnd).toMillis();
        double avgMs = totalNanos.get() / 1_000_000.0 / inputs.size();

        System.out.printf("""
            ===== %s (Spring Boot MVC 환경) =====
            동시 요청 유저 수: %d (톰캣 스레드 풀: %d)
            총 소요시간 (Total Wall-Clock Time): %d ms
            유저별 평균 응답시간 (Avg Latency): %.3f ms
            ==============================================
            """, label, inputs.size(), tomcatMaxThreads, totalMs, avgMs);
    }

    /**
     * 리액티브 WebFlux 환경을 대변하는 벤치마크 실행기
     * : Netty의 Event Loop 모델을 반영하여 단 하나의 논블로킹 파이프라인으로 처리
     */
    public <I, T> void runWebFluxBenchmark(String label, List<I> inputs, Function<I, Flux<T>> queryFn) {
        // 1. Warm-up (리액티브 스케줄러 활성화 및 JIT 컴파일러 예열)
        Flux.fromIterable(inputs.subList(0, Math.min(10, inputs.size())))
                .flatMap(input -> queryFn.apply(input).collectList())
                .blockLast(Duration.ofSeconds(30));

        Instant overallStart = Instant.now();

        // 2. 비동기 논블로킹 요청 스트리밍
        // 대량의 유저 데이터가 들어와도 이벤트 루프 스레드를 차단(Block)하지 않고 한 번에 파이프라인으로 구동
        List<List<T>> totalResults = Flux.fromIterable(inputs)
                .flatMap(input -> queryFn.apply(input).collectList()) // 각 유저별 프로젝트 목록을 비동기(Flux)로 동시 집계
                .collectList() // 모든 유저의 응답이 준비되면 리스트로 병합
                .block(Duration.ofSeconds(30)); // 💡 스트림의 시작부터 끝까지 논블로킹을 유지하다가 마지막에 단 1번만 블록

        Instant overallEnd = Instant.now();
        long totalMs = Duration.between(overallStart, overallEnd).toMillis();

        System.out.printf("""
            ===== %s (Spring Boot WebFlux 환경) =====
            동시 요청 유저 수: %d (네티 이벤트 루프 가동)
            총 소요시간 (Total Wall-Clock Time): %d ms
            유저별 평균 응답시간 (이론적 추정): %.3f ms
            ==============================================
            """, label, inputs.size(), totalMs, (double) totalMs / inputs.size());
    }

}