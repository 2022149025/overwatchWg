# ✅ Vercel 배포 전 최종 체크리스트

## 🎉 완료된 항목

### 1. 빌드 설정 ✅
- [x] `vercel.json` 생성 (SPA 라우팅, 보안 헤더, 캐싱)
- [x] `package.json` 빌드 스크립트 확인
- [x] `vite.config.ts` 설정 확인
- [x] Tailwind CSS v3 설치 및 설정
- [x] PostCSS 설정
- [x] 빌드 테스트 성공 ✅

### 2. 환경 변수 ✅
- [x] `.env.example` 생성
- [x] `.gitignore`에 `.env.local` 포함 확인
- [x] 환경 변수 문서화

**Vercel에서 설정해야 할 환경 변수:**
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=https://ozucmiwrfrvmsecmoivq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. SEO 메타 태그 ✅
- [x] Primary meta tags (title, description, keywords)
- [x] Open Graph tags (Facebook)
- [x] Twitter Card tags
- [x] Canonical URL
- [x] Language 설정 (ko-KR)
- [x] Robots meta tag

**배포 후 수정 필요:**
- `index.html`의 `your-domain.vercel.app`를 실제 도메인으로 변경

### 4. PWA 설정 ✅
- [x] `manifest.json` 생성
- [x] Service Worker (`sw.js`) 생성
- [x] Theme color 설정
- [x] Apple mobile web app 설정
- [x] Loading screen 추가

**배포 후 추가 필요:**
- 아이콘 파일들 (`public/` 폴더):
  - `favicon.ico`
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png`
  - `icon-192.png`
  - `icon-512.png`
  - `og-image.png` (1200x630px)

### 5. API 엔드포인트 ✅
- [x] Supabase 클라이언트 설정
- [x] 환경 변수로 URL 관리
- [x] Rate Limiting 구현
- [x] 에러 처리

**Supabase에서 설정해야 할 것:**
- CORS Allowed Origins에 Vercel 도메인 추가:
  ```
  https://your-domain.vercel.app
  https://*.vercel.app
  ```

### 6. 보안 설정 ✅
- [x] 보안 헤더 (vercel.json)
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - Referrer-Policy
- [x] XSS 방어 (DOMPurify)
- [x] SQL Injection 방어
- [x] Rate Limiting
- [x] 입력 검증
- [x] 안전한 로깅

### 7. 성능 최적화 ✅
- [x] Code splitting (Vite 자동)
- [x] 정적 파일 캐싱 (1년)
- [x] Preconnect to Supabase
- [x] DNS prefetch
- [x] Loading spinner

**경고:**
- Bundle 크기: 729.79 kB (권장: 500 kB 이하)
- 추후 dynamic import로 최적화 권장

### 8. 추가 파일 ✅
- [x] `robots.txt`
- [x] `DEPLOYMENT.md` (배포 가이드)
- [x] `.env.example`

---

## 📋 배포 전 필수 작업

### 1. 아이콘 생성 🎨
다음 사이트에서 아이콘 생성:
- https://realfavicongenerator.net/

필요한 파일:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

### 2. OG 이미지 생성 🖼️
- 크기: 1200x630px
- 파일명: `og-image.png`
- 내용: 앱 로고 + 설명 텍스트

### 3. Vercel 환경 변수 설정 ⚙️
Vercel Dashboard → Settings → Environment Variables:
```
VITE_GEMINI_API_KEY=실제_키
VITE_SUPABASE_URL=실제_URL
VITE_SUPABASE_ANON_KEY=실제_키
```

### 4. Supabase CORS 설정 🔒
Supabase Dashboard → Settings → API → CORS:
```
https://your-domain.vercel.app
https://*.vercel.app
```

### 5. 도메인 업데이트 🌐
배포 후 `index.html`에서 다음 부분 수정:
- Line 15: `<meta property="og:url" content="https://실제도메인/">`
- Line 22: `<meta property="twitter:url" content="https://실제도메인/">`
- `public/robots.txt`: Sitemap URL 수정

---

## 🚀 배포 방법

### 방법 1: GitHub 연동 (권장)
1. GitHub에 코드 푸시
2. Vercel Dashboard → New Project
3. Import Git Repository
4. 환경 변수 설정
5. Deploy 클릭

### 방법 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🧪 배포 후 테스트

### 기능 테스트
- [ ] 회원가입/로그인
- [ ] 페르소나 테스트
- [ ] 매칭 시작
- [ ] 알림 수신
- [ ] 프로필 수정
- [ ] 매칭 히스토리

### 성능 테스트
- [ ] Lighthouse 점수 확인 (90+ 목표)
- [ ] 페이지 로드 시간 (3초 이내)
- [ ] 모바일 반응형 확인

### SEO 테스트
- [ ] Open Graph 미리보기: https://www.opengraph.xyz/
- [ ] Twitter Card 미리보기: https://cards-dev.twitter.com/validator
- [ ] Google Search Console 등록

### PWA 테스트
- [ ] 모바일에서 "홈 화면에 추가" 테스트
- [ ] 오프라인 동작 확인
- [ ] Service Worker 등록 확인

---

## 📊 성능 목표

- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1
- **Largest Contentful Paint**: < 2.5s

---

## 🐛 알려진 이슈

### Bundle 크기 경고
- 현재: 729.79 kB
- 권장: 500 kB 이하
- 해결: Dynamic import 적용 (추후 최적화)

### 동적 import 경고
- `matchingService.ts`가 정적/동적 import 혼용
- 영향: 없음 (경고만)
- 해결: 추후 import 구조 정리

---

## 📞 문제 해결

### 빌드 실패
```bash
npm run build
```
로컬에서 빌드 테스트

### 환경 변수 오류
Vercel Dashboard에서 환경 변수 재확인 후 Redeploy

### CORS 오류
Supabase CORS 설정에 Vercel 도메인 추가

### 404 오류
`vercel.json`의 rewrites 설정 확인

---

## ✨ 배포 완료 후

1. **도메인 공유**
   - 팀원들에게 URL 공유
   - 소셜 미디어 공유

2. **모니터링 설정**
   - Vercel Analytics 활성화
   - Error tracking 설정 (선택)

3. **SEO 등록**
   - Google Search Console
   - Naver 웹마스터 도구

4. **성능 모니터링**
   - Lighthouse 주기적 체크
   - 사용자 피드백 수집

---

**배포 준비 완료! 🎉**

모든 체크리스트를 확인하고 배포를 진행하세요.
