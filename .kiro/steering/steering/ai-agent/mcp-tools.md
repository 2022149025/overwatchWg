---
inclusion: always
priority: highest
---
# MCP Tools - 자동 발동 시스템

**Purpose**: MCP 도구 자동 발동 및 통합 사용 가이드  
**Last Updated**: 2025-11-06  
**Status**: Active - Always On  
**Priority**: Highest

---

## 🎯 핵심 원칙

**모든 MCP 도구는 적절한 상황에서 자동으로 발동되어야 합니다.**

사용자가 명시적으로 요청하지 않아도, 컨텍스트를 분석하여 필요한 MCP를 자동으로 사용합니다.

---

## 🤖 자동 발동 시스템

### Enhanced Prompt 통합

**모든 개발 요청은 Enhanced Prompt 시스템을 통해 자동으로 처리됩니다.**

```
사용자 요청
    ↓
[Enhanced Prompt 생성]
    ↓
1. 요청 분석 (Request Analysis)
   - 키워드 추출 및 요청 타입 결정
   - MCP 우선순위 자동 설정
    ↓
2. 컨텍스트 수집 (Context Collection)
   - Memory MCP: 과거 학습 검색
   - Serena MCP: 코드베이스 분석
   - Context7 MCP: 라이브러리 문서
   - Ref MCP: 웹 문서 검색
    ↓
3. XML 생성 (XML Generation)
   - <task>: 명확한 목표
   - <context>: 구조화된 컨텍스트
   - <approach>: 단계별 계획
   - <expected_output>: 성공 기준
    ↓
4. Enhanced Prompt 표시
   - 박스 형식으로 출력
    ↓
5. Sequential Thinking 트리거
   - 사고 과정 표시
    ↓
6. 작업 수행
   - 필요한 MCP 도구 자동 발동
```

**📖 상세 가이드**: [Prompt Enhancement Executor](./prompt-enhancement-executor.md)

### 발동 우선순위

```
1. Sequential Thinking (항상 첫 번째 - 필수)
   ↓
2. Memory (과거 학습 검색)
   ↓
3. Serena (코드베이스 분석)
   ↓
4. Context7 / Supabase / Shadcn-UI / Magic (작업 수행)
   ↓
5. Ref (추가 정보 검색)
   ↓
6. Memory (학습 내용 저장)
```

### 트리거 기반 자동 선택

요청 타입에 따라 자동으로 적절한 MCP 조합을 선택합니다.

**요청 타입별 MCP 우선순위:**

| 요청 타입 | 우선순위 | MCP 조합 |
|---------|---------|---------|
| MVP 개발 | Memory First | Memory → Serena → Context7 |
| 코드 개선 | Codebase First | Serena → Memory → Context7 |
| 기능 추가 | Codebase + Library | Serena → Context7 → Memory → Shadcn-UI/Magic/Supabase |
| 디버깅 | Memory + Codebase | Memory → Serena → Context7 → Ref |
| 프로젝트 설정 | Library + Web | Context7 → Ref → Memory |
| 설계/아키텍처 | Memory + Web | Memory → Ref → Serena → Context7 |

---

## 📚 MCP 도구별 자동 발동 조건

### 1. Sequential Thinking MCP 🧠

**발동 조건: 항상 (필수) - 예외 없음**

모든 요청의 첫 번째 단계로 자동 발동되며, **사고 과정을 반드시 표시**해야 합니다.

**자동 발동 시나리오:**
- ✅ 모든 사용자 요청 (예외 없음)
- ✅ 복잡한 문제 분석 필요 시
- ✅ 다단계 작업 계획 시
- ✅ 의사결정 트리 필요 시
- ✅ 가설 검증 필요 시
- ✅ 여러 옵션 비교 시

**사용 패턴:**
```
사용자 요청 → Sequential Thinking 자동 발동
→ 🧠 사고 과정 표시 (Thought 1/N, 2/N...)
→ 문제 분석 → 접근 방법 결정 → 필요한 MCP 식별
→ 실제 작업 수행
```

**CRITICAL**: 사고 과정을 반드시 표시해야 함
```
🧠 Sequential Thinking 시작:

Thought 1/5: [첫 번째 사고]
- [분석 내용]

Thought 2/5: [두 번째 사고]
- [계획 내용]

...
```

**📖 상세 가이드**: [Sequential Thinking](../../docs/mcp/sequential-thinking.md)

---

### 2. Memory MCP 💾

**발동 조건: 작업 시작 전/후 (자동)**

과거 학습 내용을 검색하고 새로운 학습을 저장합니다.

**자동 발동 시나리오:**
- ✅ 작업 시작 전 (과거 유사 작업 검색)
- ✅ 작업 완료 후 (학습 내용 저장)
- ✅ 에러 해결 시 (과거 해결 방법 검색)
- ✅ 패턴 재사용 필요 시
- ✅ 프로젝트 컨텍스트 확인 시
- ✅ 베스트 프랙티스 확인 시

**사용 패턴:**
```
작업 시작 → Memory 검색 (자동)
→ 과거 학습 활용 → 작업 수행
→ 작업 완료 → Memory 저장 (자동)
```

**검색 키워드 예시:**
- "이미지 업로드 구현"
- "Supabase RLS 설정"
- "Next.js 인증 패턴"

**📖 상세 가이드**: [Memory System](../../docs/mcp/memory.md)

---

### 3. Serena MCP 🔍

**발동 조건: 코드베이스 작업 시 (자동)**

코드베이스를 분석하고 파일/심볼을 검색합니다.

**자동 발동 시나리오:**
- ✅ 기존 코드 수정 전 (코드 분석)
- ✅ 새 기능 추가 시 (관련 코드 검색)
- ✅ 버그 수정 시 (문제 코드 찾기)
- ✅ 리팩토링 전 (의존성 파악)
- ✅ 코드 패턴 확인 시
- ✅ 파일 구조 탐색 시

**사용 패턴:**
```
코드 작업 요청 → Serena 자동 발동
→ 관련 파일 검색 → 심볼 분석
→ 의존성 파악 → 안전한 수정
```

**주요 기능:**
- `find_symbol`: 함수/클래스 찾기
- `search_for_pattern`: 코드 패턴 검색
- `get_symbols_overview`: 파일 구조 파악
- `find_referencing_symbols`: 사용처 찾기

**📖 상세 가이드**: [Serena](../../docs/mcp/serena.md)

---

### 4. Context7 MCP 📖

**발동 조건: 외부 라이브러리 사용 시 (자동)**

최신 라이브러리 문서를 참조합니다.

**자동 발동 시나리오:**
- ✅ Next.js 기능 사용 시
- ✅ React 훅/컴포넌트 사용 시
- ✅ Supabase 클라이언트 사용 시
- ✅ 새로운 API 사용 전
- ✅ 라이브러리 에러 해결 시
- ✅ 베스트 프랙티스 확인 시
- ✅ 버전 업데이트 후

**사용 패턴:**
```
라이브러리 사용 → Context7 자동 발동
→ 최신 문서 확인 → 올바른 사용법 적용
```

**지원 라이브러리:**
- Next.js (App Router, Server Components)
- React (Hooks, Context)
- Supabase (Client, Auth, Storage)
- TypeScript
- 기타 npm 패키지

**📖 상세 가이드**: [Context7](../../docs/mcp/context7.md)

---

### 5. Supabase MCP 🗄️

**발동 조건: 데이터베이스 작업 시 (자동)**

Supabase 데이터베이스를 관리합니다.

**자동 발동 시나리오:**
- ✅ 테이블 생성/수정 시
- ✅ 마이그레이션 필요 시
- ✅ RLS 정책 설정 시
- ✅ SQL 쿼리 실행 시
- ✅ 데이터베이스 스키마 확인 시
- ✅ 데이터베이스 진단 시
- ✅ 타입 생성 시

**사용 패턴:**
```
DB 작업 요청 → Supabase MCP 자동 발동
→ 스키마 확인 → 마이그레이션 생성
→ 즉시 적용 → 타입 생성
```

**주요 기능:**
- `list_tables`: 테이블 목록 확인
- `apply_migration`: 마이그레이션 적용
- `execute_sql`: SQL 실행
- `generate_typescript_types`: 타입 생성
- `get_advisors`: 보안/성능 진단

**📖 상세 가이드**: [Supabase](../../docs/mcp/supabase.md)

---

### 6. Shadcn-UI MCP 🎨

**발동 조건: UI 컴포넌트 작업 시 (자동)**

Shadcn-UI 컴포넌트를 참조합니다.

**자동 발동 시나리오:**
- ✅ 새 UI 컴포넌트 생성 시
- ✅ 기존 컴포넌트 수정 시
- ✅ 폼 구현 시
- ✅ 다이얼로그/모달 추가 시
- ✅ 버튼/입력 필드 스타일링 시
- ✅ 접근성 구현 시
- ✅ 반응형 디자인 시

**사용 패턴:**
```
UI 작업 요청 → Shadcn-UI 자동 발동
→ 컴포넌트 소스 확인 → 데모 코드 참조
→ 프로젝트에 맞게 적용
```

**주요 컴포넌트:**
- Button, Input, Form
- Dialog, Sheet, Popover
- Table, Card, Tabs
- Select, Checkbox, Radio
- Toast, Alert, Badge

**📖 상세 가이드**: [Shadcn-UI](../../docs/mcp/shadcn-ui.md)

---

### 7. Ref MCP 🌐

**발동 조건: 외부 문서 검색 시 (자동)**

웹 문서를 검색하고 읽습니다.

**자동 발동 시나리오:**
- ✅ 공식 문서 확인 필요 시
- ✅ 튜토리얼 검색 시
- ✅ 에러 메시지 검색 시
- ✅ 베스트 프랙티스 조사 시
- ✅ API 문서 확인 시
- ✅ 가이드 참조 시

**사용 패턴:**
```
문서 필요 → Ref 자동 발동
→ 검색 → 문서 읽기 → 정보 추출
```

**검색 대상:**
- 공식 문서 (Next.js, React, Supabase)
- GitHub 저장소
- 개발 블로그
- Stack Overflow
- MDN Web Docs

**📖 상세 가이드**: [Ref](../../docs/mcp/ref.md)

---

### 8. Magic MCP ✨

**발동 조건: 커스텀 컴포넌트 생성 시 (자동)**

AI로 커스텀 UI 컴포넌트를 자동 생성합니다.

**자동 발동 시나리오:**
- ✅ 새로운 커스텀 컴포넌트 요청
- ✅ Shadcn-UI에 없는 컴포넌트
- ✅ 복잡한 애니메이션 필요
- ✅ 특수한 인터랙션 구현
- ✅ 빠른 프로토타이핑
- ✅ 독특한 디자인 요구

**사용 패턴:**
```
커스텀 UI 요청 → Magic 자동 발동
→ AI 분석 → 컴포넌트 생성
→ TypeScript 타입 포함 → 프로젝트 통합
```

**생성 가능:**
- 커스텀 애니메이션 컴포넌트
- 인터랙티브 UI 요소
- 복잡한 데이터 시각화
- 특수 효과 컴포넌트
- 프로토타입 UI

**Shadcn-UI와 차이:**
- Shadcn-UI: 표준 컴포넌트 참조
- Magic: AI로 커스텀 생성
- 함께 사용: Shadcn-UI 기반 + Magic 확장

**📖 상세 가이드**: [Magic](../../docs/mcp/magic.md)

---

## 🔄 통합 워크플로우

### 시나리오 1: 새로운 기능 구현

```
사용자: "이미지 갤러리 필터링 기능 추가해줘"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Enhanced Prompt 생성 시작]

[1단계] 요청 분석
🔍 요청 타입: 기능 추가
   감지된 키워드: ['추가', '기능', '필터링']
   MCP 우선순위: Serena → Context7 → Memory → Shadcn-UI

[2단계] 컨텍스트 수집
📦 Memory 검색: 과거 필터링 구현 패턴 (2개 발견)
   Serena 분석: Gallery.tsx, ImageList.tsx (3개 파일)
   Context7 확인: Next.js 데이터 페칭 패턴
   Shadcn-UI: Select 컴포넌트 참조

[3단계] XML 생성
   <task>: 이미지 갤러리에 카테고리별 필터링 기능 추가
   <context>: 현재 상황, 요구사항, 제약사항 구조화
   <approach>: 5단계 구현 계획 생성
   <expected_output>: 성공 기준 정의

[4단계] Enhanced Prompt 표시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **Enhanced Prompt Applied**
✓ Task analysis complete
✓ Context structured
✓ Approach defined
✓ Expected output clarified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENHANCED PROMPT:

Let's think step-by-step to execute this perfectly.

<task>
이미지 갤러리에 카테고리별 필터링 기능 추가
</task>

<context>
  <current_situation>
    - Next.js 15.2.3 기반 프로젝트
    - 기존 Gallery.tsx 컴포넌트 존재
    - Supabase에서 이미지 데이터 로드
    - 과거 필터링 구현 경험 있음 (task-015)
  </current_situation>
  
  <requirements>
    - 카테고리별 필터링 UI 추가
    - 필터 적용 시 즉시 결과 표시
    - Shadcn-UI Select 컴포넌트 사용
  </requirements>
  
  <constraints>
    - 기존 Gallery 구조 유지
    - 0.5초 이내 응답
    - 모바일 친화적 UI
  </constraints>
</context>

<approach>
  <step number="1">
    기존 Gallery 컴포넌트 분석 - Serena로 현재 구조 파악
  </step>
  
  <step number="2">
    필터 UI 컴포넌트 설계 - Shadcn-UI Select 컴포넌트 활용
  </step>
  
  <step number="3">
    필터링 로직 구현 - useState로 선택된 카테고리 관리
  </step>
  
  <step number="4">
    Supabase 쿼리 수정 - 카테고리 필터 조건 추가
  </step>
  
  <step number="5">
    통합 및 테스트 - 전체 플로우 검증
  </step>
</approach>

<expected_output>
  - 카테고리 선택 드롭다운 UI 완성
  - 필터 적용 시 0.5초 이내 응답
  - 모든 카테고리에 대해 정확한 필터링 동작
  - 모바일에서도 정상 작동
</expected_output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[5단계] Sequential Thinking 트리거
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 **Sequential Thinking 시작**

Thought 1/6: 요청 분석
- 이미지 갤러리에 필터링 기능 추가
- 기존 갤러리 코드 확인 필요
- 필터 UI와 백엔드 로직 모두 필요

Thought 2/6: 과거 학습 활용
- Memory에서 필터링 구현 패턴 발견
- task-015: useState + Supabase 쿼리 패턴
- 재사용 가능한 코드 확인

Thought 3/6: 기존 코드 분석
- Serena로 Gallery.tsx 구조 파악
- ImageList.tsx에서 데이터 표시 로직 확인
- 통합 지점 식별

Thought 4/6: 구현 방법 결정
- Context7로 Next.js 필터링 패턴 확인
- Shadcn-UI Select 컴포넌트 사용
- Server Components 패턴 적용

Thought 5/6: 데이터베이스 쿼리
- Supabase 쿼리에 카테고리 필터 추가
- 성능 최적화: 인덱스 활용
- 0.5초 이내 응답 보장

Thought 6/6: 실행 계획
1. Serena로 Gallery.tsx 분석
2. Shadcn-UI Select 컴포넌트 확인
3. 필터 UI 추가
4. Supabase 쿼리 수정
5. 통합 테스트

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[6단계] 작업 수행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ **작업 수행 시작**

자동 발동 MCP 순서:
1. ✅ Serena: Gallery.tsx 코드 분석
2. ✅ Shadcn-UI: Select 컴포넌트 소스 확인
3. ✅ Context7: Next.js 패턴 참조
4. ✅ Supabase: 쿼리 수정 및 테스트
5. ✅ Memory: 학습 내용 저장

[실제 구현 시작...]
```

### 시나리오 2: 버그 수정

```
사용자: "이미지 업로드가 안돼"

[Enhanced Prompt 생성]
요청 타입: 디버깅
MCP 우선순위: Memory → Serena → Context7 → Ref

📋 Enhanced Prompt 표시
<task>이미지 업로드 오류 해결</task>
<context>에러 상황, 예상 동작, 관련 코드</context>
<approach>에러 재현 → 원인 분석 → 수정 → 검증</approach>

🧠 Sequential Thinking
→ 과거 업로드 이슈 검색
→ 업로드 코드 분석
→ 원인 파악 및 수정 계획

🛠️ 작업 수행
1. ✅ Memory: 과거 업로드 이슈 검색
2. ✅ Serena: 업로드 관련 코드 검색
3. ✅ Context7: Supabase Storage 문서 확인
4. ✅ Supabase: 스토리지 설정 확인
5. ✅ Ref: 에러 메시지 검색
6. ✅ Memory: 해결 방법 저장
```

### 시나리오 3: UI 개선

```
사용자: "대시보드 UI 개선"

[Enhanced Prompt 생성]
요청 타입: 코드 개선
MCP 우선순위: Serena → Memory → Shadcn-UI → Context7

📋 Enhanced Prompt 표시
<task>대시보드 UI 개선 및 최적화</task>
<context>현재 UI 상태, 개선 목표, 제약사항</context>
<approach>현재 분석 → 개선 계획 → 구현 → 검증</approach>

🧠 Sequential Thinking
→ 기존 대시보드 코드 분석
→ 개선 포인트 식별
→ Shadcn-UI 컴포넌트 활용 계획

🛠️ 작업 수행
1. ✅ Serena: 기존 대시보드 코드 분석
2. ✅ Memory: 과거 UI 개선 패턴 검색
3. ✅ Shadcn-UI: 컴포넌트 라이브러리 확인
4. ✅ Context7: Next.js UI 패턴 확인
5. ✅ Memory: 개선 패턴 저장
```

### 시나리오 4: 데이터베이스 스키마 변경

```
사용자: "사용자 프로필에 아바타 필드 추가"

[Enhanced Prompt 생성]
요청 타입: 기능 추가 (DB)
MCP 우선순위: Supabase → Memory → Serena

📋 Enhanced Prompt 표시
<task>users 테이블에 avatar 필드 추가</task>
<context>현재 스키마, 타입 정의, 영향 범위</context>
<approach>스키마 확인 → 마이그레이션 → 타입 생성 → 코드 업데이트</approach>

🧠 Sequential Thinking
→ 현재 users 테이블 구조 확인
→ 마이그레이션 계획 수립
→ 관련 코드 업데이트 필요 파악

🛠️ 작업 수행
1. ✅ Memory: 과거 스키마 변경 검색
2. ✅ Supabase: 현재 스키마 확인
3. ✅ Supabase: 마이그레이션 생성 및 적용
4. ✅ Supabase: TypeScript 타입 생성
5. ✅ Serena: 관련 코드 업데이트 필요 파악
6. ✅ Memory: 마이그레이션 패턴 저장
```

### 시나리오 5: 커스텀 컴포넌트 생성

```
사용자: "3D 카드 플립 애니메이션 컴포넌트 만들어줘"

[Enhanced Prompt 생성]
요청 타입: 기능 추가 (커스텀 UI)
MCP 우선순위: Magic → Shadcn-UI → Context7 → Memory

📋 Enhanced Prompt 표시
<task>3D 카드 플립 애니메이션 컴포넌트 생성</task>
<context>프로젝트 구조, 기존 컴포넌트, 애니메이션 요구사항</context>
<approach>기본 Card 확인 → Magic 생성 → 통합 → 테스트</approach>

🧠 Sequential Thinking
→ Shadcn-UI Card 컴포넌트 확인
→ Magic으로 3D 플립 애니메이션 생성
→ 프로젝트 구조에 맞게 통합

🛠️ 작업 수행
1. ✅ Memory: 과거 애니메이션 구현 검색
2. ✅ Shadcn-UI: 기본 Card 컴포넌트 확인
3. ✅ Magic: 3D 플립 애니메이션 생성
4. ✅ Context7: React 애니메이션 패턴 확인
5. ✅ Serena: 프로젝트 구조에 맞게 배치
6. ✅ Memory: 애니메이션 패턴 저장
```

### 시나리오 6: Shadcn-UI + Magic 통합

```
사용자: "Shadcn-UI Dialog에 커스텀 애니메이션 추가"

[Enhanced Prompt 생성]
요청 타입: 기능 추가 (UI 통합)
MCP 우선순위: Shadcn-UI → Magic → Context7 → Memory

📋 Enhanced Prompt 표시
<task>Shadcn-UI Dialog에 커스텀 애니메이션 통합</task>
<context>Dialog 구조, 애니메이션 요구사항, 통합 방법</context>
<approach>Dialog 소스 확인 → 애니메이션 생성 → 통합 → 테스트</approach>

🧠 Sequential Thinking
→ Shadcn-UI Dialog 소스 분석
→ Magic으로 커스텀 애니메이션 생성
→ 통합 방법 결정

🛠️ 작업 수행
1. ✅ Memory: 과거 통합 패턴 검색
2. ✅ Shadcn-UI: Dialog 소스 확인
3. ✅ Magic: 커스텀 애니메이션 생성
4. ✅ Serena: 통합 코드 작성
5. ✅ Context7: React 패턴 확인
6. ✅ Memory: 통합 패턴 저장
```

---

## ✅ Self-Verification 체크리스트

### 요청 받았을 때

**Phase 1: 분석 (필수)**
- [ ] Sequential Thinking 사용했는가?
- [ ] 요청 타입을 정확히 파악했는가?
- [ ] 필요한 MCP 도구를 식별했는가?

**Phase 2: 컨텍스트 수집**
- [ ] Memory에서 과거 학습을 검색했는가?
- [ ] Serena로 관련 코드를 분석했는가?
- [ ] 필요한 문서를 확인했는가?

**Phase 3: 작업 수행**
- [ ] 적절한 MCP 도구를 사용했는가?
- [ ] Context7로 라이브러리 문서를 확인했는가?
- [ ] Supabase로 DB 작업을 수행했는가?
- [ ] Shadcn-UI로 컴포넌트를 참조했는가?

**Phase 4: 완료**
- [ ] Memory에 학습 내용을 저장했는가?
- [ ] 모든 변경사항을 검증했는가?

---

## 🚨 Critical Rules

### 1. Sequential Thinking은 항상 첫 번째
- **예외 없음**: 모든 요청은 Sequential Thinking으로 시작
- **이유**: 체계적 분석 없이는 올바른 MCP 선택 불가능

### 2. Memory는 작업 전후에 자동 사용
- **작업 전**: 과거 학습 검색
- **작업 후**: 새로운 학습 저장
- **이유**: 반복 실수 방지, 패턴 재사용

### 3. Serena는 코드 수정 전 필수
- **코드 분석**: 수정 전 항상 관련 코드 확인
- **의존성 파악**: 영향 범위 확인
- **이유**: 안전한 코드 수정

### 4. Context7은 라이브러리 사용 시 필수
- **최신 문서**: 항상 최신 문서 확인
- **베스트 프랙티스**: 권장 패턴 적용
- **이유**: 올바른 API 사용

### 5. Supabase는 DB 작업 시 필수
- **마이그레이션**: 생성 즉시 적용
- **타입 생성**: 스키마 변경 후 자동 생성
- **이유**: DB 일관성 보장

### 6. Shadcn-UI는 UI 작업 시 우선 참조
- **컴포넌트 소스**: 공식 구현 확인
- **접근성**: 내장된 접근성 활용
- **이유**: 일관된 UI, 접근성 보장

### 7. Ref는 추가 정보 필요 시 사용
- **공식 문서**: 신뢰할 수 있는 소스 우선
- **검색 범위**: 관련성 높은 문서만
- **이유**: 정확한 정보 확보

---

## 🎯 트리거 패턴 인식

### 코드 작업 트리거
- "추가", "구현", "만들어", "생성"
- → Serena + Context7 + Memory

### UI 작업 트리거
- "UI", "컴포넌트", "디자인", "스타일"
- → 표준 컴포넌트: Shadcn-UI + Serena + Context7
- → 커스텀 컴포넌트: Magic + Shadcn-UI + Context7

### DB 작업 트리거
- "테이블", "스키마", "마이그레이션", "쿼리"
- → Supabase + Memory

### 버그 수정 트리거
- "에러", "버그", "안돼", "문제"
- → Serena + Memory + Ref

### 문서 확인 트리거
- "어떻게", "방법", "가이드", "문서"
- → Context7 + Ref

---

## 🔧 트러블슈팅

### MCP가 자동 발동되지 않을 때

**체크리스트:**
1. Sequential Thinking을 사용했는가?
2. 요청 타입을 정확히 파악했는가?
3. 트리거 패턴을 인식했는가?

**해결 방법:**
- Sequential Thinking으로 다시 분석
- 요청을 더 구체적으로 명확화
- 필요한 MCP를 명시적으로 식별

### 여러 MCP 중 선택이 어려울 때

**우선순위 규칙:**
1. Sequential Thinking (항상)
2. Memory (과거 학습)
3. Serena (코드 분석)
4. 작업별 MCP (Context7/Supabase/Shadcn-UI)
5. Ref (추가 정보)

---

## 🔗 Enhanced Prompt와 MCP 통합

### 통합 원리

**Enhanced Prompt 시스템은 MCP 도구 자동 발동의 핵심 엔진입니다.**

```
Enhanced Prompt 생성 과정에서 MCP 자동 발동:

1. 요청 분석 단계
   → 요청 타입 감지
   → MCP 우선순위 자동 설정
   
2. 컨텍스트 수집 단계
   → Memory MCP 자동 호출 (항상)
   → Serena MCP 자동 호출 (코드 관련)
   → Context7 MCP 자동 호출 (라이브러리 관련)
   → Ref MCP 자동 호출 (추가 정보 필요)
   → Shadcn-UI/Magic/Supabase MCP 자동 호출 (조건부)
   
3. XML 생성 단계
   → 수집된 컨텍스트를 구조화
   → <approach>에 MCP 사용 계획 포함
   
4. Sequential Thinking 단계
   → 필요한 MCP 도구 식별
   → 실행 순서 결정
   
5. 작업 수행 단계
   → 계획된 MCP 도구 순차 실행
   → 결과 검증 및 저장
```

### 자동 발동 규칙

**Enhanced Prompt 생성 시 다음 규칙에 따라 MCP가 자동 발동됩니다:**

#### 필수 발동 (항상)
- **Memory MCP**: 모든 요청에서 과거 학습 검색
- **Sequential Thinking MCP**: 모든 요청에서 사고 과정 표시

#### 조건부 발동 (요청 타입별)
- **Serena MCP**: 코드 수정/추가/분석 요청 시
- **Context7 MCP**: 라이브러리 사용 요청 시
- **Ref MCP**: 추가 정보 필요 시
- **Shadcn-UI MCP**: 표준 UI 컴포넌트 요청 시
- **Magic MCP**: 커스텀 UI 컴포넌트 요청 시
- **Supabase MCP**: 데이터베이스 작업 요청 시

### 통합 흐름도

```
사용자 요청
    ↓
┌─────────────────────────────────────┐
│   Enhanced Prompt 생성 시작          │
├─────────────────────────────────────┤
│ [1] 요청 분석                        │
│     - 키워드 추출                    │
│     - 요청 타입 결정                 │
│     - MCP 우선순위 설정              │
├─────────────────────────────────────┤
│ [2] 컨텍스트 수집 (MCP 자동 발동)    │
│     ✓ Memory MCP                    │
│     ✓ Serena MCP (조건부)           │
│     ✓ Context7 MCP (조건부)         │
│     ✓ Ref MCP (조건부)              │
│     ✓ 기타 MCP (조건부)             │
├─────────────────────────────────────┤
│ [3] XML 생성                        │
│     - <task>                        │
│     - <context>                     │
│     - <approach>                    │
│     - <expected_output>             │
├─────────────────────────────────────┤
│ [4] Enhanced Prompt 표시            │
│     📋 박스 형식 출력               │
├─────────────────────────────────────┤
│ [5] Sequential Thinking 트리거      │
│     🧠 사고 과정 표시               │
│     - 필요한 MCP 식별               │
│     - 실행 순서 결정                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   작업 수행 (MCP 순차 실행)          │
├─────────────────────────────────────┤
│ 계획된 MCP 도구 자동 발동:           │
│ 1. Serena: 코드 분석                │
│ 2. Shadcn-UI/Magic: UI 컴포넌트     │
│ 3. Context7: 라이브러리 문서        │
│ 4. Supabase: DB 작업                │
│ 5. Memory: 학습 저장                │
└─────────────────────────────────────┘
    ↓
작업 완료
```

### 실행 예시: 전체 통합 흐름

```
사용자: "로그인 페이지 만들어줘"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Enhanced Prompt 생성]

[1단계] 요청 분석
🔍 키워드: ['만들어', '로그인', '페이지']
   요청 타입: 기능 추가
   MCP 우선순위: Serena → Context7 → Memory → Shadcn-UI

[2단계] 컨텍스트 수집 (MCP 자동 발동)
📦 Memory: 과거 로그인 구현 검색
   → "task-042: Clerk 인증 패턴" 발견
   
   Serena: 기존 인증 코드 분석
   → middleware.ts, app/login 확인
   
   Context7: Next.js + Clerk 문서
   → 최신 인증 패턴 확인
   
   Shadcn-UI: Form, Input, Button 컴포넌트
   → 컴포넌트 소스 확인

[3단계] XML 생성
<task>Clerk 기반 로그인 페이지 구현</task>
<context>
  <current_situation>
    - Next.js 15.2.3 + Clerk 인증
    - middleware.ts에 보호 경로 설정됨
    - 과거 Clerk 사용 경험 있음
  </current_situation>
  <requirements>
    - 이메일/비밀번호 로그인
    - Shadcn-UI Form 컴포넌트 사용
    - 로그인 성공 시 대시보드 리다이렉트
  </requirements>
  <constraints>
    - Clerk 인증 플로우 준수
    - 모바일 반응형
    - 접근성 보장
  </constraints>
</context>
<approach>
  <step number="1">
    Clerk 설정 확인 - Serena로 현재 설정 파악
  </step>
  <step number="2">
    로그인 폼 UI - Shadcn-UI Form 컴포넌트 활용
  </step>
  <step number="3">
    Clerk 인증 연동 - SignIn 컴포넌트 통합
  </step>
  <step number="4">
    리다이렉트 로직 - 성공 시 /dashboard 이동
  </step>
  <step number="5">
    테스트 및 검증 - 전체 플로우 확인
  </step>
</approach>
<expected_output>
  - 로그인 페이지 완성 (app/login/page.tsx)
  - Clerk 인증 정상 동작
  - 로그인 성공 시 대시보드 이동
  - 모바일 반응형 지원
</expected_output>

[4단계] Enhanced Prompt 표시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 **Enhanced Prompt Applied**
✓ Task analysis complete
✓ Context structured
✓ Approach defined
✓ Expected output clarified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENHANCED PROMPT:

Let's think step-by-step to execute this perfectly.

[위의 XML 내용]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[5단계] Sequential Thinking 트리거
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 **Sequential Thinking 시작**

Thought 1/5: 요청 분석
- 로그인 페이지 구현 필요
- Clerk 인증 사용 중
- Shadcn-UI 컴포넌트 활용

Thought 2/5: 과거 학습 활용
- task-042에서 Clerk 패턴 확인
- SignIn 컴포넌트 사용 방법 파악

Thought 3/5: 기존 설정 확인
- Serena로 middleware.ts 확인
- 보호 경로 설정 확인

Thought 4/5: 구현 방법 결정
- Shadcn-UI Form 사용
- Clerk SignIn 컴포넌트 통합
- 리다이렉트 로직 추가

Thought 5/5: 실행 계획
1. Serena로 Clerk 설정 확인
2. Shadcn-UI Form 컴포넌트 확인
3. app/login/page.tsx 생성
4. Clerk SignIn 통합
5. 테스트

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[6단계] 작업 수행 (MCP 순차 실행)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ **작업 수행 시작**

1. ✅ Serena: middleware.ts 분석
   → Clerk 설정 확인 완료

2. ✅ Shadcn-UI: Form, Input, Button 확인
   → 컴포넌트 소스 확인 완료

3. ✅ Context7: Clerk 문서 참조
   → SignIn 컴포넌트 사용법 확인

4. [구현 시작]
   → app/login/page.tsx 생성
   → Clerk SignIn 컴포넌트 통합
   → 리다이렉트 로직 추가

5. ✅ Memory: 학습 저장
   → "로그인 페이지 구현 패턴" 저장

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작업 완료!
```

---

## 📖 Related Documentation

**Enhanced Prompt 시스템:**
- [Prompt Enhancement](./prompt-enhancement.md) - 시스템 개요
- [Prompt Enhancement Executor](./prompt-enhancement-executor.md) - 실행 로직
- [XML Template Variants](./xml-template-variants.md) - 요청 타입별 템플릿
- [Context Collector Template](./context-collector-template.md) - 컨텍스트 수집
- [Sequential Thinking Trigger](./sequential-thinking-trigger-template.md) - 트리거 로직

**MCP 도구별 상세 가이드:**
- [Sequential Thinking](../../docs/mcp/sequential-thinking.md) - 체계적 사고
- [Memory System](../../docs/mcp/memory.md) - 학습 축적
- [Serena](../../docs/mcp/serena.md) - 코드베이스 분석
- [Context7](../../docs/mcp/context7.md) - 라이브러리 문서
- [Supabase](../../docs/mcp/supabase.md) - 데이터베이스
- [Shadcn-UI](../../docs/mcp/shadcn-ui.md) - UI 컴포넌트 참조
- [Magic](../../docs/mcp/magic.md) - AI 컴포넌트 생성
- [Ref](../../docs/mcp/ref.md) - 웹 문서 검색

**통합 가이드:**
- [MCP Integration Strategy](./mcp-integration-strategy.md) - MCP 통합 전략
- [Decision Tree](../../docs/mcp/decision-tree.md) - MCP 선택 로직
- [Best Practices](../../docs/mcp/best-practices.md) - 베스트 프랙티스

---

**Version**: 3.0  
**Status**: Active - Always On  
**Enforcement**: AUTOMATIC - Enhanced Prompt 기반 자동 발동  
**Last Updated**: 2025-01-07  
**Project**: PixelFactory