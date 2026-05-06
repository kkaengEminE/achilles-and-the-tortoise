import { useState } from 'react';
import { MuchaFrame } from '../components/MuchaFrame';
import { IonicButton } from '../components/IonicButton';
import { useT } from '../../i18n/useT';
import type { StringKey } from '../../i18n/strings';

type Page = 'paradox' | 'achilles' | 'tortoise' | 'bertie';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ZenoModal({ open, onClose }: Props) {
  const [page, setPage] = useState<Page>('paradox');
  const t = useT();
  if (!open) return null;

  const content = pageContent(page);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 6, 3, 0.82)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 70,
        padding: 20,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 760 }}>
        <MuchaFrame style={{ padding: 'clamp(20px, 4vw, 36px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="label-tiny">{t('zenoTitle')}</div>
            <div className="divider">⚜</div>
            <h2
              style={{
                fontFamily: 'var(--serif-display)',
                fontSize: 'clamp(20px, 3vw, 26px)',
                letterSpacing: '0.18em',
                margin: '4px 0 16px',
                color: 'var(--gold-100)',
              }}
            >
              {t(content.titleKey)}
            </h2>
          </div>

          <div
            style={{
              fontFamily: 'var(--serif-body)',
              fontSize: 'clamp(14px, 1.7vw, 16px)',
              lineHeight: 1.7,
              color: 'var(--marble-100)',
              maxHeight: '50vh',
              overflowY: 'auto',
              padding: '0 4px',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
            }}
          >
            {t(content.bodyKey)}
          </div>

          <div className="divider">∞</div>

          {/* Sub-page navigation (only on paradox page) */}
          {page === 'paradox' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 10,
                marginBottom: 14,
              }}
            >
              <SubButton onClick={() => setPage('achilles')} label={t('zenoAchillesTitle')} />
              <SubButton onClick={() => setPage('tortoise')} label={t('zenoTortoiseTitle')} />
              <SubButton onClick={() => setPage('bertie')} label={t('zenoBertieTitle')} />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {page !== 'paradox' && (
              <IonicButton variant="ghost" onClick={() => setPage('paradox')}>
                ← {t('zenoBack')}
              </IonicButton>
            )}
            <IonicButton onClick={onClose}>{t('zenoClose')}</IonicButton>
          </div>
        </MuchaFrame>
      </div>
    </div>
  );
}

function SubButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 14px',
        fontFamily: 'var(--serif-display)',
        fontSize: 13,
        letterSpacing: '0.14em',
        textAlign: 'left',
        background:
          'linear-gradient(180deg, rgba(245, 239, 226, 0.04) 0%, rgba(245, 239, 226, 0) 100%)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(212, 175, 55, 0.35)',
        borderRadius: 4,
        color: 'var(--marble-100)',
        cursor: 'pointer',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(245, 217, 122, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(245, 217, 122, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          'linear-gradient(180deg, rgba(245, 239, 226, 0.04) 0%, rgba(245, 239, 226, 0) 100%)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
      }}
    >
      → {label}
    </button>
  );
}

function pageContent(page: Page): { titleKey: StringKey; bodyKey: StringKey } {
  switch (page) {
    case 'achilles':
      return { titleKey: 'zenoAchillesTitle', bodyKey: 'zenoAchillesBody' };
    case 'tortoise':
      return { titleKey: 'zenoTortoiseTitle', bodyKey: 'zenoTortoiseBody' };
    case 'bertie':
      return { titleKey: 'zenoBertieTitle', bodyKey: 'zenoBertieBody' };
    case 'paradox':
    default:
      return { titleKey: 'zenoTitle', bodyKey: 'zenoBody' };
  }
}
