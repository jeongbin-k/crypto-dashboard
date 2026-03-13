# CoinScope

실시간 암호화폐 시세 및 정보를 한눈에 확인하는 대시보드

## ✨ 기능

- 📋 실시간 암호화폐 목록 조회 (시가총액 순)
- 🔍 코인 이름 / 심볼 검색
- 📈 코인 상세 페이지 (현재가, 시가총액, 거래량 등)
- 📊 기간별 가격 차트 (1D / 7D / 1M / 3M / 1Y)
- ❤️ 즐겨찾기 저장 (localStorage)

## 🛠 기술 스택

| 구분          | 기술                                     |
| ------------- | ---------------------------------------- |
| Framework     | React (Vite), TypeScript                 |
| Styling       | Tailwind CSS v3                          |
| Data Fetching | Axios (Instance 기반 API 모듈화)         |
| API           | CoinGecko API (Demo)                     |
| Libraries     | React Router DOM, Recharts, Lucide React |
| Deploy        | Vercel                                   |

## 🚀 시작하기

```bash
# 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 CoinGecko API 키 입력

# 개발 서버 실행
npm run dev
```

## 📁 폴더 구조

```
src/
├── api/          # API 호출 함수 (Axios 인스턴스)
├── components/   # 재사용 컴포넌트
├── hooks/        # 커스텀 훅 (useFavorites)
├── pages/        # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── CoinDetail.tsx
│   └── Favorites.tsx
└── types/        # TypeScript 타입 정의
```

## 🔑 환경변수

```
VITE_COINGECKO_API_KEY=your_api_key_here
```

CoinGecko API 키는 [CoinGecko Developers](https://www.coingecko.com/en/developers/dashboard) 에서 무료로 발급받을 수 있습니다.
