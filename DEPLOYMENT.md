# Vercel 배포 가이드

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에서 다음 변수들을 추가하세요:

```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_SUPABASE_URL=https://ozucmiwrfrvmsecmoivq.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

**중요**: 모든 환경에 동일하게 설정 (Production, Preview, Development)

### 2. Supabase 설정

#### CORS 설정
Supabase Dashboard → Settings → API → CORS Allowed Origins에 추가:
```
https://your-domain.vercel.app
https://*.vercel.app
```

#### RLS 정책 확인
다음 SQL을 실행하여 RLS 정책이 올바른지 확인:
```sql
-- user_profiles 조회 권한
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- matching_queue 조회 권한
SELECT * FROM pg_policies WHERE tablename = 'matching_queue';

-- notifications 생성 권한
SELECT * FROM pg_policies WHERE tablename = 'notifications';
```

### 3. 빌드 설정

Vercel Dashboard → Settings → Build & Development Settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. 도메인 설정

#### 커스텀 도메인 (선택사항)
Vercel Dashboard → Settings → Domains에서 커스텀 도메인 추가

#### index.html 업데이트
배포 후 `index.html`의 다음 부분을 실제 도메인으로 변경:
- Open Graph URL
- Twitter Card URL
- Sitemap URL (robots.txt)

### 5. 성능 최적화

#### 이미지 최적화
- 파비콘 생성: https://realfavicongenerator.net/
- OG 이미지 생성 (1200x630px)
- 아이콘 생성 (192x192, 512x512)

다음 파일들을 `public/` 폴더에 추가:
```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
└── og-image.png
```

### 6. SEO 최적화

#### Sitemap 생성
`public/sitemap.xml` 파일 생성:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.vercel.app/</loc>
    <lastmod>2025-01-13</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

#### Google Search Console
1. https://search.google.com/search-console 접속
2. 도메인 추가
3. Sitemap 제출

### 7. 모니터링 설정

#### Vercel Analytics (무료)
Vercel Dashboard → Analytics 탭에서 활성화

#### Error Tracking (선택사항)
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com

## 🚀 배포 명령어

### GitHub 연동 (권장)
1. GitHub에 저장소 푸시
2. Vercel Dashboard에서 Import Project
3. 자동 배포 설정 완료

### CLI 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

## 🔍 배포 후 확인사항

### 1. 기능 테스트
- [ ] 회원가입/로그인
- [ ] 페르소나 테스트
- [ ] 매칭 시작
- [ ] 알림 수신
- [ ] 매칭 히스토리

### 2. 성능 테스트
- [ ] Lighthouse 점수 (90+ 목표)
- [ ] 페이지 로드 시간 (3초 이내)
- [ ] 모바일 반응형

### 3. SEO 테스트
- [ ] Open Graph 미리보기 (Facebook Debugger)
- [ ] Twitter Card 미리보기
- [ ] Google 검색 결과

## 🐛 트러블슈팅

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 로그 확인
vercel logs
```

### 환경 변수 오류
- Vercel Dashboard에서 환경 변수 재확인
- `VITE_` 접두사 확인
- 재배포 (Deployments → Redeploy)

### CORS 오류
- Supabase CORS 설정 확인
- Vercel 도메인 추가 확인

### 404 오류 (라우팅)
- `vercel.json`의 rewrites 설정 확인
- SPA 라우팅 설정 확인

## 📊 성능 최적화 팁

### 1. Code Splitting
이미 Vite가 자동으로 처리

### 2. 이미지 최적화
- WebP 형식 사용
- Lazy loading 적용

### 3. 캐싱 전략
`vercel.json`에 이미 설정됨:
- 정적 파일: 1년 캐싱
- HTML: 캐싱 안함

### 4. Bundle 크기 최적화
```bash
# Bundle 분석
npm run build -- --mode analyze
```

## 🔒 보안 체크리스트

- [x] HTTPS 강제 (Vercel 자동)
- [x] 보안 헤더 설정 (vercel.json)
- [x] 환경 변수 암호화 (Vercel 자동)
- [x] RLS 정책 활성화 (Supabase)
- [x] Rate Limiting 구현
- [x] XSS 방어 (DOMPurify)
- [x] SQL Injection 방어

## 📞 지원

문제가 발생하면:
1. Vercel 로그 확인
2. Supabase 로그 확인
3. 브라우저 콘솔 확인

---

**배포 성공을 기원합니다! 🎉**
