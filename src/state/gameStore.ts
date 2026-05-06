import Decimal from 'decimal.js';
import { create } from 'zustand';
import { D, FINISH } from '../game/util/precision';
import type { Phase } from '../game/PhysicsState';

export type Screen = 'INTRO' | 'COUNTDOWN' | 'RACE' | 'REPLAY' | 'SCORE';

const PB_KEY = 'zeno.pb.v1';

interface PB {
  N: number;
  gap: string;
  ts: number;
}

function loadPB(): PB | null {
  try {
    const raw = localStorage.getItem(PB_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PB;
  } catch {
    return null;
  }
}

function savePB(pb: PB): void {
  try {
    localStorage.setItem(PB_KEY, JSON.stringify(pb));
  } catch {
    // ignore quota / private mode
  }
}

interface RaceLive {
  N: number;
  achillesPos: number; // float for HUD reflow throttle
  tortoisePos: number;
  gapStr: string;
  phase: Phase;
}

interface RaceFinal {
  N: number;
  achillesPos: Decimal;
  tortoisePos: Decimal;
  gap: Decimal;
}

interface GameStore {
  screen: Screen;
  paused: boolean;
  countdownValue: number;
  live: RaceLive;
  final: RaceFinal | null;
  pb: PB | null;
  isPB: boolean;

  setScreen: (s: Screen) => void;
  setPaused: (p: boolean) => void;
  setCountdown: (v: number) => void;
  pushLive: (live: Partial<RaceLive>) => void;
  finishRace: (final: RaceFinal) => void;
  hydrateFromUrl: (final: RaceFinal) => void;
  resetForReplay: () => void;
}

const INITIAL_LIVE: RaceLive = {
  N: 0,
  achillesPos: 0,
  tortoisePos: 100,
  gapStr: '0.110000',
  phase: 'IDLE',
};

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'INTRO',
  paused: false,
  countdownValue: 3,
  live: { ...INITIAL_LIVE },
  final: null,
  pb: loadPB(),
  isPB: false,

  setScreen: (s) => set({ screen: s }),
  setPaused: (p) => set({ paused: p }),
  setCountdown: (v) => set({ countdownValue: v }),

  pushLive: (live) =>
    set((state) => ({
      live: { ...state.live, ...live },
    })),

  finishRace: (final) => {
    const prev = get().pb;
    const isPB = !prev || final.N > prev.N;
    if (isPB) {
      const next: PB = { N: final.N, gap: final.gap.toString(), ts: Date.now() };
      savePB(next);
      set({ pb: next, isPB: true });
    } else {
      set({ isPB: false });
    }
    set({ final, screen: 'REPLAY' });
  },

  /** Restore a finished race directly to the SCORE screen (used by ?sigma=N URL). */
  hydrateFromUrl: (final: RaceFinal) => {
    set({ final, isPB: false, screen: 'SCORE' });
  },

  resetForReplay: () => {
    set({
      live: { ...INITIAL_LIVE },
      final: null,
      isPB: false,
      paused: false,
      countdownValue: 3,
    });
  },
}));

export function gapHumanize(gap: Decimal): string {
  if (gap.isZero()) return '0 m';
  if (gap.gte(1)) return `${gap.toFixed(3)} m`;
  if (gap.gte('0.001')) return `${gap.times(1000).toFixed(3)} mm`;
  if (gap.gte('1e-6')) return `${gap.times(1e6).toFixed(3)} µm`;
  if (gap.gte('1e-9')) return `${gap.times(1e9).toFixed(3)} nm`;
  if (gap.gte('1e-12')) return `${gap.times(1e12).toFixed(3)} pm`;
  return `${gap.toExponential(3)} m`;
}

export const FINISH_M = FINISH;
export const ZERO = D(0);
