# Connect (멀티 플랫폼 데이터 동기화 백엔드 시스템)

Slack, GitHub, Figma, Notion 등 다양한 비대면 협업 툴의 데이터를 연동하고 유기적으로 동기화하는 백엔드 솔루션입니다.
단순한 기능 구현을 넘어, 외부 API의 제약 조건(Rate Limit)과 데이터 정합성을 고려하며 **공식 문서 기반의 검증과 테스트**를 중심으로 개발을 진행하고 있습니다.

---

## 1. 프로젝트 목적 및 핵심 고민

- **배경**: 협업 툴 간의 데이터 파편화 문제를 해결하기 위한 멀티 앱 동기화 도구 기획
- **핵심 도전 과제**:
  - 각 플랫폼별 이질적인 외부 API 규격 통합 및 웹훅(Webhook) 구조 최적화
  - 대용량 데이터 동기화 시 발생할 수 있는 데이터 불일치 및 네트워크 병목 해결
  - 기술 도입 시 AI 추천에 의존하지 않고, 공식 레퍼런스 비교 분석을 통한 아키텍처 검증

---

## 2. Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, JPA/Hibernate
- **Database & Message Queue**: PostgreSQL, Apache Kafka (이벤트 기반 아키텍처 검토 및 도입 중)
- **Frontend/UI**: React, TypeScript, Next.js, Figma (UX/UI 설계 직접 수행)

---

## 3. Architecture & Design History (공식 문서 기반 의승결정)

> 기술 선택과 아키텍처 설계에 대한 상세 분석 과정은 아래 기술 블로그(노션)에 상세히 기록되어 있습니다.

- 🔗 [개발 및 아키텍처 히스토리 보기](https://www.notion.so/34840d2c319e80d08e20f1b8ee857789?v=34840d2c319e81309e66000c324f4c1e&source=copy_link)
- 🔗 [기획 및 UX/UI 설계 프로세스 보기](https://www.notion.so/34840d2c319e80b9973ad3dc6d4c9cee?v=34840d2c319e8184924a000c86559e68&source=copy_link)
- 🔗 [서비스 배경/분석](https://www.notion.so/Connect-32e40d2c319e80ab90ebdb95a7c8f727)

---

## 4. Current Status & Roadmap

- [x] 분석 및 요구사항 정의 완료
- [x] Figma를 활용한 유저 시나리오 및 UI/UX 와이어프레임 설계
- [x] 데이터베이스 스키마 및 도메인 모델 설계
- [...] 회원가입 및 로그인 구현
- [...] JMeter를 통한 부하 테스트 및 데이터 동기화 정합성 검증
- [] 핵심 외부 API(GitHub, Slack) 웹훅 연동 모듈 개발
