import { describe, expect, it } from 'vitest';
import { PhysicsState } from './PhysicsState';
import { FINISH, RACE_DURATION_MS } from './util/precision';

describe('PhysicsState', () => {
  it('starts idle', () => {
    const s = new PhysicsState();
    expect(s.phase).toBe('IDLE');
    expect(s.N).toBe(0);
  });

  it('runs Achilles linearly at 10 m/s before slow zone', () => {
    const s = new PhysicsState();
    s.start(0);
    expect(s.achillesPos(1000).toNumber()).toBeCloseTo(10, 5);
    expect(s.achillesPos(5000).toNumber()).toBeCloseTo(50, 5);
    expect(s.achillesPos(10000).toNumber()).toBeCloseTo(100, 5);
  });

  it('tortoise reaches finish at exactly 11.11s', () => {
    const s = new PhysicsState();
    s.start(0);
    expect(s.tortoisePos(0).toNumber()).toBeCloseTo(100, 5);
    expect(s.tortoisePos(11110).toNumber()).toBeCloseTo(111.11, 5);
  });

  it('transitions to EVENT_HORIZON when Achilles linear pos hits 111m', () => {
    const s = new PhysicsState();
    s.start(0);
    s.tick(11099); // 110.99m, still linear
    expect(s.phase).toBe('LINEAR');
    s.tick(11101); // 111.01m, should transition
    expect(s.phase).toBe('EVENT_HORIZON');
  });

  it('Achilles never reaches or exceeds the finish line', () => {
    const s = new PhysicsState();
    s.start(0);
    // Simulate 200 frenetic clicks during the slow zone
    for (let i = 0; i < 200; i++) {
      s.onClick(11100 + i);
    }
    s.tick(RACE_DURATION_MS);
    const pos = s.achillesPos(RACE_DURATION_MS);
    expect(pos.lt(FINISH)).toBe(true);
    expect(s.gapDecimal().gt(0)).toBe(true);
  });

  it('gap shrinks geometrically with N (every K=5 clicks halves)', () => {
    const s = new PhysicsState();
    s.start(0);
    // Force into event horizon at exactly 111m so N_offset = 0
    s.tick(11100);
    expect(s.phase).toBe('EVENT_HORIZON');
    const gap0 = s.gapDecimal().toNumber();
    for (let i = 0; i < 5; i++) s.onClick(11100);
    const gap5 = s.gapDecimal().toNumber();
    // After 5 clicks gap should be ~half
    expect(gap5).toBeCloseTo(gap0 / 2, 5);
    for (let i = 0; i < 5; i++) s.onClick(11100);
    const gap10 = s.gapDecimal().toNumber();
    expect(gap10).toBeCloseTo(gap0 / 4, 5);
  });

  it('matches user intuition: ~10 clicks → ~1/4 gap, ~30 clicks → ~1/64 gap', () => {
    const s = new PhysicsState();
    s.start(0);
    s.tick(11100);
    const gap0 = s.gapDecimal().toNumber();
    for (let i = 0; i < 10; i++) s.onClick(11100);
    expect(s.gapDecimal().toNumber()).toBeCloseTo(gap0 / 4, 5);
    for (let i = 0; i < 20; i++) s.onClick(11100);
    expect(s.gapDecimal().toNumber()).toBeCloseTo(gap0 / 64, 5);
  });

  it('handles Sigma 300 without NaN/Infinity', () => {
    const s = new PhysicsState();
    s.start(0);
    s.tick(11100);
    for (let i = 0; i < 300; i++) s.onClick(11100);
    const gap = s.gapDecimal();
    expect(gap.isFinite()).toBe(true);
    expect(gap.gt(0)).toBe(true);
    expect(s.achillesPos(RACE_DURATION_MS).lt(FINISH)).toBe(true);
  });

  it('snapshot is deterministic at end', () => {
    const s = new PhysicsState();
    s.start(0);
    for (let t = 0; t < RACE_DURATION_MS; t += 100) {
      s.tick(t);
      if (t > 9000) s.onClick(t);
    }
    s.tick(RACE_DURATION_MS);
    const snap1 = s.snapshot(RACE_DURATION_MS);
    const snap2 = s.snapshot(RACE_DURATION_MS + 5000);
    expect(snap1.N).toBe(snap2.N);
    expect(snap1.gap.toString()).toBe(snap2.gap.toString());
  });

  it('isFinished true at 11.11s', () => {
    const s = new PhysicsState();
    s.start(0);
    expect(s.isFinished(5000)).toBe(false);
    s.tick(RACE_DURATION_MS);
    expect(s.isFinished(RACE_DURATION_MS)).toBe(true);
  });
});
