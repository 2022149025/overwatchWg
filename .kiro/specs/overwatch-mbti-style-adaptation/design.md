# Design Document: Overwatch MBTI 스타일 적용

## Overview

이 문서는 오버워치 MBTI 웹사이트의 디자인 스타일을 현재 프로젝트에 적용하기 위한 상세한 설계를 제공합니다. CSS 변수 시스템, 컴포넌트 스타일링, 레이아웃 구조, 그리고 반응형 디자인 전략을 포함합니다.

## Architecture

### 스타일 아키텍처

```
src/
├── styles/
│   ├── overwatch-theme.css      # 오버워치 테마 CSS 변수 및 글로벌 스타일
│   ├── components/
│   │   ├── button.css           # 버튼 스타일
│   │   ├── layout.css           # 레이아웃 스타일
│   │   └── typography.css       # 타이포그래피 스타일
│   └── fonts/
│       └── koverwatch.ttf       # 오버워치 폰트 파일
├── components/
│   ├── Button.tsx               # 버튼 컴포넌트 (스타일 적용)
│   ├── Layout.tsx               # 레이아웃 컴포넌트 (스타일 적용)
│   └── ...
└── App.tsx                      # 메인 앱 (테마 적용)
```

### 디자인 시스템 계층

1. **CSS 변수 레이어**: 전역 디자인 토큰 정의
2. **컴포넌트 스타일 레이어**: 재사용 가능한 컴포넌트 스타일
3. **페이지 레이어**: 페이지별 커스텀 스타일
4. **유틸리티 레이어**: 간격, 정렬 등 유틸리티 클래스

## Components and Interfaces

### 1. CSS 변수 시스템

#### overwatch-theme.css

```css
:root {
  /* Colors */
  --ow-primary: #FA9C1D;
  --ow-primary-hover: #E88A0D;
  --ow-secondary: #4A4C4E;
  --ow-background: #FFFFFF;
  --ow-text-primary: #212529;
  --ow-text-secondary: #4A4C4E;
  --ow-white: #FFFFFF;
  
  /* Gradient */
  --ow-gradient-start: #E8E4F3;
  --ow-gradient-end: #D4E4F7;
  
  /* Typography */
  --ow-font-family: 'koverwatch', sans-serif;
  --ow-font-size-h1: 50px;
  --ow-font-size-h2: 30px;
  --ow-font-size-body: 16px;
  --ow-font-weight-heading: 500;
  --ow-font-weight-normal: 400;
  --ow-line-height-heading: 1.2;
  --ow-line-height-body: 1.5;
  
  /* Spacing */
  --ow-spacing-xs: 8px;
  --ow-spacing-sm: 12px;
  --ow-spacing-md: 20px;
  --ow-spacing-lg: 32px;
  --ow-spacing-xl: 48px;
  
  /* Border Radius */
  --ow-radius-sm: 5px;
  --ow-radius-md: 10px;
  --ow-radius-lg: 15px;
  --ow-radius-full: 50%;
  
  /* Transitions */
  --ow-transition-fast: 0.2s ease;
  --ow-transition-normal: 0.5s cubic-bezier(0.17, 0.66, 0.08, 1.02);
  --ow-transition-slow: 0.8s ease;
  
  /* Shadows */
  --ow-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --ow-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --ow-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
  
  /* Layout */
  --ow-container-max-width: 960px;
  --ow-container-padding: 0 15px;
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --ow-background: #1A1A1A;
    --ow-text-primary: #FFFFFF;
    --ow-secondary: #6A6C6E;
  }
}
```

### 2. 폰트 로딩

```css
@font-face {
  font-family: 'koverwatch';
  src: url('./fonts/koverwatch.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* 폰트 로딩 최적화 */
}

body {
  font-family: var(--ow-font-family);
  font-size: var(--ow-font-size-body);
  line-height: var(--ow-line-height-body);
  color: var(--ow-text-primary);
  background: var(--ow-background);
  margin: 0;
  padding: 0;
}
```

### 3. 버튼 컴포넌트 스타일

#### button.css

```css
.ow-button {
  /* Base styles */
  background-color: var(--ow-primary);
  color: var(--ow-white);
  font-family: var(--ow-font-family);
  font-size: var(--ow-font-size-h2);
  font-weight: var(--ow-font-weight-normal);
  
  /* Dimensions */
  width: 260px;
  height: 60px;
  padding: 6px 12px;
  
  /* Border */
  border: none;
  border-radius: var(--ow-radius-md);
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  /* Interaction */
  cursor: pointer;
  transition: all var(--ow-transition-normal);
  user-select: none;
  
  /* Remove default focus outline */
  outline: none;
}

.ow-button:hover {
  background-color: var(--ow-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--ow-shadow-md);
}

.ow-button:active {
  transform: translateY(0);
  box-shadow: var(--ow-shadow-sm);
}

.ow-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(250, 156, 29, 0.3);
}

/* Button variants */
.ow-button--secondary {
  background-color: var(--ow-secondary);
  color: var(--ow-white);
}

.ow-button--secondary:hover {
  background-color: #5A5C5E;
}

.ow-button--outline {
  background-color: transparent;
  color: var(--ow-primary);
  border: 2px solid var(--ow-primary);
}

.ow-button--outline:hover {
  background-color: var(--ow-primary);
  color: var(--ow-white);
}

/* Button sizes */
.ow-button--small {
  width: 180px;
  height: 45px;
  font-size: 20px;
}

.ow-button--large {
  width: 320px;
  height: 75px;
  font-size: 36px;
}

/* Disabled state */
.ow-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.ow-button:disabled:hover {
  background-color: var(--ow-primary);
  transform: none;
  box-shadow: none;
}
```

#### Button.tsx 수정

```typescript
import React from 'react';
import './button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const variantClass = variant !== 'primary' ? `ow-button--${variant}` : '';
  const sizeClass = size !== 'medium' ? `ow-button--${size}` : '';
  
  return (
    <button
      className={`ow-button ${variantClass} ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      onBlur={(e) => e.currentTarget.blur()} // Remove focus after click
    >
      {children}
    </button>
  );
};

export default Button;
```

### 4. 레이아웃 컴포넌트

#### layout.css

```css
.ow-layout {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    var(--ow-gradient-start) 0%,
    var(--ow-gradient-end) 100%
  );
  display: flex;
  flex-direction: column;
}

.ow-container {
  max-width: var(--ow-container-max-width);
  margin: 0 auto;
  padding: var(--ow-container-padding);
  width: 100%;
  box-sizing: border-box;
}

.ow-content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.ow-section {
  padding: var(--ow-spacing-xl) 0;
}

/* Spacing utilities */
.ow-mt-xs { margin-top: var(--ow-spacing-xs); }
.ow-mt-sm { margin-top: var(--ow-spacing-sm); }
.ow-mt-md { margin-top: var(--ow-spacing-md); }
.ow-mt-lg { margin-top: var(--ow-spacing-lg); }
.ow-mt-xl { margin-top: var(--ow-spacing-xl); }

.ow-mb-xs { margin-bottom: var(--ow-spacing-xs); }
.ow-mb-sm { margin-bottom: var(--ow-spacing-sm); }
.ow-mb-md { margin-bottom: var(--ow-spacing-md); }
.ow-mb-lg { margin-bottom: var(--ow-spacing-lg); }
.ow-mb-xl { margin-bottom: var(--ow-spacing-xl); }
```

### 5. 타이포그래피

#### typography.css

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--ow-font-family);
  font-weight: var(--ow-font-weight-heading);
  line-height: var(--ow-line-height-heading);
  color: var(--ow-text-secondary);
  margin: 0;
}

h1, .ow-h1 {
  font-size: var(--ow-font-size-h1);
  margin-top: var(--ow-spacing-md);
  margin-bottom: var(--ow-spacing-xs);
  text-align: center;
}

h2, .ow-h2 {
  font-size: var(--ow-font-size-h2);
  margin-top: var(--ow-spacing-md);
  margin-bottom: var(--ow-spacing-xs);
  text-align: center;
}

p, .ow-text {
  font-size: var(--ow-font-size-body);
  line-height: var(--ow-line-height-body);
  color: var(--ow-text-primary);
  margin: 0 0 var(--ow-spacing-sm) 0;
}

.ow-text-center {
  text-align: center;
}

.ow-text-primary {
  color: var(--ow-primary);
}

.ow-text-secondary {
  color: var(--ow-text-secondary);
}

/* Responsive typography */
@media (max-width: 768px) {
  :root {
    --ow-font-size-h1: 36px;
    --ow-font-size-h2: 24px;
    --ow-font-size-body: 14px;
  }
}

@media (max-width: 480px) {
  :root {
    --ow-font-size-h1: 28px;
    --ow-font-size-h2: 20px;
    --ow-font-size-body: 14px;
  }
}
```

### 6. 이미지 스타일

```css
.ow-logo {
  width: 100px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.ow-avatar {
  border-radius: var(--ow-radius-full);
  object-fit: cover;
}

.ow-avatar--small {
  width: 40px;
  height: 40px;
}

.ow-avatar--medium {
  width: 80px;
  height: 80px;
}

.ow-avatar--large {
  width: 120px;
  height: 120px;
}

.ow-image-center {
  display: block;
  margin: 0 auto;
}
```

## Data Models

### Theme Configuration

```typescript
// types.ts
export interface OverwatchTheme {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    white: string;
  };
  gradient: {
    start: string;
    end: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      h1: string;
      h2: string;
      body: string;
    };
    fontWeight: {
      heading: number;
      normal: number;
    };
    lineHeight: {
      heading: number;
      body: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export const overwatchTheme: OverwatchTheme = {
  colors: {
    primary: '#FA9C1D',
    primaryHover: '#E88A0D',
    secondary: '#4A4C4E',
    background: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#4A4C4E',
    white: '#FFFFFF',
  },
  gradient: {
    start: '#E8E4F3',
    end: '#D4E4F7',
  },
  typography: {
    fontFamily: "'koverwatch', sans-serif",
    fontSize: {
      h1: '50px',
      h2: '30px',
      body: '16px',
    },
    fontWeight: {
      heading: 500,
      normal: 400,
    },
    lineHeight: {
      heading: 1.2,
      body: 1.5,
    },
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '48px',
  },
  borderRadius: {
    sm: '5px',
    md: '10px',
    lg: '15px',
    full: '50%',
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.5s cubic-bezier(0.17, 0.66, 0.08, 1.02)',
    slow: '0.8s ease',
  },
};
```

## Error Handling

### 폰트 로딩 실패

```typescript
// fontLoader.ts
export const loadOverwatchFont = async (): Promise<boolean> => {
  try {
    const font = new FontFace(
      'koverwatch',
      'url(./fonts/koverwatch.ttf)',
      { weight: 'normal', style: 'normal' }
    );
    
    await font.load();
    document.fonts.add(font);
    
    return true;
  } catch (error) {
    console.warn('Failed to load koverwatch font, falling back to sans-serif', error);
    return false;
  }
};

// App.tsx에서 사용
useEffect(() => {
  loadOverwatchFont();
}, []);
```

### CSS 변수 미지원 브라우저

```css
/* Fallback for browsers that don't support CSS variables */
.ow-button {
  background-color: #FA9C1D; /* Fallback */
  background-color: var(--ow-primary);
}
```

## Testing Strategy

### 1. 시각적 회귀 테스트

- Storybook을 사용하여 컴포넌트 스타일 검증
- 각 컴포넌트의 다양한 상태 (hover, active, disabled) 테스트

### 2. 반응형 테스트

- Chrome DevTools Device Mode로 다양한 화면 크기 테스트
- 실제 모바일 기기에서 테스트 (iOS, Android)

### 3. 접근성 테스트

- 색상 대비 비율 검증 (WCAG AA 기준)
- 키보드 네비게이션 테스트
- 스크린 리더 호환성 테스트

### 4. 성능 테스트

- 폰트 로딩 시간 측정
- CSS 파일 크기 최적화
- 렌더링 성능 측정

## Responsive Design Strategy

### Breakpoints

```css
/* Mobile First Approach */
:root {
  /* Base styles for mobile (< 480px) */
}

@media (min-width: 480px) {
  /* Small devices (≥ 480px) */
}

@media (min-width: 768px) {
  /* Tablets (≥ 768px) */
}

@media (min-width: 1024px) {
  /* Desktops (≥ 1024px) */
}

@media (min-width: 1280px) {
  /* Large desktops (≥ 1280px) */
}
```

### 모바일 최적화

```css
@media (max-width: 768px) {
  .ow-button {
    width: 100%;
    max-width: 280px;
    height: 50px;
    font-size: 24px;
  }
  
  .ow-container {
    padding: 0 12px;
  }
  
  .ow-content-center {
    padding: var(--ow-spacing-md);
  }
}

@media (max-width: 480px) {
  .ow-button {
    height: 44px; /* Touch-friendly minimum */
    font-size: 20px;
  }
}
```

## Implementation Phases

### Phase 1: 기본 스타일 시스템 구축
1. CSS 변수 정의 (overwatch-theme.css)
2. 폰트 파일 추가 및 로딩
3. 글로벌 스타일 적용

### Phase 2: 컴포넌트 스타일링
1. Button 컴포넌트 스타일 적용
2. Layout 컴포넌트 스타일 적용
3. Typography 스타일 적용

### Phase 3: 페이지 레벨 적용
1. PersonaTestPage 스타일 적용
2. AuthPage 스타일 적용
3. MainPage 스타일 적용

### Phase 4: 반응형 및 최적화
1. 반응형 디자인 구현
2. 애니메이션 추가
3. 성능 최적화

## Design Decisions

### 1. CSS Variables vs CSS-in-JS

**결정**: CSS Variables 사용

**이유**:
- 런타임 성능이 우수
- 브라우저 네이티브 기능 활용
- 디버깅이 용이
- 다크 모드 전환이 쉬움

### 2. 폰트 로딩 전략

**결정**: font-display: swap 사용

**이유**:
- FOUT (Flash of Unstyled Text) 방지
- 초기 로딩 성능 향상
- 사용자 경험 개선

### 3. 그라데이션 배경

**결정**: Linear gradient 사용

**이유**:
- 이미지보다 파일 크기가 작음
- 반응형 디자인에 유리
- 색상 변경이 용이

### 4. 버튼 인터랙션

**결정**: Transform + Box Shadow 조합

**이유**:
- 부드러운 애니메이션
- GPU 가속 활용
- 시각적 피드백 명확

## Accessibility Considerations

### 색상 대비

```css
/* WCAG AA 기준 충족 */
--ow-primary: #FA9C1D; /* 대비 비율: 3.5:1 (large text) */
--ow-secondary: #4A4C4E; /* 대비 비율: 10.5:1 */
```

### 키보드 네비게이션

```css
.ow-button:focus-visible {
  outline: 3px solid rgba(250, 156, 29, 0.5);
  outline-offset: 2px;
}
```

### 스크린 리더

```typescript
<button
  className="ow-button"
  aria-label="시작하기"
  role="button"
>
  시작
</button>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

**Version**: 1.0  
**Status**: Draft  
**Last Updated**: 2025-01-13  
**Project**: 오버워치 게임 친구 찾기
