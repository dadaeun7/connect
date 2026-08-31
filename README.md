# Connect

## 프로젝트 개요

본 프로젝트는 다양한 외부 B2B SaaS(Slack, GitHub, Figma, Notion 등)의 데이터를 통합하여 <br/>
이슈 매핑 및 프로젝트 액티비티 타임라인을 제공하는 서비스입니다.<br/>
아래 서비스에 방문해보세요!

[![Live Demo](https://img.shields.io/badge/Live_Demo-connect.daeun--tech.site-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white)](https://connect.daeun-tech.site/)
![AWS Lightsail](https://img.shields.io/badge/AWS_Lightsail-FF9900?style=for-the-badge&logo=amazonwebservices&logoColor=white)
![Gabia](https://img.shields.io/badge/Gabia_Domain-0052CC?style=for-the-badge&logo=internetcomputer&logoColor=white)

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-In_Development-FF6B6B?style=for-the-badge&logo=git&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Version-v1.0.0_beta-4F46E5?style=for-the-badge" alt="Version" />
</p>

## 🛠 Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend & Infrastructure

![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring WebFlux](https://img.shields.io/badge/Spring_WebFlux-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-000000?style=for-the-badge&logo=keycloak&logoColor=white)

### 📊 Codebase Distribution

| Language       | Proportion | Primary Usage                                       |
| :------------- | :--------- | :-------------------------------------------------- |
| **Java**       | `39.6%`    | Spring Boot Core, WebFlux API, Kafka Stream Handler |
| **TypeScript** | `57.8%`    | Next.js App Router, Component UI, API Integration   |
| **CSS**        | `2.2%`     | Tailwind CSS Styling & Layout Template              |

---

## 주요 구현 방식

### ① Keycloak 로그인, OAuth 연동과 및 사용자 권한 관리

- **Keycloak Identity Broker (SSO & Authentication)**
  - Keycloak을 Identity Broker로 구성하여 사용자 로그인 및 소셜/외부 IDP 인증 전적으로 위임
- **Centralized OAuth Token & Session Management (Spring + Redis)**
  - Slack, GitHub, Figma, Notion 등 개별 B2B SaaS 연동을 위한 중요 정보는 Redis에 1차적으로 uudi 키로 저장 후 외부 서비스 인증 완료 후에 Spring router 통해 암호화하여 DB 및 Redis 저장 구축
- **Role-Based Access Control (RBAC)**
  - 서비스 내 프로젝트별 사용자 권한(Admin, Editor, Viewer)을 매핑하여 프로젝트 단위 미세 접근 제어 구현
- **Non-authenticated Invitation Flow Optimization (Next.js Middleware + Cookie)**
  - 미로그인 유저가 프로젝트 초대 URL 접근 시, Next.js Middleware가 이를 감지하여 쿠키(pending_invite_projectId)에 초대 컨텍스트 저장
  - Keycloak 인증 완료 후 유실 없이 대상 프로젝트 승인 페이지로 안전하게 리다이렉트되도록 초대 로직 구축

---

### ② 하이브리드 외부 데이터 수집 파이프라인 (Hybrid Collector)

외부 서비스의 API 정책 및 제약 사항에 맞춰 **Webhook + Scheduler** 하이브리드 수집 구조 적용.

- **Real-time Webhook Collector**
  - Slack 등 실시간 이벤트를 지원하는 서비스의 메시지, 커밋, 댓글 이벤트를 웹훅을 통해 즉시 수집 및 이벤트 스트리밍.
- **Polling Scheduler (Rate Limit Compliant)**
  - Webhook을 지원하지 않거나 API Rate Limit 제약이 존재하는 Notion, Figma 등은 **15분 주기 Spring Task Scheduler**를 통해 변경 사항(페이지, 댓글, 히스토리 등)을 수집.

---

### ③ 데이터 연동 및 이슈/활동(Activity) 통합

- **Issue Auto-Mapping & Merging**
  - 수집된 외부 이벤트를 유니크 제약키를 통해 중복 되지 않도록 하고, 하나의 이벤트에 여러 이슈가 바로볼 수 있도록 테이블 세팅
- **Activity Timeline Schema Design**
  - 외부 툴에서 발생한 데이터(Commit, Comment, Document Edit 등)를 연결한 이슈에 그룹으로 통합하여 보여줌
  - 페이징을 통해 모든 리스트를 가져오지 않고, 추가 요청이 있을때마다 페이징 기법으로 불러오도록 함.

---

### ④ 비동기 외부 API 호출 및 시스템 안정성 확보

- **Reactive Non-blocking I/O**
  - 다수의 외부 SaaS API 동기 호출 시 발생하는 I/O 병목을 해결하기 위해 **Spring WebFlux(WebClient)** 를 활용한 비동기/논블로킹 요청 처리.
- **Defensive Parsing & Fault Tolerance**
  - 외부 API 응답 오류, Rate Limit 걸림, Empty Body 반환 시 시스템 전체로 장애가 전파되지 않도록 Exception Handler 및 Guard 로직 적용
  - Redis의 Push, Poll을 활용하여 특정 시간대에 트래픽이 생길 수 있는(Github Commit) 부분을 사전 서비스 영향도 최소화 할 수 있도록 설계
