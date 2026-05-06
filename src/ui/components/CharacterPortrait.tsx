interface Props {
  kind: 'achilles' | 'tortoise';
  size?: number;
}

/**
 * Inline SVG portraits for the intro character cards. Stylised as Greek statues
 * inside an Art Nouveau medallion frame.
 */
export function CharacterPortrait({ kind, size = 100 }: Props) {
  if (kind === 'achilles') return <AchillesPortrait size={size} />;
  return <TortoisePortrait size={size} />;
}

function AchillesPortrait({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Achilles bust"
    >
      <defs>
        <radialGradient id="ach-marble" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#fef9eb" />
          <stop offset="60%" stopColor="#efe6cf" />
          <stop offset="100%" stopColor="#b9a978" />
        </radialGradient>
        <linearGradient id="ach-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c0" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a7b3a" />
        </linearGradient>
      </defs>

      {/* Subtle halo */}
      <circle cx="50" cy="50" r="46" fill="url(#ach-gold)" opacity="0.07" />

      {/* Helmet plume — Corinthian crest */}
      <path
        d="M 28 28 Q 36 6, 50 18 Q 64 6, 72 28 Q 70 32, 60 30 Q 56 22, 52 30 Q 48 22, 44 30 Q 36 32, 28 28 Z"
        fill="url(#ach-gold)"
        stroke="#8a7b3a"
        strokeWidth="0.8"
      />
      {/* Helmet body */}
      <path
        d="M 32 30 Q 32 46, 44 50 L 56 50 Q 68 46, 68 30 Q 60 36, 50 36 Q 40 36, 32 30 Z"
        fill="#6b5524"
        stroke="#8a7b3a"
        strokeWidth="0.8"
      />
      {/* Helmet cheek-piece */}
      <path
        d="M 38 42 Q 40 55, 46 56 L 46 50 Q 42 48, 38 42 Z"
        fill="#8a7b3a"
      />
      <path
        d="M 62 42 Q 60 55, 54 56 L 54 50 Q 58 48, 62 42 Z"
        fill="#8a7b3a"
      />

      {/* Face — marble */}
      <ellipse cx="50" cy="52" rx="10" ry="13" fill="url(#ach-marble)" stroke="#b9a978" strokeWidth="0.6" />
      {/* Brow shadow */}
      <path d="M 42 49 Q 50 47, 58 49" stroke="#b9a978" strokeWidth="0.5" fill="none" />
      {/* Eyes (statue blank) */}
      <ellipse cx="46" cy="52" rx="1.4" ry="0.7" fill="#3a2f12" />
      <ellipse cx="54" cy="52" rx="1.4" ry="0.7" fill="#3a2f12" />
      {/* Nose */}
      <path d="M 50 52 L 49.5 58 L 51 58 Z" fill="#b9a978" opacity="0.55" />
      {/* Lips */}
      <path d="M 47 62 Q 50 64, 53 62" stroke="#8a7b3a" strokeWidth="0.6" fill="none" />

      {/* Neck */}
      <path d="M 45 65 L 45 72 L 55 72 L 55 65 Z" fill="url(#ach-marble)" />
      {/* Drapery (chiton) shoulders */}
      <path
        d="M 30 88 Q 30 78, 42 74 L 58 74 Q 70 78, 70 88 L 30 88 Z"
        fill="url(#ach-marble)"
        stroke="#b9a978"
        strokeWidth="0.5"
      />
      {/* Drapery folds */}
      <path d="M 38 88 L 40 78" stroke="#b9a978" strokeWidth="0.5" />
      <path d="M 46 88 L 47 76" stroke="#b9a978" strokeWidth="0.5" />
      <path d="M 54 88 L 53 76" stroke="#b9a978" strokeWidth="0.5" />
      <path d="M 62 88 L 60 78" stroke="#b9a978" strokeWidth="0.5" />

      {/* Brooch */}
      <circle cx="50" cy="76" r="2.2" fill="url(#ach-gold)" stroke="#8a7b3a" strokeWidth="0.5" />

      {/* Frame ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ach-gold)" strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

function TortoisePortrait({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Leopard tortoise"
    >
      <defs>
        <radialGradient id="tort-shell" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#a68744" />
          <stop offset="60%" stopColor="#6b5a2c" />
          <stop offset="100%" stopColor="#3a2f12" />
        </radialGradient>
        <linearGradient id="tort-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c0" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a7b3a" />
        </linearGradient>
      </defs>

      {/* Subtle halo */}
      <circle cx="50" cy="50" r="46" fill="url(#tort-gold)" opacity="0.07" />

      {/* Ground line */}
      <ellipse cx="50" cy="80" rx="34" ry="3" fill="#1c170c" opacity="0.6" />

      {/* Body / shell */}
      <path
        d="M 18 70 Q 18 38, 50 30 Q 82 38, 82 70 Q 60 78, 50 78 Q 40 78, 18 70 Z"
        fill="url(#tort-shell)"
        stroke="#3a2f12"
        strokeWidth="1"
      />
      {/* Highlight */}
      <path
        d="M 28 56 Q 50 42, 72 56"
        stroke="#a68744"
        strokeWidth="1"
        fill="none"
        opacity="0.85"
      />

      {/* Leopard scutes (hexagonal patches) */}
      {scutes.map((s, i) => (
        <g key={i} transform={`translate(${s.x},${s.y})`}>
          <polygon
            points="-5,-2.4 -3,-5.2 3,-5.2 5,-2.4 3,2 -3,2"
            fill="#a68744"
            stroke="#3a2f12"
            strokeWidth="0.6"
          />
          <polygon points="-2,-1 -1,-2.6 1,-2.6 2,-1 1,0.4 -1,0.4" fill="#3a2f12" />
        </g>
      ))}

      {/* Front legs */}
      <rect x="22" y="68" width="8" height="11" rx="2" fill="#9c8650" stroke="#3a2f12" strokeWidth="0.6" />
      <rect x="70" y="68" width="8" height="11" rx="2" fill="#9c8650" stroke="#3a2f12" strokeWidth="0.6" />
      {/* Toenails */}
      <rect x="23" y="78" width="2" height="1.5" fill="#fef3c0" />
      <rect x="26" y="78" width="2" height="1.5" fill="#fef3c0" />
      <rect x="71" y="78" width="2" height="1.5" fill="#fef3c0" />
      <rect x="74" y="78" width="2" height="1.5" fill="#fef3c0" />

      {/* Head & neck */}
      <path
        d="M 78 60 Q 90 56, 90 50 Q 90 44, 84 44 Q 76 44, 74 52 Q 74 58, 78 60 Z"
        fill="#9c8650"
        stroke="#3a2f12"
        strokeWidth="0.8"
      />
      {/* Head pattern */}
      <path d="M 80 50 Q 84 48, 88 50" stroke="#5e4d28" strokeWidth="0.6" fill="none" />
      {/* Eye */}
      <circle cx="86" cy="49" r="1.1" fill="#3a2f12" />
      <circle cx="86.3" cy="48.8" r="0.4" fill="#fef3c0" />
      {/* Nose dots */}
      <circle cx="89.5" cy="50.5" r="0.4" fill="#3a2f12" />

      {/* Frame ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#tort-gold)" strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

const scutes = [
  { x: 35, y: 50 },
  { x: 50, y: 46 },
  { x: 65, y: 50 },
  { x: 28, y: 60 },
  { x: 42, y: 58 },
  { x: 58, y: 58 },
  { x: 72, y: 60 },
];
