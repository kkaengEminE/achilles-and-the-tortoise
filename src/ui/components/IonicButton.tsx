import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost';
}

export function IonicButton({ variant = 'solid', className = '', children, ...rest }: Props) {
  const cls = `ionic-btn ${variant === 'ghost' ? 'ionic-btn--ghost' : ''} ${className}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
