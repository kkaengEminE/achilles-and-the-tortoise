import { useState } from 'react';
import { MuchaFrame } from '../components/MuchaFrame';
import { IonicButton } from '../components/IonicButton';
import { ZenoModal } from './ZenoModal';
import { useT } from '../../i18n/useT';
import { CharacterPortrait } from '../components/CharacterPortrait';

interface Props {
  onStart: () => void;
}

export function IntroScreen({ onStart }: Props) {
  const t = useT();
  const [zenoOpen, setZenoOpen] = useState(false);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        pointerEvents: 'auto',
        overflow: 'auto',
      }}
    >
      <MuchaFrame
        style={{
          maxWidth: 920,
          width: '100%',
          padding: 'clamp(24px, 5vw, 48px)',
          textAlign: 'center',
        }}
      >
        <div className="label-tiny">{t('introKicker')}</div>
        <h1
          style={{
            fontFamily: 'var(--serif-display)',
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            margin: '0.3em 0 0.1em',
            background: 'linear-gradient(180deg,#fef3c0 0%,#d4af37 60%,#8a7b3a 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {t('introTitle')}
        </h1>
        <div className="divider">{t('introCitation')}</div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            margin: '32px auto',
            maxWidth: 760,
          }}
        >
          <CharacterCard
            name={t('achillesName')}
            tagline={t('achillesTagline')}
            kind="achilles"
          />
          <CharacterCard
            name={t('tortoiseName')}
            tagline={t('tortoiseTagline')}
            kind="tortoise"
          />
        </div>

        <p
          style={{
            maxWidth: 580,
            margin: '0 auto 22px',
            opacity: 0.85,
            fontSize: 'clamp(14px, 1.7vw, 17px)',
            lineHeight: 1.6,
            fontStyle: 'italic',
            color: 'var(--marble-100)',
          }}
        >
          {t('introDescription')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <IonicButton onClick={onStart}>{t('introBegin')}</IonicButton>
          <IonicButton variant="ghost" onClick={() => setZenoOpen(true)}>
            {t('introWhat')}
          </IonicButton>
        </div>

        <p
          style={{
            marginTop: 18,
            color: 'var(--gold-700)',
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          {t('introInputHint')}
        </p>
      </MuchaFrame>

      <ZenoModal open={zenoOpen} onClose={() => setZenoOpen(false)} />
    </div>
  );
}

function CharacterCard({
  name,
  tagline,
  kind,
}: {
  name: string;
  tagline: string;
  kind: 'achilles' | 'tortoise';
}) {
  return (
    <div
      className="marble-panel"
      style={{
        padding: 20,
        border: '1px solid rgba(212,175,55,0.35)',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          margin: '0 auto 12px',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 60%), radial-gradient(circle, #2c2618 0%, #110d07 100%)',
          border: '1px solid rgba(212,175,55,0.45)',
          boxShadow: '0 0 18px rgba(212,175,55,0.18)',
          overflow: 'hidden',
        }}
      >
        <CharacterPortrait kind={kind} size={108} />
      </div>
      <div
        style={{
          fontFamily: 'var(--serif-display)',
          fontWeight: 600,
          letterSpacing: '0.12em',
          fontSize: 14,
        }}
      >
        {name}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, opacity: 0.7 }}>{tagline}</div>
    </div>
  );
}
