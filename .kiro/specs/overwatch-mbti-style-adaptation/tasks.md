# Implementation Plan: Overwatch MBTI 스타일 적용

이 문서는 오버워치 MBTI 스타일을 프로젝트에 적용하기 위한 구현 작업 목록입니다.

**현재 상태**: 
- Vite + React + TypeScript 프로젝트
- Tailwind CSS 사용 중
- 스타일 파일 없음 (CSS 변수, 커스텀 스타일 미적용)
- 오버워치 폰트 미적용
- 기본 Tailwind 스타일로만 구현됨

**목표**: 
- 오버워치 테마 CSS 변수 시스템 구축
- koverwatch 폰트 적용
- 모든 컴포넌트에 오버워치 스타일 적용
- Tailwind와 커스텀 CSS 혼용

---

## Task List

- [x] 1. 프로젝트 구조 및 폰트 설정




  - 스타일 디렉토리 구조 생성 및 오버워치 폰트 파일 추가
  - _Requirements: 1.1, 2.1, 2.6_

- [x] 1.1 스타일 디렉토리 구조 생성


  - `styles/` 디렉토리 생성 (프로젝트 루트)
  - `styles/components/` 서브 디렉토리 생성
  - `styles/fonts/` 서브 디렉토리 생성
  - _Requirements: 2.1_

- [x] 1.2 오버워치 폰트 파일 추가


  - `koverwatch.ttf` 파일을 `styles/fonts/` 에 추가
  - 폰트 라이선스 확인 및 문서화 (README에 추가)
  - _Requirements: 2.1, 2.6_

---

- [x] 2. CSS 변수 시스템 구현




  - 전역 CSS 변수 정의 및 폰트 로딩 설정
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 overwatch-theme.css 파일 생성

  - `styles/overwatch-theme.css` 파일 생성
  - CSS 변수 정의:
    * 색상: --ow-primary (#FA9C1D), --ow-secondary (#4A4C4E), --ow-background, --ow-text-primary, --ow-text-secondary
    * 그라데이션: --ow-gradient-start (#E8E4F3), --ow-gradient-end (#D4E4F7)
    * 타이포그래피: --ow-font-family, --ow-font-size-h1 (50px), --ow-font-size-h2 (30px), --ow-font-size-body (16px)
    * 간격: --ow-spacing-xs (8px), sm (12px), md (20px), lg (32px), xl (48px)
    * Border radius: --ow-radius-sm (5px), md (10px), lg (15px), full (50%)
    * Transition: --ow-transition-normal (0.5s cubic-bezier(0.17, 0.66, 0.08, 1.02))
    * Shadow: --ow-shadow-sm, md, lg
    * Layout: --ow-container-max-width (960px)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 2.5_

- [x] 2.2 폰트 로딩 설정

  - `@font-face` 규칙 추가 (koverwatch 폰트)
  - `font-display: swap` 설정
  - body 요소에 폰트 패밀리 적용
  - fallback 폰트: sans-serif
  - _Requirements: 2.1, 2.6_

- [x] 2.3 App.tsx에 테마 CSS 임포트

  - `import './styles/overwatch-theme.css'` 추가
  - 전역 스타일 적용 확인
  - 브라우저에서 CSS 변수 로드 확인
  - _Requirements: 1.1, 2.1_

---

- [x] 3. 타이포그래피 스타일 구현




  - 헤딩 및 본문 텍스트 스타일 정의
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 typography.css 파일 생성


  - `styles/components/typography.css` 파일 생성
  - h1, h2, h3, h4, h5, h6 스타일 정의:
    * font-family: var(--ow-font-family)
    * font-weight: 500
    * color: var(--ow-text-secondary)
    * text-align: center
  - 본문 텍스트 (p, .ow-text) 스타일 정의
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 3.2 유틸리티 클래스 추가

  - `.ow-text-center`, `.ow-text-primary`, `.ow-text-secondary` 클래스 정의
  - overwatch-theme.css 또는 typography.css에 추가
  - _Requirements: 2.5_

- [x] 3.3 반응형 타이포그래피 구현

  - @media (max-width: 768px): h1 36px, h2 24px, body 14px
  - @media (max-width: 480px): h1 28px, h2 20px, body 14px
  - CSS 변수를 미디어 쿼리 내에서 재정의
  - _Requirements: 7.2, 7.3_

---

- [x] 4. 버튼 컴포넌트 스타일 구현




  - 버튼 스타일 정의 및 컴포넌트 수정
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 4.1 button.css 파일 생성


  - `styles/components/button.css` 파일 생성
  - `.ow-button` 기본 스타일 정의:
    * background-color: var(--ow-primary)
    * color: var(--ow-white)
    * font-family: var(--ow-font-family)
    * font-size: 30px (var(--ow-font-size-h2))
    * width: 260px, height: 60px
    * border-radius: var(--ow-radius-md)
    * transition: var(--ow-transition-normal)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.2 버튼 상태 스타일 추가


  - `:hover`: background-color 변경, transform: translateY(-2px), box-shadow 추가
  - `:active`: transform: translateY(0)
  - `:focus-visible`: box-shadow outline 추가
  - `:disabled`: opacity: 0.5, cursor: not-allowed
  - _Requirements: 3.6, 8.1, 8.2, 8.3_

- [x] 4.3 버튼 variant 스타일 추가


  - `.ow-button--secondary`: background-color: var(--ow-secondary)
  - `.ow-button--outline`: background: transparent, border: 2px solid var(--ow-primary)
  - _Requirements: 3.1_

- [x] 4.4 버튼 size 스타일 추가


  - `.ow-button--small`: width: 180px, height: 45px, font-size: 20px
  - `.ow-button--large`: width: 320px, height: 75px, font-size: 36px
  - _Requirements: 3.3, 7.4_

- [x] 4.5 Button.tsx 컴포넌트 수정


  - `components/Button.tsx` 파일 수정
  - 기존 Tailwind 클래스를 오버워치 CSS 클래스로 교체
  - `.ow-button` 기본 클래스 적용
  - variant에 따라 `.ow-button--secondary`, `.ow-button--outline` 추가
  - size에 따라 `.ow-button--small`, `.ow-button--large` 추가
  - onBlur 핸들러 추가: `onBlur={(e) => e.currentTarget.blur()}`
  - button.css import 추가
  - _Requirements: 3.7_

---

- [x] 5. 레이아웃 스타일 구현




  - 레이아웃 컨테이너 및 그라데이션 배경 구현
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.1 layout.css 파일 생성


  - `styles/components/layout.css` 파일 생성
  - `.ow-layout` 스타일 정의:
    * min-height: 100vh
    * background: linear-gradient(180deg, var(--ow-gradient-start) 0%, var(--ow-gradient-end) 100%)
    * display: flex, flex-direction: column
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.2 컨테이너 스타일 추가


  - `.ow-container`: max-width: var(--ow-container-max-width), margin: 0 auto, padding: var(--ow-container-padding)
  - `.ow-content-center`: display: flex, flex-direction: column, align-items: center, justify-content: center, min-height: 100vh, text-align: center
  - `.ow-section`: padding: var(--ow-spacing-xl) 0
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 5.3 간격 유틸리티 클래스 추가


  - `.ow-mt-xs`, `.ow-mt-sm`, `.ow-mt-md`, `.ow-mt-lg`, `.ow-mt-xl`
  - `.ow-mb-xs`, `.ow-mb-sm`, `.ow-mb-md`, `.ow-mb-lg`, `.ow-mb-xl`
  - margin-top, margin-bottom에 CSS 변수 사용
  - _Requirements: 4.3, 4.6_

- [x] 5.4 Layout.tsx 컴포넌트 수정


  - `components/Layout.tsx` 파일 수정
  - 최상위 div에 `.ow-layout` 클래스 추가 (기존 Tailwind 클래스와 병행)
  - header 내부 container에 `.ow-container` 클래스 추가
  - main 태그에 `.ow-container` 클래스 추가
  - layout.css import 추가
  - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4_

---

- [x] 6. 이미지 스타일 구현




  - 로고 및 아바타 이미지 스타일 정의
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6.1 이미지 스타일 추가

  - overwatch-theme.css에 이미지 스타일 추가:
    * `.ow-logo`: width: 100px, height: auto, display: block, margin: 0 auto
    * `.ow-avatar`: border-radius: var(--ow-radius-full), object-fit: cover
    * `.ow-avatar--small`: width: 40px, height: 40px
    * `.ow-avatar--medium`: width: 80px, height: 80px
    * `.ow-avatar--large`: width: 120px, height: 120px
    * `.ow-image-center`: display: block, margin: 0 auto
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

---

- [-] 7. 반응형 디자인 구현



  - 모바일 및 태블릿 화면 최적화
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [-] 7.1 모바일 버튼 스타일 조정

  - button.css에 미디어 쿼리 추가
  - @media (max-width: 768px):
    * .ow-button: width: 100%, max-width: 280px, height: 50px, font-size: 24px
  - @media (max-width: 480px):
    * .ow-button: height: 44px, font-size: 20px
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 7.2 모바일 레이아웃 조정
  - layout.css에 미디어 쿼리 추가
  - @media (max-width: 768px):
    * .ow-container: padding: 0 12px
  - @media (max-width: 480px):
    * .ow-content-center: padding 조정
  - _Requirements: 7.1, 7.3_

---

- [x] 8. 애니메이션 및 접근성 구현




  - 인터랙션 애니메이션 및 접근성 지원
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 8.1 Reduced Motion 지원 추가

  - overwatch-theme.css에 미디어 쿼리 추가
  - @media (prefers-reduced-motion: reduce):
    * 모든 애니메이션 duration을 0.01ms로 설정
    * transition-duration: 0.01ms !important
  - _Requirements: 8.5_

---

- [x] 9. 기존 컴포넌트에 스타일 적용




  - PersonaTestPage, AuthPage, MainPage에 오버워치 스타일 적용
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 9.1 PersonaTestPage 스타일 적용


  - `components/PersonaTest/PersonaTestPage.tsx` 수정
  - 최상위 div에 `.ow-layout`, `.ow-content-center` 클래스 추가
  - 기존 Tailwind 클래스 유지하되 오버워치 클래스 추가
  - h1 태그가 있다면 오버워치 타이포그래피 적용 확인
  - _Requirements: 1.1, 2.2, 3.1, 4.1, 5.1_

- [x] 9.2 AuthPage 스타일 적용


  - `components/Auth/AuthPage.tsx` 수정
  - 최상위 div에 `.ow-layout` 클래스 추가
  - 폼 컨테이너에 `.ow-container` 클래스 추가 (선택적)
  - Button 컴포넌트는 이미 수정되었으므로 자동 적용됨
  - h2 태그에 오버워치 타이포그래피 적용 확인
  - _Requirements: 1.1, 2.2, 3.1, 4.1, 5.1_

- [x] 9.3 MainPage 및 하위 페이지 스타일 적용


  - `components/Main/MainPage.tsx` 및 하위 페이지들 확인
  - 필요시 `.ow-layout` 클래스 추가
  - 네비게이션 버튼은 Button 컴포넌트 사용 시 자동 적용됨
  - 헤딩 태그들이 오버워치 타이포그래피 적용되는지 확인
  - _Requirements: 1.1, 2.2, 3.1, 4.1, 5.1_

---

- [-] 10. 최종 검증 및 테스트


  - 브라우저에서 스타일 적용 확인
  - _Requirements: All_

- [x] 10.1 브라우저 테스트


  - `npm run dev` 실행
  - Chrome에서 페이지 로드 확인
  - 오버워치 폰트 적용 확인 (DevTools에서 font-family 확인)
  - CSS 변수 로드 확인 (DevTools > Elements > Computed)
  - 버튼 hover 애니메이션 확인
  - 그라데이션 배경 확인
  - _Requirements: All_

- [ ] 10.2 반응형 테스트
  - Chrome DevTools Device Mode 사용
  - 모바일 (375px): 버튼 크기, 폰트 크기 확인
  - 태블릿 (768px): 레이아웃 확인
  - 데스크톱 (1280px): 전체 레이아웃 확인
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 10.3 README 업데이트
  - README.md에 오버워치 테마 적용 내용 추가
  - 폰트 파일 위치 및 라이선스 정보 추가
  - 스타일 커스터마이징 방법 추가
  - _Requirements: All_

---

## 구현 순서 요약

**Phase 1: 기본 설정** (Tasks 1-3)
- 디렉토리 구조 생성
- 폰트 파일 추가
- CSS 변수 시스템 구현
- 타이포그래피 스타일 정의

**Phase 2: 컴포넌트 스타일** (Tasks 4-6)
- 버튼 컴포넌트 스타일 및 수정
- 레이아웃 스타일 및 수정
- 이미지 스타일 정의

**Phase 3: 반응형 및 접근성** (Tasks 7-8)
- 반응형 디자인 구현
- Reduced Motion 지원

**Phase 4: 통합 및 검증** (Tasks 9-10)
- 기존 페이지에 스타일 적용
- 브라우저 테스트
- README 업데이트

---

## 주요 변경 사항

**현재 프로젝트 상태 기반 조정:**
1. Vite 프로젝트이므로 `src/` 대신 프로젝트 루트에 `styles/` 디렉토리 생성
2. Tailwind CSS와 병행 사용 (기존 Tailwind 클래스 유지하되 오버워치 클래스 추가)
3. 불필요한 테스트 작업 제거 (접근성, 성능, 크로스 브라우저는 선택적)
4. 폰트 로더 유틸리티 제거 (CSS @font-face로 충분)
5. 핵심 구현에 집중: CSS 변수, 폰트, 버튼, 레이아웃, 타이포그래피

**구현 우선순위:**
- P0 (필수): Tasks 1-6, 9 (기본 스타일 시스템 및 적용)
- P1 (중요): Tasks 7-8 (반응형 및 접근성)
- P2 (선택): Task 10 (검증 및 문서화)

---

**Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: 2025-01-13  
**Project**: 오버워치 게임 친구 찾기
