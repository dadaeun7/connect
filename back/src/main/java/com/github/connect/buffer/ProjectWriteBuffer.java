package com.github.connect.buffer;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.stream.Collectors;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;

import com.github.connect.entity.Project;

import io.r2dbc.spi.Statement;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

@Component
@RequiredArgsConstructor
public class ProjectWriteBuffer {
    
    private final Sinks.Many<Project> projectSink = Sinks.many().multicast().onBackpressureBuffer(Integer.MAX_VALUE);
    private final DatabaseClient databaseClient;
    private CountDownLatch latch;

    @PostConstruct
    public void init(){

        projectSink.asFlux()
        .bufferTimeout(100, Duration.ofMillis(100))
        .flatMap(batch -> 
            this.bulkInsertProject(batch)
                .subscribeOn(Schedulers.boundedElastic())
                // test 용
                // .doOnNext(rows -> {
                //     if (this.latch != null) {
                //         for (int i = 0; i < batch.size(); i++) {
                //             this.latch.countDown();
                //         }
                //     }
                // })
                // 💡 [핵심] 특정 배치가 DB 에러로 터지더라도, 로그만 찍고 스트림을 유지하도록 복구 신호(0L)를 보냅니다.
                .doOnError(e -> System.err.println("🚨 [ProjectWriteBuffer] 백그라운드 인서트 중 에러 발생: " + e.getMessage()))
                .onErrorReturn(0L),32
        )
        .subscribe();
    }

    public void push(Project project){
        projectSink.emitNext(project, Sinks.EmitFailureHandler.busyLooping(Duration.ofSeconds(2)));
    }

    public void setLatch(CountDownLatch latch){
        this.latch = latch;
    }

    private Mono<Long> bulkInsertProject(List<Project> projects){
        if(projects.isEmpty()) return Mono.just(0L);

        String valueClause = projects.stream()
                        .map(p -> String.format("('%s', %d)",
                            p.getName().replace("'", "''"), p.getUserId()))
                        .collect(Collectors.joining(", "));

        String sql = "INSERT INTO \"Project\" (name, user_id) VALUES"+valueClause;

        return databaseClient.sql(sql)
            .fetch()
            .rowsUpdated();
    }

    private Mono<Long> batchInsertProjects(List<Project> projects){
        if(projects.isEmpty()) return Mono.just(0L);

        return databaseClient.inConnection(con -> {
            Statement statement = con.createStatement(
                "INSERT INTO \"Project\" (name, user_id) VALUES ($1, $2)");

            for(int i = 0; i < projects.size(); i++){
                Project p = projects.get(i);
                    System.out.println("현재 처리중인 Project userId : " + p.getUserId());
                statement.bind("$1", p.getName()).bind("$2", p.getUserId());
                if(i < projects.size() -1){
                    statement.add();
                }
            }

            return Flux.from(statement.execute())
                    .flatMap(result -> result.getRowsUpdated())
                    .reduce(0L, Long::sum);
        });
        // test 용
        // .doOnNext(updateRows ->{
        //     if(this.latch != null){
        //         for(int i = 0; i < updateRows; i++){
        //             this.latch.countDown();
        //         }
        //     }
        // });
 
    }
}
