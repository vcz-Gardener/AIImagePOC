# 🎨 AI 이미지/웹툰 생성 POC

LLM 기반 AI 이미지 및 웹툰 생성 POC 프로젝트

## 📋 프로젝트 소개

이 프로젝트는 다양한 AI 이미지 생성 API를 활용하여 웹툰, 이미지, 애니메이션 스타일의 이미지를 생성하는 POC(Proof of Concept) 프로젝트입니다.

### 지원하는 AI 모델

- **🎭 LlamaGen**: 웹툰 스타일 이미지 생성
- **🖼️ Nano Banana**: Google Gemini 기반 이미지 생성
- **🎌 KusaPics**: 애니메이션 스타일 이미지 생성 (웹 인터페이스)

## 🏗️ 기술 스택

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (다크모드 지원)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- CORS
- dotenv

## 📁 프로젝트 구조

```
AIImagePOC/
├── frontend/              # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ImageGenerator.tsx
│   ├── lib/
│   │   └── api.ts
│   └── package.json
├── backend/               # Express Backend API
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── webtoon.ts
│   │   │   ├── image.ts
│   │   │   └── anime.ts
│   │   └── config/
│   │       └── env.ts
│   └── package.json
├── package.json           # 루트 워크스페이스
├── .env.example           # 환경변수 템플릿
└── README.md
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

이 명령어는 루트, frontend, backend의 모든 dependencies를 자동으로 설치합니다.

### 2. 환경변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 API 키를 입력하세요:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

`.env` 파일 내용:

```env
# LlamaGen API Key
LLAMAGEN_API_KEY=your_llamagen_api_key_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Port
PORT=3001
```

### 3. 개발 서버 실행

```bash
npm run dev
```

이 명령어는 Frontend와 Backend를 **동시에** 실행합니다:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🔑 API 키 발급 방법

### LlamaGen API
1. [LlamaGen Developers](https://developers.llamagen.ai) 방문
2. 회원가입 및 로그인
3. API 키 발급
4. `.env` 파일에 `LLAMAGEN_API_KEY` 추가

### Google Gemini API
1. [Google AI Studio](https://ai.google.dev/) 방문
2. Google 계정으로 로그인
3. API 키 생성
4. `.env` 파일에 `GEMINI_API_KEY` 추가

### KusaPics
- API 키 불필요 (웹 인터페이스 사용)
- https://kusa.pics 에서 직접 사용 가능

## 📡 API 엔드포인트

### Backend API

#### 1. 웹툰 생성 (LlamaGen)
```http
POST http://localhost:3001/api/webtoon
Content-Type: application/json

{
  "prompt": "귀여운 고양이 캐릭터"
}
```

#### 2. 이미지 생성 (Gemini)
```http
POST http://localhost:3001/api/image
Content-Type: application/json

{
  "prompt": "파란 하늘 배경의 풍경"
}
```

#### 3. 애니 정보 (KusaPics)
```http
POST http://localhost:3001/api/anime
Content-Type: application/json

{
  "prompt": "애니메이션 캐릭터"
}
```

## 💻 개발 명령어

### 전체 프로젝트
```bash
npm run dev              # Frontend + Backend 동시 실행
npm install              # 모든 dependencies 설치
```

### Frontend만 실행
```bash
npm run dev:frontend
# 또는
cd frontend && npm run dev
```

### Backend만 실행
```bash
npm run dev:backend
# 또는
cd backend && npm run dev
```

## 🎨 주요 기능

- ✅ 프롬프트 기반 이미지 생성
- ✅ 3가지 AI 모델 지원 (LlamaGen, Gemini, KusaPics)
- ✅ 다크모드 지원
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 실시간 에러 핸들링
- ✅ 로딩 상태 표시
- ✅ KusaPics iframe 통합

## 🔧 문제 해결

### API 키가 설정되지 않았다는 경고가 뜰 때
- `.env` 파일이 있는지 확인
- API 키가 올바르게 입력되었는지 확인
- 서버를 재시작 (`npm run dev`)

### 포트가 이미 사용 중일 때
```bash
# 3000번 포트를 사용하는 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 3001번 포트를 사용하는 프로세스 종료
lsof -ti:3001 | xargs kill -9
```

### CORS 오류가 발생할 때
- Backend의 CORS 설정이 올바른지 확인
- Frontend와 Backend가 모두 실행 중인지 확인

## 📝 참고사항

- API 키 없이도 UI는 정상 작동합니다 (에러 메시지 표시)
- 초기 실행 시 TypeScript 컴파일로 시간이 소요될 수 있습니다
- KusaPics는 별도 API가 없어 iframe으로 웹사이트를 임베드합니다

## 🚢 배포

### Frontend (GitHub Pages / Vercel)
```bash
cd frontend
npm run build
```

### Backend (Railway / Render)
Backend는 별도 호스팅 서비스에 배포 필요

## 📄 라이센스

MIT License

## 🤝 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!

---

Made with ❤️ using Next.js, Express, and AI
