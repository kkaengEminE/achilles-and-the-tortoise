import Decimal from 'decimal.js';
import { D, FINISH } from './precision';

export interface TrackLayout {
  pixelsPerMeter: number;
  trackLeft: number;
  trackTop: number;
  trackHeight: number;
}

export function metersToPixels(pos: Decimal, layout: TrackLayout): number {
  return layout.trackLeft + pos.times(layout.pixelsPerMeter).toNumber();
}

export interface ZoomedLayout {
  centerX: number;
  centerY: number;
  zoom: Decimal;
  finishMeters: Decimal;
}

export function metersToScreenZoomed(pos: Decimal, layout: ZoomedLayout): number {
  const offsetMeters = pos.minus(layout.finishMeters);
  return layout.centerX + offsetMeters.times(layout.zoom).toNumber();
}

export function rulerUnit(zoom: Decimal): { label: string; meters: Decimal } {
  const z = zoom.toNumber();
  if (z < 1e2) return { label: '1 m', meters: D('1') };
  if (z < 1e3) return { label: '10 cm', meters: D('0.1') };
  if (z < 1e4) return { label: '1 cm', meters: D('0.01') };
  if (z < 1e5) return { label: '1 mm', meters: D('0.001') };
  if (z < 1e7) return { label: '0.1 mm', meters: D('0.0001') };
  if (z < 1e9) return { label: '1 µm', meters: D('1e-6') };
  if (z < 1e12) return { label: '1 nm', meters: D('1e-9') };
  if (z < 1e15) return { label: '1 pm', meters: D('1e-12') };
  if (z < 1e18) return { label: '1 fm', meters: D('1e-15') };
  return { label: '1 am', meters: D('1e-18') };
}

export function formatGap(gap: Decimal): string {
  // Show enough decimal places to make the leading non-zero digit visible.
  const abs = gap.abs();
  if (abs.isZero()) return '0';
  if (abs.gte('0.001')) return abs.toFixed(6);
  if (abs.gte('1e-9')) return abs.toFixed(12);
  return abs.toExponential(6);
}

export function formatPosition(pos: Decimal, sigmaN: number): string {
  // Display position with decimal expansion proportional to log scale.
  // Cap visible decimals to avoid HUD jitter.
  const decimals = Math.min(20, Math.max(2, Math.floor(sigmaN / 5) + 2));
  return pos.toFixed(decimals);
}

export const FINISH_NUM = FINISH.toNumber();
