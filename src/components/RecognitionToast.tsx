import { useEffect } from 'react';
import { Award, X } from 'lucide-react';

interface RecognitionToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export const RecognitionToast = ({ message, onDismiss, duration = 4000 }: RecognitionToastProps) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm">
      <div className="glass-card border-amber-400/40 p-4 flex items-start gap-3 shadow-2xl">
        <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-white/90 flex-1">{message}</p>
        <button onClick={onDismiss} className="text-white/40 hover:text-white/70 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
