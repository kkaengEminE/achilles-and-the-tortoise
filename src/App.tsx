import { useEffect, useRef, useState } from 'react';
import Decimal from 'decimal.js';
import { PixiApp } from './game/PixiApp';
import { useGameStore } from './state/gameStore';
import { IntroScreen } from './ui/screens/IntroScreen';
import { RaceHUD } from './ui/screens/RaceHUD';
import { ReplayHUD } from './ui/screens/ReplayHUD';
import { ScoreScreen } from './ui/screens/ScoreScreen';
import { PauseModal } from './ui/components/PauseModal';
import { MuteToggle } from './ui/components/MuteToggle';
import { LanguageToggle } from './ui/components/LanguageToggle';
import { D, FINISH, HALF, K_HALVING, SLOW_ZONE_LEN } from './game/util/precision';

import './ui/styles/tokens.css';
import './ui/styles/art-nouveau.css';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixiRef = useRef<PixiApp | null>(null);

  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const paused = useGameStore((s) => s.paused);
  const setPaused = useGameStore((s) => s.setPaused);
  const resetForReplay = useGameStore((s) => s.resetForReplay);
  const hydrateFromUrl = useGameStore((s) => s.hydrateFromUrl);

  const [countdown, setCountdown] = useState<number | null>(null);

  // ?sigma=N&gap=... demo mode: jump straight to the SCORE screen with the
  // shared result. URL is consumed once and cleared so refresh returns to intro.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sigmaRaw = params.get('sigma');
    if (!sigmaRaw) return;
    const N = parseInt(sigmaRaw, 10);
    if (!Number.isFinite(N) || N < 0 || N > 10000) return;
    let gap: Decimal;
    const gapRaw = params.get('gap');
    if (gapRaw) {
      try {
        gap = D(gapRaw);
        if (!gap.isFinite() || gap.lte(0)) throw new Error('bad gap');
      } catch {
        gap = SLOW_ZONE_LEN.times(HALF.pow(D(N).div(K_HALVING)));
      }
    } else {
      gap = SLOW_ZONE_LEN.times(HALF.pow(D(N).div(K_HALVING)));
    }
    hydrateFromUrl({
      N,
      achillesPos: FINISH.minus(gap),
      tortoisePos: FINISH,
      gap,
    });
    // clear params so subsequent navigation behaves normally
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }, [hydrateFromUrl]);

  // boot Pixi once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const app = new PixiApp();
    pixiRef.current = app;
    void app.init(canvas).catch((err) => {
      console.error('PixiApp init failed', err);
    });
    return () => {
      app.destroy();
      pixiRef.current = null;
    };
  }, []);

  // react to screen changes -> show appropriate Pixi scene
  useEffect(() => {
    const app = pixiRef.current;
    if (!app) return;
    if (screen === 'COUNTDOWN' || screen === 'RACE') {
      app.showRace();
    } else if (screen === 'REPLAY') {
      app.showReplay();
    } else if (screen === 'SCORE' || screen === 'INTRO') {
      app.detachCurrent();
    }
  }, [screen]);

  // global input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (screen === 'INTRO') beginCountdown();
        else if (screen === 'SCORE') retry();
        else if (screen === 'RACE') pixiRef.current?.registerClick();
      } else if (e.code === 'Escape') {
        if (screen === 'RACE') setPaused(!paused);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, paused]);

  // canvas pointer (mouse + touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      if (screen === 'RACE') {
        pixiRef.current?.registerClick();
      } else if (screen === 'INTRO') {
        // do nothing; Intro has its own button
      }
    };
    canvas.addEventListener('pointerdown', onPointer);
    return () => canvas.removeEventListener('pointerdown', onPointer);
  }, [screen]);

  function beginCountdown() {
    resetForReplay();
    setScreen('COUNTDOWN');
    setCountdown(3);
    let n = 3;
    const tick = () => {
      n -= 1;
      if (n <= 0) {
        setCountdown(0);
        setTimeout(() => {
          setCountdown(null);
          setScreen('RACE');
          pixiRef.current?.startRace();
        }, 600);
      } else {
        setCountdown(n);
        setTimeout(tick, 800);
      }
    };
    setTimeout(tick, 800);
  }

  function retry() {
    beginCountdown();
  }

  function quitToIntro() {
    setPaused(false);
    resetForReplay();
    setScreen('INTRO');
  }

  function continueFromReplay() {
    setScreen('SCORE');
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(245,217,122,0.05) 0%, transparent 70%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><g fill='none' stroke='%23d4af37' stroke-width='0.4' opacity='0.18'><path d='M0 100 Q 50 60 100 100 T 200 100'/><path d='M0 80 Q 50 40 100 80 T 200 80'/><path d='M0 120 Q 50 80 100 120 T 200 120'/></g></svg>\")",
          backgroundRepeat: 'repeat',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          touchAction: 'manipulation',
        }}
      />

      {screen === 'INTRO' && <IntroScreen onStart={beginCountdown} />}
      {(screen === 'COUNTDOWN' || screen === 'RACE') && (
        <RaceHUD countdown={countdown} onPause={() => setPaused(true)} />
      )}
      {screen === 'REPLAY' && <ReplayHUD onContinue={continueFromReplay} />}
      {screen === 'SCORE' && <ScoreScreen onRetry={retry} />}

      <PauseModal open={paused} onResume={() => setPaused(false)} onQuit={quitToIntro} />
      <MuteToggle />
      <LanguageToggle />
    </div>
  );
}

export default App;
