import { Application, Container, Graphics, Text } from 'pixi.js';
import Decimal from 'decimal.js';
import { PhysicsState } from '../PhysicsState';
import { D } from '../util/precision';
import { drawAchilles, drawTortoise } from '../entities/CharacterArt';

const REPLAY_DURATION_MS = 6000;
const FINISH_COLOR = 0xd4af37;

/**
 * Replay strategy:
 *  - Anchor the finish line at the centre of the screen (the column).
 *  - The tortoise's nose is exactly at the line. The achilles's toe is `gap` metres
 *    behind. We zoom the metres-per-pixel so the gap occupies a comfortable visible
 *    width (~25% of the screen) at the end of the zoom.
 *  - Characters keep constant on-screen size; only the empty space between them grows.
 *  - We render an arrow + label with the gap (truncated to the first significant digit)
 *    floating between the toe and the line.
 */
export class ReplayScene {
  container: Container;
  private app: Application;
  private physics: PhysicsState;
  private gap: Decimal;
  private ruler: Graphics;
  private finishLine: Graphics;
  private gapArrow: Graphics;
  private gapLabel: Text;
  private achilles: Container;
  private tortoise: Container;
  private startMs = 0;

  constructor(app: Application, physics: PhysicsState) {
    this.app = app;
    this.physics = physics;
    this.gap = physics.gapDecimal();
    this.container = new Container();
    this.ruler = new Graphics();
    this.finishLine = new Graphics();
    this.gapArrow = new Graphics();
    this.gapLabel = new Text({
      text: '',
      style: {
        // Cormorant Garamond covers the µ glyph; Cinzel does not.
        fontFamily: ['Cormorant Garamond', 'Georgia', 'serif'],
        fontSize: 18,
        fontWeight: '600',
        fill: 0xfef3c0,
        letterSpacing: 1,
      },
    });
    this.gapLabel.anchor.set(0.5, 1);
    this.achilles = drawAchilles();
    this.tortoise = drawTortoise();
    this.container.addChild(
      this.ruler,
      this.finishLine,
      this.gapArrow,
      this.tortoise,
      this.achilles,
      this.gapLabel,
    );
  }

  start(): void {
    this.startMs = performance.now();
    this.gap = this.physics.gapDecimal();
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }

  private get screenW(): number {
    return this.app.screen.width;
  }
  private get screenH(): number {
    return this.app.screen.height;
  }

  /**
   * pixels-per-metre that grows exponentially over the replay so the gap goes
   * from ~tiny to ~25% of screen width by the end.
   */
  private ppmAt(t: number): Decimal {
    const tc = Math.max(0, Math.min(1, t));
    const targetGapPx = this.screenW * 0.25;
    const targetPpm = this.gap.isZero() ? D(this.screenW).times(1e18) : D(targetGapPx).div(this.gap);
    const startPpm = D(8); // 8 pixels per metre = whole 111m race fits across screen-ish
    const logStart = Decimal.ln(startPpm);
    const logTarget = Decimal.ln(targetPpm);
    // ease-in-out cubic
    const eased = tc < 0.5 ? 4 * tc * tc * tc : 1 - Math.pow(-2 * tc + 2, 3) / 2;
    const lerp = logStart.plus(logTarget.minus(logStart).times(D(eased)));
    return Decimal.exp(lerp);
  }

  update(now: number): void {
    if (this.startMs === 0) return;
    const elapsed = now - this.startMs;
    const t = Math.min(1, elapsed / REPLAY_DURATION_MS);

    const ppm = this.ppmAt(t);
    const cx = this.screenW * 0.5;
    const cy = this.screenH * 0.55;

    // Finish line — gold column at exact centre
    this.finishLine
      .clear()
      .rect(cx - 1.5, cy - 90, 3, 180)
      .fill({ color: FINISH_COLOR })
      .moveTo(cx, cy - 90)
      .lineTo(cx, cy + 90)
      .stroke({ color: 0xfff5cc, width: 0.6, alpha: 0.85 });

    // Tortoise nose touches finish line at cx
    // Achilles toe is `gap` metres behind, in screen px: gap * ppm
    const gapPx = this.gap.times(ppm).toNumber();
    const tortoiseX = cx;
    const achillesX = cx - gapPx;

    // Position character containers (entity origin = nose/toe judging point)
    this.tortoise.x = tortoiseX;
    this.tortoise.y = cy + 6;
    this.achilles.x = achillesX;
    this.achilles.y = cy + 6;

    // Draw the gap arrow & label only when gap is visible enough
    if (gapPx > 4) {
      this.drawGapArrow(achillesX, tortoiseX, cy);
      this.gapLabel.visible = true;
      this.gapLabel.text = formatGapShort(this.gap);
      this.gapLabel.x = (achillesX + tortoiseX) / 2;
      this.gapLabel.y = cy - 22;
    } else {
      this.gapArrow.clear();
      this.gapLabel.visible = false;
    }

    this.drawRuler(ppm, cx, cy);
  }

  private drawGapArrow(x1: number, x2: number, cy: number): void {
    const y = cy;
    const head = 6;
    this.gapArrow
      .clear()
      .moveTo(x1, y)
      .lineTo(x2, y)
      .stroke({ color: 0xfef3c0, width: 1.4, alpha: 0.95 })
      // left arrowhead
      .moveTo(x1, y)
      .lineTo(x1 + head, y - head * 0.6)
      .moveTo(x1, y)
      .lineTo(x1 + head, y + head * 0.6)
      .stroke({ color: 0xfef3c0, width: 1.4, alpha: 0.95 })
      // right arrowhead
      .moveTo(x2, y)
      .lineTo(x2 - head, y - head * 0.6)
      .moveTo(x2, y)
      .lineTo(x2 - head, y + head * 0.6)
      .stroke({ color: 0xfef3c0, width: 1.4, alpha: 0.95 });
  }

  private drawRuler(ppm: Decimal, cx: number, cy: number): void {
    // Ruler spans roughly the gap area + a bit of context. We make it ~50% of width.
    const rulerWidth = this.screenW * 0.5;
    const left = cx - rulerWidth / 2;
    const right = cx + rulerWidth / 2;
    const y = cy + 110;

    // Pick a unit such that one unit ~= 70 px on screen
    const targetPx = 70;
    const meters = D(targetPx).div(ppm);
    const log10 = Decimal.log10(meters);
    const power = Math.floor(log10.toNumber());
    const unitMeters = D(10).pow(power);
    const unitPx = unitMeters.times(ppm).toNumber();

    this.ruler
      .clear()
      .rect(left, y, rulerWidth, 1)
      .fill({ color: 0xc9a440, alpha: 0.7 });

    // tick marks centred on cx (so finish line is on a tick)
    let x = cx;
    while (x > left) {
      this.ruler.rect(x - 0.5, y - 6, 1, 12).fill({ color: 0xc9a440 });
      x -= unitPx;
    }
    x = cx + unitPx;
    while (x < right) {
      this.ruler.rect(x - 0.5, y - 6, 1, 12).fill({ color: 0xc9a440 });
      x += unitPx;
    }
  }
}

/** Truncate gap to the first significant digit (e.g. 0.0000116... → "0.00001 m"). */
export function formatGapShort(gap: Decimal): string {
  if (gap.isZero()) return '0 m';
  // Use 1 significant digit, then format depending on magnitude
  const abs = gap.abs();
  // Choose unit
  if (abs.gte(1)) return `${abs.toSignificantDigits(1).toString()} m`;
  if (abs.gte('0.01')) return `${abs.times(100).toSignificantDigits(1).toString()} cm`;
  if (abs.gte('1e-3')) return `${abs.times(1000).toSignificantDigits(1).toString()} mm`;
  if (abs.gte('1e-6')) return `${abs.times(1e6).toSignificantDigits(1).toString()} µm`;
  if (abs.gte('1e-9')) return `${abs.times(1e9).toSignificantDigits(1).toString()} nm`;
  if (abs.gte('1e-12')) return `${abs.times(1e12).toSignificantDigits(1).toString()} pm`;
  return abs.toExponential(0) + ' m';
}
