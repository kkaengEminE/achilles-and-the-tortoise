import { Application, Container } from 'pixi.js';
import { PhysicsState } from './PhysicsState';
import { RaceScene } from './scenes/RaceScene';
import { ReplayScene } from './scenes/ReplayScene';
import { useGameStore } from '../state/gameStore';
import { RACE_DURATION_MS } from './util/precision';
import {
  playClick,
  playHorizonEnter,
  playReplayChime,
  resetSession as resetSound,
} from '../audio/zenoSound';

function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore
  }
}

export type SceneKind = 'RACE' | 'REPLAY';

export class PixiApp {
  app: Application;
  root: Container;
  physics: PhysicsState;
  raceScene: RaceScene | null = null;
  replayScene: ReplayScene | null = null;
  current: SceneKind | null = null;
  raceStarted = false;
  raceStartMs = 0;
  rafBound: () => void;
  initialized = false;
  destroyed = false;

  // Pause-aware time bookkeeping
  pauseStartedAt = 0;
  pauseAccumMs = 0;
  wasPausedLastTick = false;

  // HUD throttle
  lastHudPushMs = 0;

  constructor() {
    this.app = new Application();
    this.root = new Container();
    this.physics = new PhysicsState();
    this.rafBound = this.tick.bind(this);
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      resizeTo: canvas.parentElement ?? window,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(2, window.devicePixelRatio || 1),
    });
    if (this.destroyed) {
      // Cleanup ran while we were initializing — tear down what we just built.
      try {
        this.app.destroy(true, { children: true });
      } catch {
        // ignore
      }
      return;
    }
    this.app.stage.addChild(this.root);
    this.app.ticker.add(this.rafBound);
    this.initialized = true;
  }

  destroy(): void {
    this.destroyed = true;
    if (!this.initialized) {
      // init() not finished yet; the init() promise will see destroyed=true
      // and tear down on its own.
      return;
    }
    try {
      this.app.ticker.remove(this.rafBound);
    } catch {
      // ignore
    }
    this.raceScene?.destroy();
    this.replayScene?.destroy();
    try {
      this.app.destroy(true, { children: true });
    } catch {
      // ignore
    }
  }

  showRace(): void {
    if (this.current === 'RACE') return;
    this.detachCurrent();
    this.raceScene = new RaceScene(this.app, this.physics);
    this.root.addChild(this.raceScene.container);
    this.current = 'RACE';
  }

  showReplay(): void {
    if (this.current === 'REPLAY') return;
    this.detachCurrent();
    this.replayScene = new ReplayScene(this.app, this.physics);
    this.root.addChild(this.replayScene.container);
    this.replayScene.start();
    this.current = 'REPLAY';
  }

  detachCurrent(): void {
    if (this.raceScene) {
      this.root.removeChild(this.raceScene.container);
      this.raceScene.destroy();
      this.raceScene = null;
    }
    if (this.replayScene) {
      this.root.removeChild(this.replayScene.container);
      this.replayScene.destroy();
      this.replayScene = null;
    }
    this.current = null;
  }

  startRace(): void {
    const now = performance.now();
    this.physics.start(now);
    this.raceStarted = true;
    this.raceStartMs = now;
    this.pauseAccumMs = 0;
    this.pauseStartedAt = 0;
    this.wasPausedLastTick = false;
    this.lastPhase = 'LINEAR';
    resetSound();
  }

  private lastPhase: 'LINEAR' | 'EVENT_HORIZON' = 'LINEAR';

  /** Convert real wall-clock time to physics time (subtracts paused intervals). */
  private physicsNow(now: number): number {
    return now - this.pauseAccumMs;
  }

  registerClick(): void {
    if (!this.raceStarted) return;
    if (useGameStore.getState().paused) return;
    const pn = this.physicsNow(performance.now());
    if (this.physics.isFinished(pn)) return;
    this.physics.onClick(pn);
    playClick(this.physics.N);
    if (this.physics.phase === 'EVENT_HORIZON' && this.lastPhase !== 'EVENT_HORIZON') {
      this.lastPhase = 'EVENT_HORIZON';
      playHorizonEnter();
      vibrate([20, 40, 20]);
    }
  }

  private tick(): void {
    const now = performance.now();
    const paused = useGameStore.getState().paused;

    // Track pause edges to accumulate paused time
    if (paused && !this.wasPausedLastTick) {
      this.pauseStartedAt = now;
    } else if (!paused && this.wasPausedLastTick) {
      this.pauseAccumMs += now - this.pauseStartedAt;
      this.pauseStartedAt = 0;
    }
    this.wasPausedLastTick = paused;

    const pn = this.physicsNow(now);

    if (this.raceStarted && !paused) {
      this.physics.tick(pn);
      if (
        this.physics.phase === 'EVENT_HORIZON' &&
        this.lastPhase !== 'EVENT_HORIZON'
      ) {
        this.lastPhase = 'EVENT_HORIZON';
        playHorizonEnter();
        vibrate([20, 40, 20]);
      }
      if (this.physics.isFinished(pn)) {
        this.handleFinish();
      }
    }
    if (this.raceScene) this.raceScene.update(pn);
    if (this.replayScene) this.replayScene.update(now);
    this.pushLiveThrottled(now, pn);
  }

  private handleFinish(): void {
    if (!this.raceStarted) return;
    this.raceStarted = false;
    const snap = this.physics.snapshot(this.raceStartMs + RACE_DURATION_MS);
    useGameStore.getState().finishRace({
      N: snap.N,
      achillesPos: snap.achillesPos,
      tortoisePos: snap.tortoisePos,
      gap: snap.gap,
    });
    playReplayChime();
    vibrate(80);
  }

  private pushLiveThrottled(now: number, pn: number): void {
    if (now - this.lastHudPushMs < 80) return;
    this.lastHudPushMs = now;
    const ach = this.physics.achillesPos(pn);
    const tor = this.physics.tortoisePos(pn);
    const gap = this.physics.gapDecimal();
    useGameStore.getState().pushLive({
      N: this.physics.N,
      achillesPos: ach.toNumber(),
      tortoisePos: tor.toNumber(),
      gapStr: gap.toFixed(Math.min(20, Math.max(3, Math.floor(this.physics.N / 5) + 3))),
      phase: this.physics.phase,
    });
  }
}
