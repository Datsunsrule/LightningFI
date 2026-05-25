import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import type { Deputy } from '../lib/types';

interface HeaderProps {
  deputy: Deputy;
  notificationCount?: number;
}

export const Header = ({ deputy, notificationCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          {/* Deputy info */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white/90">
              {deputy.rank} {deputy.name}
            </p>
            <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
              #{deputy.badge}
            </p>
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-lg text-white/50 hover:text-amber-400 hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Log out */}
          <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
