import { type ReactNode } from 'react';

interface FieldLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export const FieldLabel = ({ children, htmlFor, required }: FieldLabelProps) => (
  <label
    htmlFor={htmlFor}
    className="block text-[10px] tracking-[0.3em] text-white/50 uppercase mb-1.5"
  >
    {children}
    {required && <span className="text-amber-400 ml-0.5">*</span>}
  </label>
);
