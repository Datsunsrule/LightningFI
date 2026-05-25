import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export const Card = ({ children, className = '', active = false }: CardProps) => {
  const base = active ? 'glass-card-active' : 'glass-card';
  return (
    <div className={`${base} p-4 ${className}`}>
      {children}
    </div>
  );
};
