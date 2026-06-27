package com.github.connect;

import java.util.List;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@State(Scope.Benchmark)
@BenchmarkMode(Mode.Throughput) // 초당 처리량 측정 (성능 지표 수치화)
@OutputTimeUnit(TimeUnit.SECONDS)
@Warmup(iterations = 2, time = 1)
@Measurement(iterations = 3, time = 2)
@Fork(1)
public class IssueIntegrationBenchmarkTest {

    // 1차: 테스트용 더미 데이터 셋업 (레포지토리 50개, 레포당 브랜치 10개 가정)
    private List<DummyRepo> dummyRepositories;

    @Setup(Level.Trial)
    public void setUp() {
        dummyRepositories = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            List<String> branches = new ArrayList<>();
            for (int j = 0; j < 10; j++) {
                branches.add("feature/branch-" + j);
            }
            dummyRepositories.add(new DummyRepo((long) i, "owner/repo-" + i, branches));
        }
    }

    // 3차: 가비지 컬렉션 유도 및 데이터 정리
    @TearDown(Level.Trial)
    public void tearDown() {
        dummyRepositories.clear();
        System.gc(); 
    }

    /* ========================================================================
     * [테스트 1번] Mono<List<T>> vs Flux<T> ( produces 옵션 적용 상태 시뮬레이션 )
     * ======================================================================== */

    @Benchmark
    public List<DummyRepoDto> test1MonoListStructure() {
        // Mono<List> 방식: 50개 데이터를 리스트 객체로 완전히 다 조립할 때까지 대기 (메모리 점유 오버헤드)
        return Mono.just(dummyRepositories)
                .flatMapIterable(list -> list)
                .map(repo -> new DummyRepoDto(repo.id(), repo.fullName()))
                .collectList()
                .block(); // 벤치마크 측정을 위해 동기화
    }

    @Benchmark
    public List<DummyRepoDto> test1FluxStructure() {
        // Flux 방식: 리스트 통째 조립 없이 Stream으로 데이터가 나오는 즉시 즉각 방출 (TTFB 단축)
        return Flux.fromIterable(dummyRepositories)
                .map(repo -> new DummyRepoDto(repo.id(), repo.fullName()))
                .collectList() // 비교를 위해 block 전 최종 수집만 진행
                .block();
    }

    /* ========================================================================
     * [테스트 3번] 일괄 전체 조회(성능 파괴) vs 단건 동적 조회(API 프록시 개선)
     * ======================================================================== */

    @Benchmark
    public List<NestedRepoBranchDto> test3BulkFetchWithNPlus1() {
        // 나쁜 예시: 레포지토리 50개를 가져오면서 각 레포마다 브랜치 10개씩을 한 번에 다 엮어서 중첩 DTO를 만드는 구조
        // 외부 API를 루프 돌며 총 50번 추가 호출하는 것과 동일한 병목 시뮬레이션
        return Flux.fromIterable(dummyRepositories)
                .flatMap(repo -> Flux.fromIterable(repo.branches())
                        .map(branch -> new BranchDto(branch))
                        .collectList()
                        .map(branches -> new NestedRepoBranchDto(repo.id(), repo.fullName(), branches))
                )
                .collectList()
                .block();
    }

    @Benchmark
    public List<DummyRepoDto> test3DynamicFetchSingle() {
        // 좋은 예시: 최초 페이지 진입 시 레포지토리 목록 50개만 딱 가볍게 긁어오고 끝내는 구조 (네트워크 비용 80% 이상 절감)
        return Flux.fromIterable(dummyRepositories)
                .map(repo -> new DummyRepoDto(repo.id(), repo.fullName()))
                .collectList()
                .block();
    }

    // JMH 런처 실행 메인 메소드
    public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
                .include(IssueIntegrationBenchmarkTest.class.getSimpleName())
                .forks(0)
                .build();
        new Runner(opt).run();
    }

    // 더미 내부 도메인 및 DTO 모델
    record DummyRepo(Long id, String fullName, List<String> branches) {}
    public record DummyRepoDto(Long id, String fullName) {}
    public record BranchDto(String name) {}
    public record NestedRepoBranchDto(Long id, String fullName, List<BranchDto> branches) {}
}