# GitHub 저장소 설정 및 Vercel 배포 가이드

## 📋 전체 과정 요약

1. Git 저장소 초기화
2. GitHub에 저장소 생성
3. 코드 푸시
4. Vercel 연동 및 배포

---

## 1️⃣ Git 저장소 초기화

### 1-1. Git 초기화
```bash
git init
```

### 1-2. 첫 커밋 생성
```bash
git add .
git commit -m "Initial commit: 오버워치 게임 친구 찾기 플랫폼"
```

---

## 2️⃣ GitHub 저장소 생성

### 2-1. GitHub 웹사이트에서 저장소 생성

1. https://github.com 접속 및 로그인
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. 저장소 정보 입력:
   - **Repository name**: `overwatch-friend-finder` (또는 원하는 이름)
   - **Description**: `오버워치 게임 친구 찾기 매칭 플랫폼`
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Initialize this repository with a README" 체크 해제** (이미 로컬에 파일이 있으므로)
4. `Create repository` 클릭

### 2-2. 저장소 URL 복사
생성 후 나오는 페이지에서 HTTPS URL 복사:
```
https://github.com/your-username/overwatch-friend-finder.git
```

---

## 3️⃣ GitHub에 코드 푸시

### 3-1. 원격 저장소 연결
```bash
git remote add origin https://github.com/your-username/overwatch-friend-finder.git
```

### 3-2. 브랜치 이름 변경 (main으로)
```bash
git branch -M main
```

### 3-3. 코드 푸시
```bash
git push -u origin main
```

**인증 필요 시:**
- GitHub 사용자명 입력
- Personal Access Token 입력 (비밀번호 대신)

### 3-4. Personal Access Token 생성 (필요한 경우)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. `Generate new token` → `Generate new token (classic)`
3. 권한 선택:
   - ✅ `repo` (전체 선택)
4. `Generate token` 클릭
5. 생성된 토큰 복사 (한 번만 표시됨!)
6. 푸시 시 비밀번호 대신 이 토큰 사용

---

## 4️⃣ Vercel 연동 및 배포

### 4-1. Vercel 계정 생성/로그인
1. https://vercel.com 접속
2. `Sign Up` 또는 `Log In`
3. **GitHub 계정으로 로그인** (권장)

### 4-2. 프로젝트 Import

1. Vercel Dashboard → `Add New...` → `Project`
2. `Import Git Repository` 섹션에서 GitHub 저장소 선택
3. 저장소가 안 보이면 `Adjust GitHub App Permissions` 클릭하여 권한 부여

### 4-3. 프로젝트 설정

**Framework Preset**: Vite 선택

**Build and Output Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Root Directory**: `.` (기본값)

### 4-4. 환경 변수 설정

`Environment Variables` 섹션에서 추가:

```
VITE_SUPABASE_URL=https://ozucmiwrfrvmsecmoivq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**중요**: 
- `.env.local` 파일의 값을 복사하세요
- 모든 환경(Production, Preview, Development)에 동일하게 설정

### 4-5. 배포 시작

`Deploy` 버튼 클릭!

---

## 5️⃣ 배포 후 설정

### 5-1. Supabase CORS 설정

Supabase Dashboard → Settings → API → CORS Allowed Origins에 추가:

```
https://your-project.vercel.app
https://*.vercel.app
```

### 5-2. 배포 URL 확인

배포 완료 후:
- Production URL: `https://your-project.vercel.app`
- 자동으로 HTTPS 적용됨

### 5-3. 도메인 설정 (선택사항)

Vercel Dashboard → Settings → Domains에서 커스텀 도메인 추가 가능

---

## 6️⃣ 이후 업데이트 방법

### 코드 수정 후 배포

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "feat: 영웅 초상화 시스템 추가"

# 푸시 (자동으로 Vercel에 배포됨!)
git push
```

**자동 배포**: GitHub에 푸시하면 Vercel이 자동으로 감지하고 배포합니다!

---

## 🔍 트러블슈팅

### 문제 1: Git 푸시 실패 (인증 오류)

**해결책**: Personal Access Token 사용
```bash
# 원격 저장소 URL 업데이트 (토큰 포함)
git remote set-url origin https://YOUR_TOKEN@github.com/your-username/repo.git
```

### 문제 2: Vercel 빌드 실패

**해결책**:
1. Vercel Dashboard → Deployments → 실패한 배포 클릭
2. Build Logs 확인
3. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```

### 문제 3: 환경 변수 오류

**해결책**:
1. Vercel Dashboard → Settings → Environment Variables 확인
2. `VITE_` 접두사 확인
3. 값에 따옴표 없이 입력했는지 확인
4. 재배포: Deployments → Redeploy

### 문제 4: 404 오류 (페이지 새로고침 시)

**해결책**: `vercel.json` 파일 확인 (이미 설정되어 있음)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📊 배포 상태 확인

### Vercel Dashboard에서 확인
- **Deployments**: 배포 히스토리
- **Analytics**: 방문자 통계
- **Logs**: 실시간 로그

### 로컬에서 확인
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포 상태 확인
vercel ls

# 로그 확인
vercel logs
```

---

## ✅ 배포 완료 체크리스트

- [ ] Git 저장소 초기화 완료
- [ ] GitHub에 코드 푸시 완료
- [ ] Vercel 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 첫 배포 성공
- [ ] Supabase CORS 설정 완료
- [ ] 배포된 사이트 접속 확인
- [ ] 주요 기능 테스트 완료

---

## 🎉 배포 성공!

배포가 완료되면:
- Production URL: `https://your-project.vercel.app`
- 자동 HTTPS 적용
- 자동 CDN 배포
- 무료 SSL 인증서

**이제 전 세계 어디서나 접속 가능합니다!** 🌍

---

## 📞 추가 도움말

- Vercel 문서: https://vercel.com/docs
- GitHub 문서: https://docs.github.com
- Supabase 문서: https://supabase.com/docs

**문제가 있으면 Vercel Dashboard의 로그를 먼저 확인하세요!**
