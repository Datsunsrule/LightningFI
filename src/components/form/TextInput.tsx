import { type InputHTMLAttributes, type ReactNode } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  mono?: boolean;
}

export const TextInput = ({ icon, mono, className = '', ...props }: TextInputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5
          text-white placeholder-white/20 text-sm
          focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07]
          transition-colors
          ${icon ? 'pl-9' : ''}
          ${mono ? 'font-mono' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
