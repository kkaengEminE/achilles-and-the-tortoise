import { useEffect, useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { useT } from '../../i18n/useT';
import { formatGapShort } from '../../game/scenes/ReplayScene';

interface Props {
  onContinue: () => void;
}

export function ReplayHUD({ onContinue }: Props) {
  const final = useGameStore((s) => s.final);
  const t = useT();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(1, elapsed / 6000));
      if (elapsed < 6000) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!final) return null;
  const showResult = progress >= 1;
  const gapShort = formatGapShort(final.gap);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(12px, 2vw, 24px)',
      }}
    >
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div className="label-tiny">{t('replayKicker')}</div>
        <div
          style={{
            fontFamily: 'var(--serif-display)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            letterSpacing: '0.18em',
            color: 'var(--gold-100)',
            margin: '6px 0 0',
          }}
        >
          {t('replayZooming')} {Math.round(progress * 100)}%
        </div>
      </div>

      <div style={{ textAlign: 'center', pointerEvents: 'auto', width: '100%' }}>
        {showResult ? (
          <div
            className="marble-panel"
            style={{
              display: 'inline-block',
              padding: '24px 36px',
              border: '1px solid rgba(212,175,55,0.4)',
              animation: 'fade-in 600ms ease-out',
              maxWidth: 580,
            }}
          >
            <div className="label-tiny" style={{ color: 'var(--gold-300)' }}>
              {t('replayWinner')}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 500,
                fontSize: 'clamp(22px, 3.5vw, 32px)',
                letterSpacing: '0.04em',
                color: 'var(--marble-100)',
              }}
            >
              {t('replayMargin')}{' '}
              <span style={{ color: 'var(--gold-100)', fontWeight: 600 }}>{gapShort}</span>
            </div>
            <button onClick={onContinue} className="ionic-btn" style={{ marginTop: 22 }}>
              {t('replayVerdict')}
            </button>
          </div>
        ) : (
          <div className="label-tiny" style={{ opacity: 0.6, letterSpacing: '0.4em' }}>
            {t('replayHolding')}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
