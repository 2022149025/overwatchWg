# Steering Files Index

**Last Updated**: 2025-11-01

이 폴더는 AI 에이전트를 위한 **가벼운 참조 가이드**를 포함합니다. 
상세 문서는 `.kiro/docs/`에 있으며, steering은 북마크 역할을 합니다.

---

## 📖 Quick Navigation

### AI Agent Behavior
- **[mcp-tools.md](ai-agent/mcp-tools.md)** - MCP 도구 사용 (Sequential Thinking, Context7, Supabase)
- **[compounding-learning.md](ai-agent/compounding-learning.md)** - 학습 축적 시스템
- **[auto-prompt-enhancer-trigger.md](ai-agent/auto-prompt-enhancer-trigger.md)** - 프롬프트 자동 개선

### Development Process
- **[step-by-step.md](development/step-by-step.md)** - 3단계 개발 프로세스
- **[atomic-development-principles.md](development/atomic-development-principles.md)** - 원자적 개발 원칙

### Project Information
- **[product.md](project/product.md)** - 제품 개요
- **[structure.md](project/structure.md)** - 프로젝트 구조
- **[tech.md](project/tech.md)** - 기술 스택

### Quality Standards
- **[clean-code.md](quality/clean-code.md)** - 클린 코드 가이드
- **[ears-requirements.md](quality/ears-requirements.md)** - EARS 요구사항 표준

---

## 📚 Detailed Documentation

상세 문서는 `.kiro/docs/`에 있습니다:

```
.kiro/docs/
├── mcp/                    # MCP 도구 상세 가이드
│   ├── sequential-thinking.md
│   ├── context7.md
│   ├── supabase.md
│   └── decision-tree.md
├── learning/               # 학습 시스템 상세
│   └── compounding-system.md
└── ...
```

---

## 🎯 How to Use

### For AI Agents
1. **Steering 파일**: 빠른 참조용 (50-100줄)
2. **Docs 파일**: 상세 가이드 (제한 없음)
3. **북마크 방식**: Steering → Docs 링크 따라가기

### For Developers
1. **프로젝트 시작**: `project/` 폴더 읽기
2. **개발 작업**: `development/` 프로세스 따르기
3. **상세 정보 필요**: `.kiro/docs/` 참조

---

## 📝 File Naming Convention

- 모든 파일명은 kebab-case 사용
- 약어는 잘 알려진 것만 사용 (MCP, EARS)
- 파일명만으로 내용 추측 가능하도록 명확하게 작성

---

## 📂 Folder Structure

```
.kiro/
├── steering/           # 가벼운 북마크 (50-100줄)
│   ├── README.md      # 이 파일
│   ├── ai-agent/      # AI 에이전트 동작
│   ├── development/   # 개발 프로세스
│   ├── project/       # 프로젝트 정보
│   └── quality/       # 품질 표준
│
└── docs/              # 상세 문서 (제한 없음)
    ├── mcp/           # MCP 도구 가이드
    ├── learning/      # 학습 시스템
    └── ...
```

---

**Version**: 2.0  
**Status**: Active  
**Architecture**: Lightweight Steering + Detailed Docs
