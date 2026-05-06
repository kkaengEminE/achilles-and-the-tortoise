import { MuchaFrame } from './MuchaFrame';
import { IonicButton } from './IonicButton';
import { useT } from '../../i18n/useT';

interface Props {
  open: boolean;
  onResume: () => void;
  onQuit: () => void;
}

export function PauseModal({ open, onResume, onQuit }: Props) {
  const t = useT();
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 6, 3, 0.78)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
      }}
    >
      <MuchaFrame style={{ minWidth: 320, padding: '36px 40px', textAlign: 'center' }}>
        <div className="label-tiny">{t('pauseLabel')}</div>
        <div className="divider">⚜</div>
        <h2
          style={{
            fontFamily: 'var(--serif-display)',
            fontWeight: 600,
            margin: '0.4em 0 1.2em',
            letterSpacing: '0.2em',
            fontSize: 22,
          }}
        >
          {t('pauseTitle')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <IonicButton onClick={onResume}>{t('pauseResume')}</IonicButton>
          <IonicButton variant="ghost" onClick={onQuit}>
            {t('pauseQuit')}
          </IonicButton>
        </div>
      </MuchaFrame>
    </div>
  );
}
