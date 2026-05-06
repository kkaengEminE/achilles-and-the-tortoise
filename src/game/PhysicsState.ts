import Decimal from 'decimal.js';
import {
  ACHILLES_LINEAR_SPEED,
  D,
  FINISH,
  HALF,
  K_HALVING,
  RACE_DURATION_MS,
  SLOW_ENTRY,
  SLOW_ZONE_LEN,
  TURTLE_HEAD_START,
  TURTLE_SPEED,
  log2,
} from './util/precision';

export type Phase = 'IDLE' | 'LINEAR' | 'EVENT_HORIZON' | 'FINISHED';

export interface RaceSnapshot {
  N: number;
  achillesPos: Decimal;
  tortoisePos: Decimal;
  gap: Decimal;
  durationMs: number;
}

export class PhysicsState {
  N = 0;
  N_offset = 0;
  phase: Phase = 'IDLE';
  startMs = 0;
  endMs = 0;

  reset(): void {
    this.N = 0;
    this.N_offset = 0;
    this.phase = 'IDLE';
    this.startMs = 0;
    this.endMs = 0;
  }

  start(now: number): void {
    this.reset();
    this.startMs = now;
    this.phase = 'LINEAR';
  }

  onClick(now: number): void {
    if (this.phase === 'IDLE' || this.phase === 'FINISHED') return;
    if (this.phase === 'LINEAR') {
      const linear = this.linearAchilles(now);
      if (linear.gte(SLOW_ENTRY)) {
        this.transitionToEventHorizon(linear);
      }
    }
    this.N += 1;
  }

  tick(now: number): void {
    if (this.phase === 'IDLE' || this.phase === 'FINISHED') return;
    if (this.phase === 'LINEAR') {
      const linear = this.linearAchilles(now);
      if (linear.gte(SLOW_ENTRY)) {
        this.transitionToEventHorizon(linear);
      }
    }
    if (now - this.startMs >= RACE_DURATION_MS) {
      this.phase = 'FINISHED';
      this.endMs = this.startMs + RACE_DURATION_MS;
    }
  }

  private elapsedSec(now: number): Decimal {
    const ms = Math.min(now - this.startMs, RACE_DURATION_MS);
    return D(ms / 1000);
  }

  private linearAchilles(now: number): Decimal {
    const t = this.elapsedSec(now);
    return ACHILLES_LINEAR_SPEED.times(t);
  }

  private transitionToEventHorizon(currentLinearPos: Decimal): void {
    // Seed N_offset so achillesPos at transition equals currentLinearPos.
    // achillesPos = FINISH - SLOW_ZONE_LEN * (1/2)^((N+offset)/K)
    // => (N+offset)/K = log2(SLOW_ZONE_LEN / (FINISH - currentLinearPos))
    const remaining = FINISH.minus(currentLinearPos);
    const safeRemaining = remaining.lte(0) ? D('1e-30') : remaining;
    const ratio = SLOW_ZONE_LEN.div(safeRemaining);
    const effN = K_HALVING.times(log2(ratio)).toNumber();
    this.N_offset = Math.max(0, Math.round(effN) - this.N);
    this.phase = 'EVENT_HORIZON';
  }

  achillesPos(now: number): Decimal {
    if (this.phase === 'IDLE') return D(0);
    if (this.phase === 'LINEAR') {
      const linear = this.linearAchilles(now);
      return Decimal.min(linear, SLOW_ENTRY);
    }
    // EVENT_HORIZON or FINISHED
    return FINISH.minus(this.gapDecimal());
  }

  tortoisePos(now: number): Decimal {
    if (this.phase === 'IDLE') return TURTLE_HEAD_START;
    const t = this.elapsedSec(now);
    return Decimal.min(FINISH, TURTLE_HEAD_START.plus(TURTLE_SPEED.times(t)));
  }

  gapDecimal(): Decimal {
    if (this.phase === 'IDLE' || this.phase === 'LINEAR') {
      return SLOW_ZONE_LEN;
    }
    const effN = D(this.N + this.N_offset);
    return SLOW_ZONE_LEN.times(HALF.pow(effN.div(K_HALVING)));
  }

  isFinished(now: number): boolean {
    return this.phase === 'FINISHED' || now - this.startMs >= RACE_DURATION_MS;
  }

  snapshot(now: number): RaceSnapshot {
    return {
      N: this.N,
      achillesPos: this.achillesPos(now),
      tortoisePos: this.tortoisePos(now),
      gap: this.gapDecimal(),
      durationMs: Math.min(now - this.startMs, RACE_DURATION_MS),
    };
  }
}
