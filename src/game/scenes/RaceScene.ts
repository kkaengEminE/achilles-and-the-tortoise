import { Application, Container, Graphics, Text } from 'pixi.js';
import { PhysicsState } from '../PhysicsState';
import { FINISH, SLOW_ENTRY } from '../util/precision';
import type { AchillesPose } from '../entities/CharacterArt';
import { drawAchilles, drawTortoise } from '../entities/CharacterArt';
import { drawColosseum } from '../entities/ColosseumArt';

const TRACK_PADDING = 60;
const TRACK_COLOR = 0x2b2418;
const TRACK_LINE = 0xc9a440;
const FINISH_COLOR = 0xd4af37;

export class RaceScene {
  container: Container;
  private app: Application;
  private physics: PhysicsState;
  private colosseum: Container;
  private track: Graphics;
  private slowMarker: Graphics;
  private finishLine: Graphics;
  private achilles: ReturnType<typeof drawAchilles>;
  private tortoise: Container;
  private lastAchillesPos = 0;
  private runCycleAccum = 0;
  private runFootRight = true;
  private hint: Text;
  private resizeBound: () => void;

  constructor(app: Application, physics: PhysicsState) {
    this.app = app;
    this.physics = physics;
    this.container = new Container();
    this.colosseum = drawColosseum();
    this.track = new Graphics();
    this.slowMarker = new Graphics();
    this.finishLine = new Graphics();
    this.achilles = drawAchilles();
    this.tortoise = drawTortoise();
    this.hint = new Text({
      text: 'SPACE · CLICK · TAP',
      style: {
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 18,
        fill: 0xefe6cf,
        letterSpacing: 4,
        align: 'center',
      },
    });
    this.hint.anchor.set(0.5);
    this.container.addChild(
      this.colosseum,
      this.track,
      this.slowMarker,
      this.finishLine,
      this.tortoise,
      this.achilles,
      this.hint,
    );
    this.resizeBound = this.layout.bind(this);
    window.addEventListener('resize', this.resizeBound);
    this.layout();
  }

  destroy(): void {
    window.removeEventListener('resize', this.resizeBound);
    this.container.destroy({ children: true });
  }

  private get screenW(): number {
    return this.app.screen.width;
  }
  private get screenH(): number {
    return this.app.screen.height;
  }

  private trackY(): number {
    return this.screenH * 0.66;
  }

  private trackLeft(): number {
    return TRACK_PADDING;
  }
  private trackRight(): number {
    return this.screenW - TRACK_PADDING;
  }
  private pixelsPerMeter(): number {
    return (this.trackRight() - this.trackLeft()) / FINISH.toNumber();
  }

  private xFromMeters(m: number): number {
    return this.trackLeft() + m * this.pixelsPerMeter();
  }

  private layout(): void {
    const w = this.screenW;
    const h = this.screenH;
    const ty = this.trackY();
    const left = this.trackLeft();
    const right = this.trackRight();

    // Re-render colosseum (it adapts to width)
    this.colosseum.removeChildren();
    const fresh = drawColosseum(w, ty - 20);
    while (fresh.children.length) {
      this.colosseum.addChild(fresh.children[0]);
    }

    // Sand track
    this.track
      .clear()
      .rect(left, ty - 6, right - left, 14)
      .fill({ color: TRACK_COLOR })
      .rect(left, ty - 6, right - left, 1)
      .fill({ color: TRACK_LINE, alpha: 0.6 })
      .rect(left, ty + 7, right - left, 1)
      .fill({ color: TRACK_LINE, alpha: 0.6 });

    // Slow zone marker at 111m
    const slowX = this.xFromMeters(SLOW_ENTRY.toNumber());
    this.slowMarker
      .clear()
      .rect(slowX - 1, ty - 22, 2, 42)
      .fill({ color: 0x8a7b3a, alpha: 0.55 });

    // Finish line at 111.11m — Ionic column
    const finishX = this.xFromMeters(FINISH.toNumber());
    this.finishLine
      .clear()
      // base
      .rect(finishX - 8, ty + 6, 16, 4)
      .fill({ color: FINISH_COLOR })
      // shaft
      .rect(finishX - 2, ty - 60, 4, 70)
      .fill({ color: FINISH_COLOR })
      // capital with volutes
      .rect(finishX - 9, ty - 64, 18, 6)
      .fill({ color: FINISH_COLOR })
      .circle(finishX - 8, ty - 61, 3)
      .fill({ color: 0xfff5cc })
      .stroke({ color: 0x8a7b3a, width: 0.6 })
      .circle(finishX + 8, ty - 61, 3)
      .fill({ color: 0xfff5cc })
      .stroke({ color: 0x8a7b3a, width: 0.6 })
      // soft glow
      .moveTo(finishX, ty - 64)
      .lineTo(finishX, ty + 12)
      .stroke({ color: 0xfff5cc, width: 0.6, alpha: 0.7 });

    this.hint.x = w / 2;
    this.hint.y = ty + 70;
    void h;
  }

  update(now: number): void {
    const ach = this.physics.achillesPos(now).toNumber();
    const tor = this.physics.tortoisePos(now).toNumber();
    const ty = this.trackY();

    this.achilles.x = this.xFromMeters(ach);
    this.achilles.y = ty + 8;

    this.tortoise.x = this.xFromMeters(tor);
    this.tortoise.y = ty + 8;

    // Run-cycle animation: alternate left/right while moving, idle when stopped.
    const dxMeters = ach - this.lastAchillesPos;
    this.lastAchillesPos = ach;
    let pose: AchillesPose;
    if (this.physics.phase === 'IDLE' || dxMeters < 0.001) {
      pose = 'idle';
      this.runCycleAccum = 0;
    } else {
      // Stride accumulator: faster speed → faster foot swap. Each metre travelled
      // advances ~6 stride units, so at 10 m/s a swap happens every ~33 ms.
      this.runCycleAccum += dxMeters * 6;
      if (this.runCycleAccum >= 1) {
        this.runFootRight = !this.runFootRight;
        this.runCycleAccum = 0;
      }
      pose = this.runFootRight ? 'rightForward' : 'leftForward';
    }
    this.achilles.setPose(pose);

    // Visual judder when N is high
    if (this.physics.N > 30) {
      const j = Math.min(1.6, this.physics.N / 100);
      this.achilles.x += (Math.random() - 0.5) * j;
      this.achilles.y += (Math.random() - 0.5) * j;
    }
  }
}
