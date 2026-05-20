package com.github.connect;

import com.github.connect.dto.internal.JoinCompnayUser;
import com.github.connect.repository.JoinCompanyUserRepository;
import com.github.connect.service.JoinEmailVerifyServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.FixedHostPortGenericContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class EmailCodeTest {

    @Container
    public static GenericContainer<?> redisContainer =
            new FixedHostPortGenericContainer<>("redis:7.0")
                    .withFixedExposedPort(6379, 6379)
                    .withReuse(true);


    static {
        redisContainer.start();
    }

    @Autowired
    JoinEmailVerifyServiceImpl joinEmailVerifyService;

    @Autowired
    JoinCompanyUserRepository joinCompanyUserRepository;

    /*
    * * Gmail 플러스 주소
    * @param 실제 이메일 아이디+원하는 문자열@이메일 도메인
    * - ex dadaeun7+test01@gmail.com, dadaeun7+test02@gmail.com
    * * explain DB와 Spring Boot 로직에서 위 2개를 다른 가짜 주소 2개로 인식
    *          구글 메일 서버 정상 주소 판단 후 dadaeun7@gmial.com 하나의 메일함으로 발송
    * */

//    @Test
//    void redisTest(){
//        // 테스트 로직 작성
//        System.out.println("Redis 호스트: " + redisContainer.getHost());
//
//        mockData("홍길동", "dadaeun7+test01@gmail.com");
//        mockData("김망고", "dadaeun7+test02@gmail.com");
//        mockData("박포도", "dadaeun7+test03@gmail.com");
//        mockData("유자두", "dadaeun7+test04@gmail.com");
//        mockData("한수박", "dadaeun7+test05@gmail.com");
//        mockData("조딸기", "dadaeun7+test06@gmail.com");
//        mockData("임참외", "dadaeun7+test07@gmail.com");
//
//    }

    @Test
    void concurrencyLoad() throws InterruptedException{
        int threadCount = 30;

        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);

        CountDownLatch readyLatch = new CountDownLatch(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);

        for(int i= 0 ; i < threadCount; i++){
            final int userId = i;
            executorService.submit(()->{
                try{

                    readyLatch.countDown();
                    startLatch.await();

                    String name = "test00" + userId;
                    String email = "dadaeun7+junit"+userId+"@gmail.com";

                    mockData(name, email);

                }catch(InterruptedException e){
                    Thread.currentThread().interrupt();
                }finally {
                    finishLatch.countDown();
                }
            });
        }

        readyLatch.await();
        startLatch.countDown();
        finishLatch.await();
        executorService.shutdown();
    }

    void mockData(String testName, String testEmail){
        joinEmailVerifyService.sendEmail(testName, testEmail);

        String key = joinCompanyUserRepository.redisJoinKey(testEmail);
        Optional<JoinCompnayUser> check = joinCompanyUserRepository.find(key);

        if(check.isEmpty()){
            System.err.println("redis 에 JoinCompanyUser가 저장되지 않았습니다.");
            throw new RuntimeException();
        }

        String code = check.get().getCode();
        joinEmailVerifyService.checkCode(testEmail, code);
    }
}
