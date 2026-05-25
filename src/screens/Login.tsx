import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { TextInput } from '../components/form/TextInput';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}assets/bronco-bg.jpg')` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Eyebrow */}
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6">
          Your FIs Matter
        </p>

        {/* Glass card */}
        <div className="glass-card p-8">
          {/* Wordmark */}
          <div className="text-center mb-2">
            <Logo size="lg" />
          </div>

          {/* Tagline */}
          <p className="text-center text-white/40 text-xs tracking-wide mb-8">
            Your Field Interviews Matter
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <TextInput
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User size={16} />}
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>

            <div>
              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="
                w-full flex items-center justify-center gap-2
                bg-amber-400 hover:bg-amber-300
                text-[#1a1410] font-semibold
                rounded-lg py-3 px-4 mt-2
                transition-colors duration-150
                active:scale-[0.98]
              "
            >
              Authenticate
              <ChevronRight size={16} />
            </button>
          </form>

          {/* Footer text */}
          <p className="text-center text-white/20 text-[11px] mt-6 leading-relaxed">
            Field Interview Module
          </p>
        </div>
      </div>
    </div>
  );
};
