<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fSMIZbA18llfjBeZWoaxXt1sayZX6pnT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. **폰트 파일 추가**: `koverwatch.ttf` 폰트 파일을 `styles/fonts/` 디렉토리에 추가해주세요
   - 다운로드: https://www.dafont.com/koverwatch.font
   - 자세한 설치 방법은 `styles/fonts/README.md` 참조
4. Run the app:
   `npm run dev`

## 오버워치 테마 스타일

이 프로젝트는 오버워치 게임의 시각적 스타일을 적용합니다.

### 폰트 라이선스

**koverwatch 폰트**
- 위치: `styles/fonts/koverwatch.ttf`
- 라이선스: 개인 및 상업적 용도 무료 사용 가능
- 출처: https://www.dafont.com/koverwatch.font
- **중요**: 폰트 파일은 저작권이 있는 자료이므로, 사용 전 라이선스를 확인하시기 바랍니다

### 스타일 구조

```
styles/
├── fonts/              # 폰트 파일
│   ├── koverwatch.ttf  # 오버워치 공식 폰트
│   └── README.md       # 폰트 설치 가이드
├── components/         # 컴포넌트별 스타일
└── overwatch-theme.css # 전역 테마 CSS 변수
```
