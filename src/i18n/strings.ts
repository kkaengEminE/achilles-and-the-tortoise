export type Lang = 'ko' | 'en';

export const STRINGS = {
  // Top bar
  langKo: { ko: '한국어', en: 'KO' },
  langEn: { ko: '영어', en: 'EN' },

  // Intro
  introKicker: { ko: '11초의 역설', en: 'A PARADOX IN ELEVEN SECONDS' },
  introTitle: { ko: '아킬레우스와 거북이', en: 'ACHILLES & THE TORTOISE' },
  introCitation: { ko: '제논, 단편 7 · 기원전 5세기', en: "Zeno, fr. 7 · 5th c. BCE" },
  introDescription: {
    ko: '거북이에게 100m의 어드밴티지가 주어집니다. 결승선은 111.11m. 클릭, 탭, 광클 — 당신의 타격은 Σ 로 누적됩니다. 그러나 모든 격차는 절반으로 나뉠 수 있고, 그 절반은 다시 절반으로 나뉠 수 있습니다. 영원히.',
    en: 'The tortoise is given a head start of one hundred metres. The finish lies at 111.11 m. Click, tap, mash — your strikes accumulate as Σ. But every gap can be halved, and a half can be halved again, ad infinitum.',
  },
  introBegin: { ko: '추격 시작', en: 'Begin the Pursuit' },
  introInputHint: { ko: 'SPACE · 클릭 · 탭', en: 'Press SPACE · Click · Tap' },
  introWhat: { ko: '제논의 역설이란?', en: "What is Zeno's Paradox?" },

  // Character cards
  achillesName: { ko: 'Ἀχιλλεύς · 아킬레우스', en: 'Ἀχιλλεύς · Achilles' },
  achillesTagline: { ko: '발 빠른 신적 영웅. 10 m/s', en: 'Swift-footed, godlike. 10 m/s' },
  tortoiseName: { ko: 'Χελώνη · 레오파드 거북', en: 'Χελώνη · Leopard Tortoise' },
  tortoiseTagline: { ko: 'Stigmochelys pardalis. 1 m/s', en: 'Stigmochelys pardalis. 1 m/s' },

  // Race HUD
  hudSigma: { ko: 'Σ · 시그마', en: 'Σ · SIGMA' },
  hudPos: { ko: '아킬레우스 위치', en: 'ACHILLES POSITION' },
  hudGap: { ko: 'gap', en: 'gap' },
  hudTortoise: { ko: '◀ 거북이', en: '◀ Tortoise' },
  hudFinish: { ko: '결승선 111.11 m', en: 'finish 111.11 m' },
  hudHorizon: { ko: '◆ 사건의 지평선 ◆', en: '◆ Event Horizon ◆' },
  hudGo: { ko: '출발!', en: 'GO' },
  hudPause: { ko: '일시정지', en: 'Pause' },
  hudInputHint: { ko: 'SPACE · 클릭 · 탭', en: 'SPACE · CLICK · TAP' },

  // Replay HUD
  replayKicker: { ko: '⚖ 비디오 판독 · ANAKRISIS', en: '⚖ VIDEO JUDGEMENT · ANAKRISIS' },
  replayZooming: { ko: '결승선 확대 ·', en: 'Zooming the finish ·' },
  replayHolding: { ko: '⋯ 접촉의 순간을 포착 중 ⋯', en: '⋯ holding the moment of contact ⋯' },
  replayWinner: {
    ko: '거북이의 코가 먼저 닿았습니다',
    en: "THE TORTOISE'S NOSE TOUCHES FIRST",
  },
  replayMargin: { ko: '차이는', en: 'by a margin of' },
  replayVerdict: { ko: '판결 보기', en: 'See the Verdict' },

  // Score
  scoreVerdict: { ko: '판결 · ΨΗΦΟΣ', en: 'VERDICT · ΨΗΦΟΣ' },
  scoreSubtitle: { ko: '⚜ 거북이의 승리 ⚜', en: '⚜ Tortoise victorious ⚜' },
  scoreFell: { ko: '아킬레우스는 ', en: 'Achilles fell behind by ' },
  scoreFellTail: { ko: ' 차이로 뒤처졌습니다.', en: '.' },
  scoreFinalGap: { ko: '최종 차이', en: 'FINAL GAP' },
  scoreStrikes: { ko: '클릭', en: 'strikes' },
  scoreStrikesShort: { ko: '번의 공격 끝에', en: 'strikes' },
  scoreNewPB: { ko: '★ 신기록 ★', en: '★ NEW PERSONAL BEST ★' },
  scorePBLabel: { ko: '베스트', en: 'Personal best' },
  scoreTry: { ko: '다시 도전', en: 'Try Again' },
  scorePNG: { ko: '이미지 저장', en: 'Save PNG' },
  scoreLink: { ko: '링크 복사', en: 'Copy Link' },
  scoreCopied: { ko: '결과 링크가 복사되었습니다', en: 'Result link copied' },

  // Pause
  pauseTitle: { ko: '경기가 멈추었습니다.', en: 'The race is held in suspension.' },
  pauseLabel: { ko: '일시정지 · Ἀνάπαυσις', en: 'PAUSED · Ἀνάπαυσις' },
  pauseResume: { ko: '계속하기', en: 'Resume' },
  pauseQuit: { ko: '포기', en: 'Abandon' },

  // Rank — names describe the speed/closeness, flavour text gives the gap order-of-magnitude
  rankMortal: { ko: '필멸자', en: 'Mortal' },
  rankMortalFlavour: {
    ko: '센티미터 단위에서 멈췄습니다 — 당신의 차이는 거북이 등껍질 한 칸 너비입니다.',
    en: 'You stopped at the centimetre — about the width of one of the tortoise\'s scutes.',
  },
  rankApprentice: { ko: '구도자', en: 'Apprentice' },
  rankApprenticeFlavour: {
    ko: '밀리미터 단위까지 좁혔습니다 — 머리핀 두께만큼의 차이.',
    en: 'You narrowed it to the millimetre — about the thickness of a hairpin.',
  },
  rankPursuer: { ko: '추격자', en: 'Pursuer' },
  rankPursuerFlavour: {
    ko: '머리카락 굵기에 다가왔습니다 — 0.0001 m 영역.',
    en: 'You closed to the width of a single hair — about 0.0001 m.',
  },
  rankArtisan: { ko: '장인', en: 'Artisan' },
  rankArtisanFlavour: {
    ko: '마이크로미터 영역 — 적혈구 한 개 크기에 가깝습니다.',
    en: 'Micrometre territory — close to the diameter of a red blood cell.',
  },
  rankWindwalker: { ko: '바람을 베는 자', en: 'Windwalker' },
  rankWindwalkerFlavour: {
    ko: '나노미터 영역 — 가시광선 파장의 100분의 1.',
    en: 'Nanometre territory — about a hundredth of a wavelength of visible light.',
  },
  rankDaimon: { ko: '다이몬', en: 'Daimon' },
  rankDaimonFlavour: {
    ko: '피코미터 영역 — 원자 하나의 지름보다도 작습니다.',
    en: 'Picometre territory — smaller than a single atom\'s diameter.',
  },
  rankApeiron: { ko: '아페이론', en: 'Apeiron' },
  rankApeironFlavour: {
    ko: '펨토미터 영역 — 원자핵의 크기와 견줄 만합니다.',
    en: 'Femtometre territory — comparable to the diameter of an atomic nucleus.',
  },
  rankInfinitesimal: { ko: '무한소의 사냥꾼', en: 'Hunter of the Infinitesimal' },
  rankInfinitesimalFlavour: {
    ko: '이제 측정의 의미가 흐려집니다 — 0이 아닌, 가장 작은 무엇.',
    en: 'Measurement loses its meaning — the smallest something that isn\'t zero.',
  },

  // Zeno modal
  zenoTitle: { ko: '제논의 역설', en: "Zeno's Paradox" },
  zenoBody: {
    ko:
      '기원전 5세기 엘레아의 철학자 제논은 운동 자체가 환상이라고 주장했습니다. 그는 “아킬레우스와 거북이”라는 사고 실험을 제시했습니다.\n\n' +
      '거북이에게 어드밴티지를 주고 발이 빠른 아킬레우스가 그를 추격합니다. 아킬레우스가 거북이의 출발 지점에 도달하면, 거북이는 그동안 조금 더 앞으로 나아가 있습니다. 아킬레우스가 그 새로운 지점에 도달하면, 거북이는 또 조금 더 앞에 있습니다. 이 과정은 끝없이 반복되므로, 제논은 아킬레우스가 결코 거북이를 따라잡을 수 없다고 결론지었습니다.\n\n' +
      '왜 극한인가? 각 단계에서 남은 거리는 매번 절반(또는 그 이하)으로 줄어듭니다: 1, 1/2, 1/4, 1/8, … 단계의 수는 무한하지만, 거리의 합은 유한합니다. 이것이 “수렴하는 무한급수”입니다. 현대 미적분학은 무한히 많은 단계를 유한한 시간에 완료할 수 있음을 보였지만, 제논의 직관 — “끝낼 수 없는 무한” — 의 매혹은 여전히 살아 있습니다.\n\n' +
      '이 게임은 그 매혹을 시각화합니다. 결승선은 111.11m, 그러나 당신이 아무리 빨리 클릭해도 격차는 절반으로, 다시 절반으로 줄어들 뿐 — 결코 0이 되지는 않습니다.',
    en:
      'In the 5th century BCE, the Eleatic philosopher Zeno argued that motion itself is an illusion. To prove it he offered the thought-experiment "Achilles and the Tortoise."\n\n' +
      'The tortoise is given a head start. The swift-footed Achilles sets off to overtake him. By the time Achilles reaches the tortoise\'s starting point, the tortoise has moved a little further along. By the time Achilles reaches that new point, the tortoise is again a little further. Because this halving repeats forever, Zeno concluded that Achilles can never catch up.\n\n' +
      'Why is this a problem about limits? Each stage halves the remaining distance: 1, 1/2, 1/4, 1/8, … The number of stages is infinite, but their sum is finite. This is a convergent infinite series. Modern calculus shows that an infinity of steps can be completed in finite time — yet the intuitive sting of Zeno\'s "endless infinity" still bites.\n\n' +
      'This game makes the sting visible. The finish lies at 111.11 m. But however fast you click, the gap only halves and halves again — and never quite reaches zero.',
  },
  zenoAchillesTitle: { ko: '아킬레우스란?', en: 'Who is Achilles?' },
  zenoAchillesBody: {
    ko:
      '아킬레우스는 호메로스의 「일리아스」에 등장하는 그리스 영웅으로, 트로이 전쟁의 가장 위대한 전사입니다. 바다의 여신 테티스의 아들이며, 어머니가 그를 스틱스 강에 담가 거의 불사신으로 만들었습니다 — 다만 강물에 닿지 않은 발뒤꿈치만 약점으로 남았습니다 (“아킬레스건”).\n\n' +
      '그는 “발 빠른” (πόδας ὠκύς, podas ōkys) 이라는 별칭으로 불릴 만큼 빠른 주자였습니다. 신화에서는 그의 속도를 정량화하지 않지만, 이 게임에서는 10 m/s로 설정합니다 — 우사인 볼트의 평균 100m 속도(≈10.4 m/s)에 가까운, 인간 한계의 상한.',
    en:
      'Achilles is the Greek hero of Homer\'s Iliad, the greatest warrior of the Trojan War. Son of the sea-goddess Thetis, he was dipped in the river Styx as an infant and made nearly invulnerable — except for the heel his mother held him by (the eponymous Achilles tendon).\n\n' +
      'He was called πόδας ὠκύς (podas ōkys), "swift-footed." The myths do not give a number, but in this game we set him at 10 m/s — close to Usain Bolt\'s average 100 m pace (≈10.4 m/s), at the upper bound of what a human body can do.',
  },
  zenoTortoiseTitle: { ko: '레오파드 거북이란?', en: 'What is the Leopard Tortoise?' },
  zenoTortoiseBody: {
    ko:
      '레오파드 거북 (Stigmochelys pardalis) 은 사하라 사막 이남 아프리카의 사바나에 서식하는 큰 육지거북입니다. 이름은 등껍질의 검은-노란 표범 무늬에서 왔습니다. 평균 등껍질 길이는 40~70cm, 수명은 약 80~100년에 이릅니다.\n\n' +
      '평소 보행 속도는 시속 0.3 km 수준 (≈ 0.08 m/s) 으로 매우 느리지만, 동기 부여가 되면 단거리에서 1 m/s 가까이 짧게 달릴 수 있습니다 — 이 게임의 거북이 속도가 그렇습니다.',
    en:
      'The leopard tortoise (Stigmochelys pardalis) is a large land tortoise of sub-Saharan African savannah. Its name comes from the black-and-yellow leopard-print pattern on its shell. Adults are 40–70 cm in shell length and live ~80–100 years.\n\n' +
      'Their typical walking speed is around 0.3 km/h (≈0.08 m/s) — very slow. But with motivation a leopard tortoise can briefly burst toward 1 m/s, which is what this game uses.',
  },
  zenoBertieTitle: { ko: 'Bertie — 세계에서 가장 빠른 거북이', en: 'Bertie — the fastest tortoise in the world' },
  zenoBertieBody: {
    ko:
      'Bertie 는 영국 더럼의 “Adventure Valley” 어드벤처 파크에 살았던 수컷 레오파드 거북입니다. 2014년 7월 9일, 그는 5.48 m 거리를 19.59 초만에 주파하여 — 약 0.28 m/s — 기네스 세계 기록 “가장 빠른 거북이 (fastest tortoise)” 를 차지했습니다.\n\n' +
      'Bertie 의 사육사들은 “그는 다이어트와 훈련을 하지 않았다 — 그저 호기심이 많을 뿐이다” 라고 말했습니다. 이 기록은 모든 종류의 거북이를 통틀어 공식 인증된 가장 빠른 속도입니다.\n\n' +
      '이 게임의 거북이는 Bertie 보다 ~3.5배 빠른 1 m/s 로 달립니다 — 신화적 보정입니다.',
    en:
      'Bertie was a male leopard tortoise who lived at Adventure Valley, an adventure park in Durham, England. On 9 July 2014, he covered 5.48 m in 19.59 seconds — about 0.28 m/s — earning the Guinness World Record for "fastest tortoise."\n\n' +
      'His handlers said: "He hasn\'t been on a diet or in training — he\'s just naturally curious." It remains the fastest officially-certified speed across any tortoise species.\n\n' +
      'The tortoise in this game runs at 1 m/s — about 3.5× Bertie\'s record. A mythological correction.',
  },
  zenoBack: { ko: '뒤로', en: 'Back' },
  zenoClose: { ko: '닫기', en: 'Close' },
};

export type StringKey = keyof typeof STRINGS;
