import { useGameStore } from '../../state/gameStore';
import { IonicButton } from '../components/IonicButton';
import { useT } from '../../i18n/useT';

interface Props {
  countdown: number | null;
  onPause: () => void;
}

export function RaceHUD({ countdown, onPause }: Props) {
  const live = useGameStore((s) => s.live);
  const isHorizon = live.phase === 'EVENT_HORIZON';
  const t = useT();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        padding: 'clamp(12px, 2vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div className="marble-panel" style={panelStyle}>
          <div className="label-tiny">{t('hudSigma')}</div>
          <div
            style={{
              fontFamily: 'var(--serif-display)',
              fontSize: 32,
              letterSpacing: '0.05em',
              color: 'var(--gold-100)',
            }}
          >
            {live.N}
          </div>
        </div>
        <div className="marble-panel" style={{ ...panelStyle, textAlign: 'right' }}>
          <div className="label-tiny">{t('hudPos')}</div>
          <div
            style={{
              fontFamily: 'var(--sans-mono)',
              fontSize: 18,
              color: 'var(--marble-100)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPos(live.achillesPos, live.N)} <span style={{ opacity: 0.6 }}>m</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--sans-mono)',
              fontSize: 12,
              opacity: 0.7,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {t('hudGap')} = {live.gapStr}
          </div>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <IonicButton variant="ghost" onClick={onPause} aria-label={t('hudPause')}>
            ❚❚
          </IonicButton>
        </div>
      </div>

      <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
        {countdown !== null && (
          <div
            style={{
              fontFamily: 'var(--serif-display)',
              fontSize: 'clamp(80px, 18vw, 200px)',
              color: 'var(--gold-100)',
              textShadow: '0 0 40px rgba(245,217,122,0.4)',
              letterSpacing: '0.05em',
              animation: 'cd-pulse 800ms ease-out',
            }}
          >
            {countdown === 0 ? t('hudGo') : countdown}
          </div>
        )}
        {isHorizon && countdown === null && (
          <div
            style={{
              color: 'var(--gold-300)',
              fontFamily: 'var(--serif-display)',
              letterSpacing: '0.4em',
              fontSize: 13,
              textTransform: 'uppercase',
              opacity: 0.85,
              animation: 'horizon-flicker 2s ease-in-out infinite',
            }}
          >
            {t('hudHorizon')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 24 }}>
        <div className="label-tiny" style={{ opacity: 0.7 }}>
          {t('hudTortoise')} · {live.tortoisePos.toFixed(2)} m
        </div>
        <div className="label-tiny" style={{ color: 'var(--gold-300)' }}>
          {t('hudFinish')}
        </div>
      </div>
      <style>{`
        @keyframes cd-pulse {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes horizon-flicker {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const panelStyle = {
  padding: '10px 16px',
  border: '1px solid rgba(212,175,55,0.35)',
  borderRadius: 6,
  pointerEvents: 'none' as const,
  minWidth: 120,
};

function formatPos(pos: number, sigmaN: number): string {
  const decimals = Math.min(12, Math.max(2, Math.floor(sigmaN / 5) + 2));
  return pos.toFixed(decimals);
}
