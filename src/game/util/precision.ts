import Decimal from 'decimal.js';

Decimal.set({ precision: 50, toExpNeg: -50, toExpPos: 50 });

export const D = (v: Decimal.Value) => new Decimal(v);

export const FINISH = D('111.11');
export const SLOW_ZONE_LEN = D('0.11');
export const SLOW_ENTRY = D('111');
export const TURTLE_HEAD_START = D('100');
export const TURTLE_SPEED = D('1');
export const ACHILLES_LINEAR_SPEED = D('10');
export const RACE_DURATION_MS = 11110;
export const K_HALVING = D('5');

export const HALF = D('0.5');
export const LN2 = Decimal.ln(2);

export function log2(x: Decimal): Decimal {
  return Decimal.ln(x).div(LN2);
}
