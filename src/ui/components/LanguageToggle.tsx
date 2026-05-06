import { useLangStore } from '../../i18n/useT';

export function LanguageToggle() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  const baseStyle: React.CSSProperties = {
    width: 38,
    height: 30,
    fontFamily: 'var(--serif-display)',
    fontSize: 12,
    letterSpacing: '0.18em',
    background: 'transparent',
    border: '1px solid rgba(212, 175, 55, 0.45)',
    color: 'var(--marble-100)',
    cursor: 'pointer',
    transition: 'background 120ms ease',
  };
  const activeStyle: React.CSSProperties = {
    background: 'rgba(245, 217, 122, 0.18)',
    color: 'var(--gold-100)',
    borderColor: 'rgba(245, 217, 122, 0.65)',
  };

  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        position: 'fixed',
        top: 14,
        right: 14,
        zIndex: 60,
        display: 'flex',
        background: 'rgba(28, 23, 12, 0.55)',
        backdropFilter: 'blur(4px)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setLang('ko')}
        style={{
          ...baseStyle,
          ...(lang === 'ko' ? activeStyle : null),
          borderRight: 'none',
        }}
      >
        KO
      </button>
      <button onClick={() => setLang('en')} style={{ ...baseStyle, ...(lang === 'en' ? activeStyle : null) }}>
        EN
      </button>
    </div>
  );
}
