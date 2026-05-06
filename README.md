# Achilles & the Tortoise

> 제논의 역설을 11초의 광클로 체감하는 웹 게임.
>
> A click-mash web game that lets you feel Zeno's paradox in eleven seconds.

거북이에게 100m의 어드밴티지가 주어지고 결승선은 111.11m. 아킬레우스는 10m/s로 달리지만, 결승선 직전에서 모든 클릭은 남은 격차를 절반으로 나눌 뿐 — 결코 0이 되지 않는다. 마지막엔 비디오 판독으로 거북이 코끝과 아킬레우스 발끝의 간발의 차이를 확대해 보여준다.

[![tests](https://img.shields.io/badge/tests-10%2F10-success)]()
[![typescript](https://img.shields.io/badge/typescript-strict-blue)]()
[![pixi](https://img.shields.io/badge/pixi.js-v8-ff007f)]()

---

## 빠른 실행 / Quick Start

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # production build → dist/
npm run preview      # preview production build
npm run test         # vitest single run
npm run test:watch   # vitest watch mode
```

요구 환경: Node 20+, WebGL 지원 브라우저.

---

## 게임 메카닉 / Game Mechanics

| | |
|---|---|
| 결승선 | **111.11 m** |
| 거북이 (Stigmochelys pardalis) | **1 m/s** · 100m 어드밴티지 → 정확히 11.11초에 결승 |
| 아킬레우스 | **10 m/s** 선형 주행, 111m 진입 시 사건의 지평선 페이즈로 전환 |
| 입력 | 스페이스바 · 마우스 클릭 · 터치 탭 |
| 게임 길이 | ~11초 |

### 절대 패배 수식

```
gap(N) = 0.11 × (1/2)^(N / K)        // K = 5
position_achilles = 111.11 − gap(N)
```

`N`이 커질수록 `gap`은 0에 무한히 수렴하지만 절대 0이 되지 않는다. 거북이는 항상 이긴다.

플레이테스트 보정 (10클릭 → 약 1/4 차이, 30클릭 → 약 1/64 차이) 에 맞춰 `K=5` (5클릭마다 격차 절반).

### 랭크 (gap 자릿수 기준)

| Strikes | 한국어 | English | 비유 |
|---|---|---|---|
| 0–19 | 필멸자 | Mortal | 거북 등껍질 너비 (cm) |
| 20–39 | 구도자 | Apprentice | 머리핀 두께 (mm) |
| 40–69 | 추격자 | Pursuer | 머리카락 굵기 (~100 µm) |
| 70–99 | 장인 | Artisan | 적혈구 (µm) |
| 100–149 | 바람을 베는 자 | Windwalker | 빛의 파장 (nm) |
| 150–199 | 다이몬 | Daimon | 원자 (pm) |
| 200–279 | 아페이론 | Apeiron | 원자핵 (fm) |
| 280+ | 무한소의 사냥꾼 | Hunter of the Infinitesimal | 측정의 의미를 잃음 |

---

## 비주얼 / Visual

- **알폰스 무하 풍 아르누보 액자** + **그리스 이오니아 양식**: 식물 덩굴 모서리 장식, 대리석 패널, 24K 골드 그라디언트
- **그리스 조각상 아킬레우스**: 코린토스 투구 + 깃털 장식 + 청동 갑옷 + 창과 방패. 3프레임 런 사이클(idle / leftForward / rightForward)로 발이 번갈아 앞섬
- **레오파드 거북** (Stigmochelys pardalis): 표범 무늬 등껍질 + 6개 옴팔리 점박이 + 코끝(판정 기준점) 마커
- **콜로세움 배경**: 2단 아치 + 작은 관중 실루엣 + 황금 리본 + 올리브 화환
- **비디오 판독**: 결승선이 화면 중앙 고정, 거북 코는 결승선에 닿고, 아킬레우스 발끝은 gap만큼 왼쪽. `← gap →` 화살표로 차이를 시각화. 줌은 매 프레임 PIXI.Graphics 벡터 재드로우로 구현 (스프라이트 확대 X → 픽셀 깨짐 없음)
- **사운드**: Tone.js 펜타토닉 PolySynth, 3클릭마다 한 음씩 상승, 3옥타브 wrap. 페이즈 전환·결승 시 서스 코드. 첫 클릭에 lazy-init (Safari/iOS AudioContext 잠금 회피)
- **햅틱**: `navigator.vibrate` — 사건의 지평선 진입 / 게임 종료 시

---

## 기술 스택 / Tech Stack

| | |
|---|---|
| 빌드 | **Vite 8** + **TypeScript** (strict) |
| UI | **React 19** (HTML/CSS 오버레이로 액자·HUD·모달 처리) |
| 게임 캔버스 | **PixiJS v8** (WebGL, `app.screen` 좌표) |
| 정밀 수학 | **decimal.js** (precision 50) — Sigma 300+까지 NaN 없음 |
| 상태 | **Zustand** — Pixi가 쓰고 React가 구독 |
| 사운드 | **Tone.js** PolySynth (triangle, lazy-init) |
| 결과 PNG | **html2canvas** |
| i18n | 자체 (KO/EN 사전 + `useT()` 훅, localStorage 영속화) |
| 테스트 | **Vitest** + jsdom |

---

## 디렉토리 구조 / Project Structure

```
src/
├── main.tsx
├── App.tsx                       # 씬 라우팅 + 전역 입력
├── game/
│   ├── PixiApp.ts                # PixiJS 부트스트랩 + 씬 전환 + 일시정지 시간 차감
│   ├── PhysicsState.ts           # decimal.js 기반 단일 진실 + 두-페이즈 모델
│   ├── scenes/
│   │   ├── RaceScene.ts          # LINEAR / EVENT_HORIZON 트랙
│   │   └── ReplayScene.ts        # 벡터 줌인 컨트롤러
│   ├── entities/
│   │   ├── CharacterArt.ts       # Achilles 3-pose + Tortoise (PIXI.Graphics)
│   │   └── ColosseumArt.ts       # 2단 아치 + 관중
│   └── util/
│       ├── precision.ts          # decimal.js 설정 + 상수
│       └── decimalToScreen.ts    # 단일 Decimal→float 변환점
├── ui/
│   ├── screens/
│   │   ├── IntroScreen.tsx       # 캐릭터 카드 + Zeno 모달 진입
│   │   ├── RaceHUD.tsx
│   │   ├── ReplayHUD.tsx
│   │   ├── ScoreScreen.tsx       # gap 헤드라인 / 랭크 / strikes
│   │   └── ZenoModal.tsx         # 제논의 역설 + Achilles / Tortoise / Bertie
│   ├── components/
│   │   ├── MuchaFrame.tsx        # 인라인 SVG 무하 모서리
│   │   ├── IonicButton.tsx       # 대리석 + 골드 버튼
│   │   ├── PauseModal.tsx
│   │   ├── CharacterPortrait.tsx # 인트로용 SVG 흉상
│   │   ├── LanguageToggle.tsx    # KO / EN
│   │   └── MuteToggle.tsx
│   └── styles/
│       ├── tokens.css            # 마블 / 골드 / 아이비 색상 변수
│       └── art-nouveau.css       # 액자, 버튼, 디바이더
├── state/
│   └── gameStore.ts              # Zustand
├── audio/
│   └── zenoSound.ts              # Tone.js
├── i18n/
│   ├── strings.ts                # KO/EN 사전
│   └── useT.ts                   # 훅 + langStore
└── game/PhysicsState.test.ts     # Vitest 10/10
```

---

## 검증 / Verification (Definition of Done)

- [x] Vitest 10/10 — Sigma 300까지 NaN 없음, 거북 11.11±50ms 결승, 5클릭마다 gap 절반
- [x] TypeScript strict 0 errors
- [x] Production build 성공
- [x] Playwright headless 풀 플로우(인트로 → 카운트다운 → 레이스 → 판독 → 결과 → 재도전) 무에러
- [x] 데스크톱 + 모바일(터치) 둘 다 작동
- [x] KO/EN 모든 화면 적용
- [x] localStorage PB 저장 + html2canvas 결과 PNG 다운로드
- [x] `?sigma=N&gap=...` URL 데모 모드 (친구 결과 공유)

---

## 알려진 한계 / Known Limitations

- **µ 글리프**: 점수 화면 gap 텍스트는 `Cormorant Garamond`로 렌더 (Cinzel은 µ 미지원). 다른 곳에 µ를 추가할 땐 폰트 폴백 주의.
- **모바일 광클**: 터치 이벤트는 일반적으로 ~60Hz로 제한 → 모바일에선 동등한 strikes 수에 도달하기 어려움 (의도된 디자인).
- **번들 크기**: PixiJS + Tone.js + html2canvas 합쳐 ~310 kB gzip. 코드 스플리팅으로 추가 최적화 가능.

---

## 라이선스 / License

이 저장소의 코드는 개인 프로젝트입니다. 무하 풍 SVG 장식과 캐릭터 아트는 인라인 자체 작성 (외부 에셋 미사용).

---

> "그러나 제논은 여전히 웃고 있다." — *Yet Zeno still laughs.*
