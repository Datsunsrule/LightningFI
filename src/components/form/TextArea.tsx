import { type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
}

export const TextArea = ({ mono, className = '', ...props }: TextAreaProps) => (
  <textarea
    className={`
      w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5
      text-white placeholder-white/20 text-sm resize-none
      focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07]
      transition-colors
      ${mono ? 'font-mono' : ''}
      ${className}
    `}
    {...props}
  />
);
