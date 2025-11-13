# MCP 도구 통합 전략 - Integration Strategy

**Purpose**: Enhanced Prompt 생성 시 MCP 도구 자동 발동 전략 및 규칙  
**Last Updated**: 2025-01-07  
**Status**: Active  
**Priority**: Highest

---

## 🎯 핵심 원칙

**모든 MCP 도구는 요청 타입과 컨텍스트에 따라 자동으로 발동되어야 합니다.**

---

## 📊 요청 타입별 MCP 우선순위

### MVP 개발 (mvp)

**컨텍스트 우선순위**: Memory → Codebase → Library

**MCP 도구 발동 순서**:
```
1. Memory MCP (필수)
   - 검색 쿼리: "MVP 패턴", "빠른 구현", "최소 기능"
   - 목적: 과거 MVP 구현 패턴 재사용
   
2. Serena MCP (조건부)
   - 조건: 기존 코드 수정 필요 시
   - 검색 패턴: 관련 컴포넌트, 유사 기능
   
3. Context7 MCP (조건부)
   - 조건: 라이브러리 사용 필요 시
   - 라이브러리: Next.js, React, 빠른 구현 도구
   
4. Ref MCP (선택)
   - 조건: 추가 정보 필요 시
   - 검색 쿼리: "MVP best practices", "quick implementation"
```

**발동 조건**:
- 키워드: "MVP", "일단", "빨리", "간단하게"
- 자동 발동: Memory (항상), Serena (코드 관련), Context7 (라이브러리 관련)

---

### 코드 개선 (improvement)

**컨텍스트 우선순위**: Codebase → Memory → Library

**MCP 도구 발동 순서**:
```
1. Serena MCP (필수)
   - 검색 패턴: 개선 대상 코드, 의존성, 사용처
   - 목적: 현재 코드 구조 파악
   
2. Memory MCP (필수)
   - 검색 쿼리: "리팩토링 패턴", "코드 개선", "최적화"
   - 목적: 과거 개선 패턴 재사용
   
3. Context7 MCP (조건부)
   - 조건: 라이브러리 업데이트 필요 시
   - 라이브러리: 사용 중인 라이브러리 최신 문서
   
4. Ref MCP (선택)
   - 조건: 베스트 프랙티스 확인 필요 시
   - 검색 쿼리: "refactoring patterns", "code optimization"
```

**발동 조건**:
- 키워드: "개선", "리팩토링", "최적화"
- 자동 발동: Serena (항상), Memory (항상), Context7 (라이브러리 관련)

---

### 기능 추가 (feature)

**컨텍스트 우선순위**: Codebase → Library → Memory

**MCP 도구 발동 순서**:
```
1. Serena MCP (필수)
   - 검색 패턴: 통합 지점, 관련 컴포넌트, 의존성
   - 목적: 기존 코드와의 통합 지점 파악
   
2. Context7 MCP (조건부)
   - 조건: 라이브러리 사용 필요 시
   - 라이브러리: 기능 구현에 필요한 라이브러리
   
3. Memory MCP (필수)
   - 검색 쿼리: "유사 기능 구현", "기능 추가 패턴"
   - 목적: 과거 유사 기능 구현 패턴
   
4. Shadcn-UI MCP (조건부)
   - 조건: UI 컴포넌트 필요 시
   - 컴포넌트: 필요한 UI 컴포넌트
   
5. Magic MCP (조건부)
   - 조건: 커스텀 UI 컴포넌트 필요 시
   - 목적: AI 기반 커스텀 컴포넌트 생성
   
6. Supabase MCP (조건부)
   - 조건: 데이터베이스 작업 필요 시
   - 작업: 스키마 확인, 마이그레이션
   
7. Ref MCP (선택)
   - 조건: 추가 정보 필요 시
   - 검색 쿼리: "feature implementation", "integration patterns"
```

**발동 조건**:
- 키워드: "추가", "기능", "구현"
- 자동 발동: Serena (항상), Memory (항상), Context7/Shadcn-UI/Magic/Supabase (조건부)

---

### 디버깅 (debug)

**컨텍스트 우선순위**: Memory → Codebase → Web

**MCP 도구 발동 순서**:
```
1. Memory MCP (필수)
   - 검색 쿼리: "에러 해결", "버그 수정", 에러 메시지
   - 목적: 과거 유사 에러 해결 방법
   
2. Serena MCP (필수)
   - 검색 패턴: 에러 발생 코드, 관련 파일, 의존성
   - 목적: 문제 코드 위치 파악
   
3. Context7 MCP (조건부)
   - 조건: 라이브러리 에러 시
   - 라이브러리: 에러 발생 라이브러리 문서
   
4. Ref MCP (조건부)
   - 조건: 에러 메시지 검색 필요 시
   - 검색 쿼리: 에러 메시지, 스택 트레이스
```

**발동 조건**:
- 키워드: "에러", "버그", "안돼"
- 자동 발동: Memory (항상), Serena (항상), Context7/Ref (조건부)

---

### 프로젝트 설정 (setup)

**컨텍스트 우선순위**: Library → Web → Memory

**MCP 도구 발동 순서**:
```
1. Context7 MCP (필수)
   - 라이브러리: 설정할 라이브러리/프레임워크
   - 목적: 최신 설정 방법 확인
   
2. Ref MCP (필수)
   - 검색 쿼리: "setup guide", "installation", "configuration"
   - 목적: 공식 가이드 확인
   
3. Memory MCP (조건부)
   - 검색 쿼리: "프로젝트 설정", "초기 설정"
   - 목적: 과거 설정 경험
   
4. Serena MCP (선택)
   - 조건: 기존 프로젝트 구조 확인 필요 시
   - 검색 패턴: 프로젝트 구조, 설정 파일
```

**발동 조건**:
- 키워드: "새로", "시작", "세팅"
- 자동 발동: Context7 (항상), Ref (항상), Memory (조건부)

---

### 설계/아키텍처 (design)

**컨텍스트 우선순위**: Memory → Web → Library

**MCP 도구 발동 순서**:
```
1. Memory MCP (필수)
   - 검색 쿼리: "설계 패턴", "아키텍처", "시스템 구조"
   - 목적: 과거 설계 패턴 재사용
   
2. Ref MCP (필수)
   - 검색 쿼리: "architecture patterns", "design best practices"
   - 목적: 베스트 프랙티스 확인
   
3. Serena MCP (조건부)
   - 조건: 기존 아키텍처 분석 필요 시
   - 검색 패턴: 프로젝트 구조, 컴포넌트 관계
   
4. Context7 MCP (조건부)
   - 조건: 아키텍처 도구 사용 시
   - 라이브러리: 아키텍처 관련 라이브러리
```

**발동 조건**:
- 키워드: "설계", "아키텍처", "구조"
- 자동 발동: Memory (항상), Ref (항상), Serena/Context7 (조건부)

---

## 🔧 MCP 도구별 호출 조건

### Memory MCP

**호출 시점**: 항상 (모든 요청 타입)

**검색 쿼리 생성 규칙**:
```
1. 요청 타입 + 주요 키워드
   예: "MVP 개발 이미지 갤러리"
   
2. 기술 스택 + 작업 내용
   예: "Next.js 필터링 구현"
   
3. 에러 메시지 (디버깅 시)
   예: "TypeError: Cannot read property"
```

**검색 범위**:
- `.kiro/compounding/task-learnings/`
- `.kiro/compounding/design-patterns/`
- `.kiro/compounding/anti-patterns/`

**타임아웃**: 2초

**폴백 전략**: 검색 실패 시 빈 결과 반환, 계속 진행

---

### Serena MCP

**호출 시점**: 코드 관련 작업 시

**호출 조건**:
```
IF 요청이 다음 중 하나를 포함:
  - 코드 수정
  - 기능 추가
  - 버그 수정
  - 리팩토링
  - 코드 분석
THEN Serena MCP 호출
```

**검색 패턴**:
```
1. 심볼 검색 (find_symbol)
   - 함수명, 클래스명, 컴포넌트명
   
2. 패턴 검색 (search_for_pattern)
   - 코드 패턴, 사용 예시
   
3. 파일 개요 (get_symbols_overview)
   - 파일 구조, 주요 심볼
   
4. 참조 검색 (find_referencing_symbols)
   - 사용처, 의존성
```

**타임아웃**: 3초

**폴백 전략**: 검색 실패 시 파일 목록만 반환, 계속 진행

---

### Context7 MCP

**호출 시점**: 라이브러리 사용 시

**호출 조건**:
```
IF 요청이 다음 라이브러리 중 하나를 언급:
  - Next.js
  - React
  - Supabase
  - TypeScript
  - 기타 npm 패키지
THEN Context7 MCP 호출
```

**라이브러리 목록**:
```
1. 프레임워크
   - Next.js: /vercel/next.js
   - React: /facebook/react
   
2. 백엔드
   - Supabase: /supabase/supabase
   
3. UI
   - Tailwind CSS: /tailwindlabs/tailwindcss
   
4. 유틸리티
   - TypeScript: /microsoft/typescript
```

**타임아웃**: 3초

**폴백 전략**: 문서 로드 실패 시 기본 사용법 제공, 계속 진행

---

### Ref MCP

**호출 시점**: 추가 정보 필요 시

**호출 조건**:
```
IF 다음 중 하나:
  - 공식 문서 확인 필요
  - 에러 메시지 검색
  - 베스트 프랙티스 조사
  - 가이드 참조
THEN Ref MCP 호출
```

**검색 쿼리 생성 규칙**:
```
1. 공식 문서
   - "[라이브러리명] official documentation"
   
2. 에러 검색
   - "[에러 메시지] solution"
   
3. 베스트 프랙티스
   - "[작업 내용] best practices"
```

**타임아웃**: 5초

**폴백 전략**: 검색 실패 시 건너뛰기, 계속 진행

---

### Shadcn-UI MCP

**호출 시점**: UI 컴포넌트 작업 시

**호출 조건**:
```
IF 요청이 다음을 포함:
  - UI 컴포넌트 생성
  - 폼 구현
  - 다이얼로그/모달
  - 버튼/입력 필드
THEN Shadcn-UI MCP 호출
```

**컴포넌트 목록**:
```
- Button, Input, Form
- Dialog, Sheet, Popover
- Table, Card, Tabs
- Select, Checkbox, Radio
```

**타임아웃**: 2초

**폴백 전략**: 컴포넌트 로드 실패 시 기본 구현 제공

---

### Magic MCP

**호출 시점**: 커스텀 UI 컴포넌트 필요 시

**호출 조건**:
```
IF 다음 중 하나:
  - Shadcn-UI에 없는 컴포넌트
  - 복잡한 애니메이션
  - 특수한 인터랙션
  - 커스텀 디자인
THEN Magic MCP 호출
```

**타임아웃**: 5초

**폴백 전략**: 생성 실패 시 Shadcn-UI 대체 컴포넌트 제안

---

### Supabase MCP

**호출 시점**: 데이터베이스 작업 시

**호출 조건**:
```
IF 요청이 다음을 포함:
  - 테이블 생성/수정
  - 마이그레이션
  - RLS 정책
  - SQL 쿼리
THEN Supabase MCP 호출
```

**타임아웃**: 3초

**폴백 전략**: 작업 실패 시 수동 SQL 제공

---

## ⚠️ 에러 처리 및 폴백 전략

### 에러 타입

```typescript
enum MCPError {
  TIMEOUT = 'timeout',
  NOT_FOUND = 'not_found',
  INVALID_RESPONSE = 'invalid_response',
  NETWORK_ERROR = 'network_error',
  PERMISSION_DENIED = 'permission_denied'
}
```

### 에러별 처리

#### 1. Timeout
```
IF MCP 호출이 타임아웃:
  → 경고 로그: "⚠️ [MCP명] 타임아웃, 기본 컨텍스트 사용"
  → 해당 MCP 건너뛰기
  → 다음 MCP로 진행
```

#### 2. Not Found
```
IF 검색 결과 없음:
  → 정보 로그: "ℹ️ [MCP명] 검색 결과 없음"
  → 빈 결과 반환
  → 다음 MCP로 진행
```

#### 3. Invalid Response
```
IF 응답 형식 오류:
  → 경고 로그: "⚠️ [MCP명] 응답 형식 오류"
  → 기본 값 사용
  → 다음 MCP로 진행
```

#### 4. Network Error
```
IF 네트워크 오류:
  → 경고 로그: "⚠️ [MCP명] 네트워크 오류"
  → 재시도 (최대 1회)
  → 실패 시 건너뛰기
```

#### 5. Permission Denied
```
IF 권한 오류:
  → 에러 로그: "❌ [MCP명] 권한 없음"
  → 사용자에게 알림
  → 해당 MCP 건너뛰기
```

### 폴백 우선순위

```
1. 캐시된 결과 사용
2. 기본 컨텍스트 사용
3. 사용자에게 수동 입력 요청
4. 해당 섹션 생략
```

---

## 🔄 병렬 처리 전략

### 병렬 호출 가능한 MCP

```
그룹 1 (독립적):
- Memory MCP
- Serena MCP

그룹 2 (독립적):
- Context7 MCP
- Ref MCP

그룹 3 (조건부):
- Shadcn-UI MCP
- Magic MCP
- Supabase MCP
```

### 병렬 처리 규칙

```
1. 그룹 1 먼저 병렬 실행
   → Memory + Serena 동시 호출
   
2. 그룹 1 완료 후 그룹 2 병렬 실행
   → Context7 + Ref 동시 호출
   
3. 그룹 2 완료 후 그룹 3 조건부 실행
   → 필요한 MCP만 호출
```

### 성능 목표

```
- Memory: < 2s
- Serena: < 3s
- Context7: < 3s
- Ref: < 5s
- Shadcn-UI: < 2s
- Magic: < 5s
- Supabase: < 3s

총 시간 (병렬): < 8s
총 시간 (순차): < 23s
```

---

## 📊 컨텍스트 구조화

### 수집된 정보 매핑

```typescript
interface CollectedContext {
  memory: {
    pastLearnings: string[];
    patterns: string[];
    antiPatterns: string[];
  };
  codebase: {
    relevantFiles: string[];
    symbols: string[];
    dependencies: string[];
  };
  library: {
    docs: string[];
    examples: string[];
    bestPractices: string[];
  };
  web: {
    guides: string[];
    solutions: string[];
    references: string[];
  };
}
```

### XML 섹션 매핑

```
CollectedContext → XML Sections:

1. current_situation:
   - codebase.relevantFiles
   - codebase.symbols
   - memory.pastLearnings
   
2. requirements:
   - 사용자 요청 분석
   - library.bestPractices
   - memory.patterns
   
3. constraints:
   - codebase.dependencies
   - library.docs (제약사항)
   - memory.antiPatterns
```

---

## ✅ 검증 체크리스트

### MCP 호출 전
- [ ] 요청 타입 확인
- [ ] 호출 조건 충족 확인
- [ ] 타임아웃 설정 확인
- [ ] 폴백 전략 준비

### MCP 호출 중
- [ ] 타임아웃 모니터링
- [ ] 응답 형식 검증
- [ ] 에러 처리 준비

### MCP 호출 후
- [ ] 결과 검증
- [ ] 컨텍스트 구조화
- [ ] 다음 MCP 준비

---

## 🔗 Related Documentation

- [Context Collector Template](./context-collector-template.md) - 실행 템플릿
- [MCP Tools](./mcp-tools.md) - MCP 도구 가이드
- [Requirements](../../specs/auto-prompt-enhancer-improvement/requirements.md) - Requirement 3, 7
- [Design](../../specs/auto-prompt-enhancer-improvement/design.md) - Context Collector 설계

---

**Version**: 1.0  
**Status**: Active  
**Last Updated**: 2025-01-07  
**Project**: PixelFactory
