import { Container, Graphics } from 'pixi.js';

const MARBLE = 0xefe6cf;
const MARBLE_SHADOW = 0xb9a978;
const GOLD = 0xd4af37;
const GOLD_DARK = 0x8a7b3a;
const BRONZE = 0x6b5524;

const SHELL = 0x6b5a2c;
const SHELL_HIGHLIGHT = 0xa68744;
const SHELL_DARK = 0x3a2f12;
const TORTOISE_SKIN = 0x9c8650;
const TORTOISE_SKIN_DARK = 0x5e4d28;

export type AchillesPose = 'idle' | 'leftForward' | 'rightForward';

/**
 * Container holding three Achilles poses; only one is visible at a time.
 * Origin (0, 0) is the front toe (judging point). He faces RIGHT.
 *
 * - idle: feet together, ready
 * - leftForward: left foot forward, right foot back (mid-stride)
 * - rightForward: right foot forward, left foot back (mid-stride)
 */
export function drawAchilles(): Container & { setPose(p: AchillesPose): void } {
  const c = new Container() as Container & { setPose(p: AchillesPose): void };

  const idle = drawAchillesPose('idle');
  const leftFwd = drawAchillesPose('leftForward');
  const rightFwd = drawAchillesPose('rightForward');

  c.addChild(idle, leftFwd, rightFwd);
  leftFwd.visible = false;
  rightFwd.visible = false;

  c.setPose = (p: AchillesPose) => {
    idle.visible = p === 'idle';
    leftFwd.visible = p === 'leftForward';
    rightFwd.visible = p === 'rightForward';
  };

  return c;
}

function drawAchillesPose(pose: AchillesPose): Container {
  const c = new Container();
  const halo = new Graphics();
  halo.circle(-8, -48, 28).fill({ color: GOLD, alpha: 0.06 });
  c.addChild(halo);

  const body = new Graphics();
  c.addChild(body);

  // Legs vary per pose — others (torso, head, arm, spear, shield) are shared.
  drawLegs(body, pose);

  // Tunic skirt (covers tops of legs)
  body
    .moveTo(-18, -22)
    .lineTo(2, -22)
    .lineTo(0, -32)
    .lineTo(-16, -32)
    .closePath()
    .fill({ color: GOLD })
    .stroke({ color: GOLD_DARK, width: 1 });
  // Skirt fold lines
  body.moveTo(-12, -22).lineTo(-11, -32).stroke({ color: GOLD_DARK, width: 0.5 });
  body.moveTo(-6, -22).lineTo(-6, -32).stroke({ color: GOLD_DARK, width: 0.5 });

  // Torso (cuirass)
  body
    .moveTo(-16, -32)
    .lineTo(0, -32)
    .lineTo(-1, -50)
    .lineTo(-15, -50)
    .closePath()
    .fill({ color: MARBLE })
    .stroke({ color: MARBLE_SHADOW, width: 1 });
  // Cuirass detail
  body.moveTo(-14, -41).lineTo(-2, -41).stroke({ color: GOLD_DARK, width: 1 });
  body.moveTo(-14, -36).lineTo(-2, -36).stroke({ color: GOLD_DARK, width: 0.6 });

  // Spear arm — angle changes slightly per pose to suggest motion
  const spearY = pose === 'rightForward' ? -42 : pose === 'leftForward' ? -48 : -45;
  body.moveTo(-2, -46).lineTo(8, spearY + 4).stroke({ color: MARBLE, width: 4 });
  // Spear shaft
  body.moveTo(7, spearY + 2).lineTo(28, spearY - 4).stroke({ color: BRONZE, width: 1.5 });
  // Spear tip
  body
    .moveTo(28, spearY - 4)
    .lineTo(32, spearY - 2)
    .lineTo(32, spearY - 6)
    .closePath()
    .fill({ color: GOLD })
    .stroke({ color: GOLD_DARK, width: 0.8 });

  // Shield behind body
  body.circle(-19, -40, 6).fill({ color: BRONZE }).stroke({ color: GOLD_DARK, width: 1 });
  body.circle(-19, -40, 3).fill({ color: GOLD });

  // Head
  body
    .ellipse(-7, -56, 5, 6)
    .fill({ color: MARBLE })
    .stroke({ color: MARBLE_SHADOW, width: 1 });

  // Helmet plume — small bob if running
  const plumeOffset = pose === 'idle' ? 0 : pose === 'rightForward' ? -1 : 1;
  body
    .moveTo(-13, -60 + plumeOffset)
    .quadraticCurveTo(-4, -72 + plumeOffset, 4, -60 + plumeOffset)
    .lineTo(-2, -56)
    .quadraticCurveTo(-4, -64, -10, -56)
    .closePath()
    .fill({ color: GOLD })
    .stroke({ color: GOLD_DARK, width: 1 });

  // Helmet body
  body
    .ellipse(-7, -58, 6, 4)
    .fill({ color: BRONZE })
    .stroke({ color: GOLD_DARK, width: 1 });

  return c;
}

/**
 * Origin = front toe (forward foot). The "front" leg in each pose is anchored at (0, 0)
 * and the back leg is offset behind. For "rightForward", the right leg is forward,
 * for "leftForward", the left leg is forward, idle = both legs together.
 */
function drawLegs(body: Graphics, pose: AchillesPose): void {
  if (pose === 'idle') {
    // Both legs vertical, side by side
    body
      .moveTo(0, 0)
      .lineTo(-3, -22)
      .lineTo(-7, -22)
      .lineTo(-7, 0)
      .closePath()
      .fill({ color: MARBLE })
      .stroke({ color: MARBLE_SHADOW, width: 1 });
    body
      .moveTo(-9, 0)
      .lineTo(-9, -22)
      .lineTo(-13, -22)
      .lineTo(-13, 0)
      .closePath()
      .fill({ color: MARBLE_SHADOW })
      .stroke({ color: SHELL_DARK, width: 1 });
    return;
  }

  if (pose === 'rightForward') {
    // Right leg forward (anchored at toe = origin), left leg back & bent
    // Front leg: straight, slightly angled forward
    body
      .moveTo(0, 0)
      .lineTo(-2, -10)
      .lineTo(-4, -22)
      .lineTo(-9, -22)
      .lineTo(-7, -10)
      .lineTo(-7, 0)
      .closePath()
      .fill({ color: MARBLE })
      .stroke({ color: MARBLE_SHADOW, width: 1 });
    // Back leg: pushed back, knee bent
    body
      .moveTo(-22, 2)
      .lineTo(-18, -10)
      .lineTo(-15, -16)
      .lineTo(-12, -22)
      .lineTo(-17, -22)
      .lineTo(-20, -16)
      .lineTo(-25, -8)
      .closePath()
      .fill({ color: MARBLE_SHADOW })
      .stroke({ color: SHELL_DARK, width: 1 });
    return;
  }

  // leftForward: mirror of rightForward — left leg forward, right leg back
  // Front leg = left leg, anchored at toe origin (0, 0)
  body
    .moveTo(0, 0)
    .lineTo(-3, -10)
    .lineTo(-5, -22)
    .lineTo(-10, -22)
    .lineTo(-8, -10)
    .lineTo(-7, 0)
    .closePath()
    .fill({ color: MARBLE_SHADOW })
    .stroke({ color: SHELL_DARK, width: 1 });
  // Back leg = right leg, slightly offset behind
  body
    .moveTo(-12, 0)
    .lineTo(-13, -14)
    .lineTo(-12, -22)
    .lineTo(-17, -22)
    .lineTo(-18, -14)
    .lineTo(-19, 0)
    .closePath()
    .fill({ color: MARBLE })
    .stroke({ color: MARBLE_SHADOW, width: 1 });
}

/**
 * Tiny side-profile leopard tortoise. Origin = nose (judging point).
 * Faces RIGHT, shell to the left.
 */
export function drawTortoise(): Container {
  const c = new Container();
  const g = new Graphics();
  c.addChild(g);

  // Shell dome
  g.moveTo(-6, -8)
    .quadraticCurveTo(-22, -22, -38, -8)
    .lineTo(-38, -2)
    .lineTo(-6, -2)
    .closePath()
    .fill({ color: SHELL })
    .stroke({ color: SHELL_DARK, width: 1.5 });

  // Shell dome highlight
  g.moveTo(-10, -10)
    .quadraticCurveTo(-22, -19, -34, -10)
    .stroke({ color: SHELL_HIGHLIGHT, width: 1 });

  // Leopard spots
  const spots: Array<[number, number, number]> = [
    [-14, -14, 2.2],
    [-22, -17, 2.6],
    [-30, -13, 2.0],
    [-18, -9, 1.6],
    [-26, -8, 1.6],
    [-33, -6, 1.4],
  ];
  for (const [x, y, r] of spots) {
    g.circle(x, y, r)
      .fill({ color: SHELL_HIGHLIGHT })
      .stroke({ color: SHELL_DARK, width: 0.6 });
    g.circle(x, y, r * 0.4).fill({ color: SHELL_DARK });
  }

  // Front legs
  g.rect(-9, -2, 4, 4).fill({ color: TORTOISE_SKIN }).stroke({ color: SHELL_DARK, width: 0.8 });
  g.rect(-30, -2, 4, 4).fill({ color: TORTOISE_SKIN }).stroke({ color: SHELL_DARK, width: 0.8 });
  // Toenails
  g.rect(-9, 2, 4, 1).fill({ color: 0xfef3c0 });
  g.rect(-30, 2, 4, 1).fill({ color: 0xfef3c0 });

  // Tail
  g.moveTo(-38, -5).lineTo(-42, -3).lineTo(-38, -2).closePath().fill({ color: TORTOISE_SKIN_DARK });

  // Head & neck
  g.moveTo(-6, -6)
    .quadraticCurveTo(-2, -6, 0, -4)
    .lineTo(-1, -2)
    .lineTo(-6, -2)
    .closePath()
    .fill({ color: TORTOISE_SKIN })
    .stroke({ color: SHELL_DARK, width: 1 });

  // Eye
  g.circle(-3, -5, 0.6).fill({ color: SHELL_DARK });
  // Nose tip — exactly at origin
  g.circle(0, -3.5, 0.6).fill({ color: 0xfff5cc });

  return c;
}
