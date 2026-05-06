import { useState } from 'react';
import { isMuted, setMuted } from '../../audio/zenoSound';

export function MuteToggle() {
  const [muted, setLocal] = useState<boolean>(() => isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setLocal(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed',
        right: 14,
        bottom: 14,
        zIndex: 40,
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: 'rgba(28, 23, 12, 0.55)',
        border: '1px solid rgba(212, 175, 55, 0.45)',
        color: 'var(--gold-100)',
        fontFamily: 'var(--serif-display)',
        fontSize: 18,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      {muted ? '⊘' : '♪'}
    </button>
  );
}
