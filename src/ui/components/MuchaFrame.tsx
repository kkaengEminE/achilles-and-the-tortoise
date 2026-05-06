import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function MuchaFrame({ children, style, className = '' }: Props) {
  return (
    <div className={`an-frame ${className}`} style={style}>
      <div className="an-frame-tr" />
      <div className="an-frame-bl" />
      {children}
    </div>
  );
}
