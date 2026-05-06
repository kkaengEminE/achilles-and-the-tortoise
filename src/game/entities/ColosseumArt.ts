import { Container, Graphics } from 'pixi.js';

const STONE = 0x2b2418;
const STONE_LIGHT = 0x3e3520;
const GOLD = 0xc9a440;
const SHADOW = 0x141008;
const FIGURE = 0x6b5524;
const FIGURE_LIGHT = 0x9c8650;

/**
 * Stylised colosseum/Greek-amphitheatre back wall: tiered arches with
 * silhouetted spectators. Renders above the track.
 */
export function drawColosseum(width = 1200, baseY = 400): Container {
  const c = new Container();

  // Sky / wall gradient panel
  const sky = new Graphics();
  sky.rect(0, 0, width, baseY)
    .fill({ color: SHADOW });
  c.addChild(sky);

  // Two tiers of arches
  drawTier(c, width, baseY, baseY * 0.5, 1);
  drawTier(c, width, baseY, baseY * 0.78, 2);

  // Awning / banners
  drawBanners(c, width, baseY * 0.05);

  return c;
}

function drawTier(
  parent: Container,
  width: number,
  baseY: number,
  topY: number,
  tier: number,
): void {
  const archHeight = (baseY - topY) * 0.85;
  const archW = tier === 1 ? 90 : 70;
  const gap = tier === 1 ? 12 : 8;
  const span = archW + gap;
  const count = Math.ceil(width / span) + 1;

  const wall = new Graphics();
  wall.rect(0, topY, width, baseY - topY).fill({ color: STONE });
  parent.addChild(wall);

  // Cornice (horizontal moulding above)
  wall.rect(0, topY - 4, width, 4).fill({ color: STONE_LIGHT });
  wall.rect(0, topY, width, 1).fill({ color: GOLD, alpha: 0.4 });

  // Arches as cut-outs, drawn as black openings with figure silhouettes
  for (let i = 0; i < count; i++) {
    const x = i * span - span * 0.3;

    // Arch opening
    wall
      .moveTo(x, baseY)
      .lineTo(x, topY + archHeight * 0.4)
      .quadraticCurveTo(x + archW / 2, topY + 2, x + archW, topY + archHeight * 0.4)
      .lineTo(x + archW, baseY)
      .closePath()
      .fill({ color: SHADOW });

    // Inner highlight rim
    wall
      .moveTo(x, topY + archHeight * 0.4)
      .quadraticCurveTo(x + archW / 2, topY + 2, x + archW, topY + archHeight * 0.4)
      .stroke({ color: GOLD, width: 1, alpha: 0.45 });

    // Spectators inside the arch — small dome-shaped figures
    const figureCount = tier === 1 ? 3 : 2;
    const figureBase = baseY - 6;
    for (let f = 0; f < figureCount; f++) {
      const fx = x + 16 + f * (archW - 32) / Math.max(1, figureCount - 1);
      drawFigure(wall, fx, figureBase, tier === 1 ? 14 : 10);
    }

    // Decorative pilaster between arches
    wall.rect(x + archW + gap / 2 - 1, topY, 2, baseY - topY).fill({ color: STONE_LIGHT });
  }
}

function drawFigure(g: Graphics, x: number, baseY: number, scale: number): void {
  // Body
  g.moveTo(x - scale * 0.35, baseY)
    .lineTo(x - scale * 0.35, baseY - scale * 0.7)
    .quadraticCurveTo(x, baseY - scale * 1.0, x + scale * 0.35, baseY - scale * 0.7)
    .lineTo(x + scale * 0.35, baseY)
    .closePath()
    .fill({ color: FIGURE });

  // Head
  g.circle(x, baseY - scale * 1.1, scale * 0.22).fill({ color: FIGURE_LIGHT });
}

function drawBanners(parent: Container, width: number, y: number): void {
  const g = new Graphics();
  // gold ribbon at top
  g.rect(0, y, width, 3).fill({ color: GOLD, alpha: 0.55 });
  g.rect(0, y + 3, width, 1).fill({ color: GOLD, alpha: 0.25 });

  // Olive wreaths every ~140px
  const stride = 140;
  for (let x = stride / 2; x < width; x += stride) {
    g.circle(x, y + 10, 5)
      .stroke({ color: GOLD, width: 1.2, alpha: 0.7 });
    g.circle(x - 1, y + 9, 1.4).fill({ color: GOLD, alpha: 0.7 });
    g.circle(x + 1, y + 11, 1.2).fill({ color: GOLD, alpha: 0.7 });
  }
  parent.addChild(g);
}
