import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useGameStore } from '../../state/gameStore';
import { MuchaFrame } from '../components/MuchaFrame';
import { IonicButton } from '../components/IonicButton';
import { useT } from '../../i18n/useT';
import { formatGapShort } from '../../game/scenes/ReplayScene';
import type { StringKey } from '../../i18n/strings';

interface Props {
  onRetry: () => void;
}

/**
 * Rank tiers — each threshold marks a roughly-consistent magnitude in the gap
 * (gap = 0.11 × (1/2)^(N/5)). Numbers verified:
 *   N=0    → 11 cm     Mortal (centimetres)
 *   N=20   → 6.9 mm    Apprentice (millimetres)
 *   N=40   → 0.43 mm   Pursuer (hundreds of µm — hair width)
 *   N=70   → 6.8 µm    Artisan (single-digit µm — red blood cell)
 *   N=100  → 110 nm    Windwalker (nanometres — light wavelength)
 *   N=150  → 110 pm    Daimon (picometres — atom)
 *   N=200  → 110 fm    Apeiron (femtometres — atomic nucleus)
 *   N=280  → 0.43 am   Infinitesimal (sub-atomic)
 */
const RANK_TIERS: Array<{ min: number; nameKey: StringKey; flavourKey: StringKey }> = [
  { min: 0, nameKey: 'rankMortal', flavourKey: 'rankMortalFlavour' },
  { min: 20, nameKey: 'rankApprentice', flavourKey: 'rankApprenticeFlavour' },
  { min: 40, nameKey: 'rankPursuer', flavourKey: 'rankPursuerFlavour' },
  { min: 70, nameKey: 'rankArtisan', flavourKey: 'rankArtisanFlavour' },
  { min: 100, nameKey: 'rankWindwalker', flavourKey: 'rankWindwalkerFlavour' },
  { min: 150, nameKey: 'rankDaimon', flavourKey: 'rankDaimonFlavour' },
  { min: 200, nameKey: 'rankApeiron', flavourKey: 'rankApeironFlavour' },
  { min: 280, nameKey: 'rankInfinitesimal', flavourKey: 'rankInfinitesimalFlavour' },
];

function rankFor(n: number) {
  let pick = RANK_TIERS[0];
  for (const t of RANK_TIERS) if (n >= t.min) pick = t;
  return pick;
}

export function ScoreScreen({ onRetry }: Props) {
  const final = useGameStore((s) => s.final);
  const pb = useGameStore((s) => s.pb);
  const isPB = useGameStore((s) => s.isPB);
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useT();

  if (!final) return null;
  const rank = rankFor(final.N);
  const gapShort = formatGapShort(final.gap);

  const onSavePng = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#100c06',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `zeno-gap-${gapShort.replace(/\s/g, '')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('PNG export failed', err);
    }
  };

  const onShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sigma', String(final.N));
    url.searchParams.set('gap', final.gap.toString());
    try {
      await navigator.clipboard.writeText(url.toString());
      alert(t('scoreCopied'));
    } catch {
      prompt(t('scoreLink'), url.toString());
    }
  };

  // gapShort is e.g. "8 µm" — split into number + unit so we can style separately
  const m = gapShort.match(/^(\S+)\s*(.*)$/);
  const gapNum = m?.[1] ?? gapShort;
  const gapUnit = m?.[2] ?? '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        pointerEvents: 'auto',
        background: 'rgba(8,6,3,0.55)',
        backdropFilter: 'blur(2px)',
        overflow: 'auto',
      }}
    >
      <MuchaFrame style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>
        <div ref={cardRef} style={{ padding: '20px 24px' }}>
          <div className="label-tiny">{t('scoreVerdict')}</div>
          <div className="divider">{t('scoreSubtitle')}</div>

          {/* GAP — the headline */}
          <div
            className="label-tiny"
            style={{ marginTop: 14, color: 'var(--gold-300)' }}
          >
            {t('scoreFinalGap')}
          </div>
          <div
            // Cormorant Garamond fully supports Greek µ; Cinzel does not.
            style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: 'clamp(56px, 11vw, 112px)',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              marginTop: 4,
              background: 'linear-gradient(180deg,#fef3c0 0%,#d4af37 60%,#8a7b3a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 18px rgba(212,175,55,0.18)',
            }}
          >
            <span>{gapNum}</span>
            {gapUnit && (
              <span
                style={{
                  fontSize: '0.5em',
                  fontWeight: 500,
                  marginLeft: '0.18em',
                  letterSpacing: '0.04em',
                }}
              >
                {gapUnit}
              </span>
            )}
          </div>

          {/* Rank name + flavour */}
          <div
            style={{
              marginTop: 12,
              fontFamily: 'var(--serif-display)',
              fontSize: 'clamp(18px, 2.4vw, 22px)',
              letterSpacing: '0.18em',
              color: 'var(--gold-100)',
            }}
          >
            {t(rank.nameKey)}
          </div>
          <div
            style={{
              marginTop: 6,
              fontStyle: 'italic',
              opacity: 0.85,
              fontSize: 'clamp(14px, 1.7vw, 16px)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              maxWidth: 480,
              margin: '6px auto 0',
              lineHeight: 1.5,
            }}
          >
            “{t(rank.flavourKey)}”
          </div>

          <div className="divider">∞</div>

          {/* Strike count — small, secondary */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(14px, 1.7vw, 16px)',
              opacity: 0.85,
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--marble-100)' }}>{final.N}</span>{' '}
            {t('scoreStrikes')}
          </div>

          {pb && (
            <div style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>
              {isPB ? t('scoreNewPB') : `${t('scorePBLabel')}: ${pb.N} ${t('scoreStrikes')}`}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 12,
          }}
        >
          <IonicButton onClick={onRetry}>{t('scoreTry')}</IonicButton>
          <IonicButton variant="ghost" onClick={onSavePng}>
            {t('scorePNG')}
          </IonicButton>
          <IonicButton variant="ghost" onClick={onShareLink}>
            {t('scoreLink')}
          </IonicButton>
        </div>
      </MuchaFrame>
    </div>
  );
}
