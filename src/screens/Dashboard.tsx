import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Plus, Award, FileText, MapPin, Calendar,
  ChevronRight, Star, BookOpen, X, Clock,
} from 'lucide-react';
import { Header } from '../components/Header';
import { mockDeputy, mockFIs, mockRecognitionEvents, mockStats } from '../lib/mockData';
import { formatRelativeTime } from '../lib/format';
import { getDrafts, deleteDraft, type DraftForm } from '../lib/drafts';
import type { FI, RecognitionEvent } from '../lib/types';

// ── Helpers ────────────────────────────────────────────────────────────────

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatContactDate = (dt: string): string => {
  const d = new Date(dt);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getLocationText = (fi: FI): string => {
  if (typeof fi.location === 'string') return fi.location;
  return fi.location.text;
};

// ── Shared glass panel style ───────────────────────────────────────────────
const glass =
  'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl';

// ── Sub-components ─────────────────────────────────────────────────────────

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className={`${glass} flex flex-col items-center justify-center py-4 gap-1 text-center px-2`}>
    <TrendingUp size={13} className="text-white/20 mb-1" />
    <span className="font-mono text-amber-400 text-xl font-bold leading-none">
      {value}
    </span>
    <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 leading-tight">
      {label}
    </span>
  </div>
);

const FIRow = ({ fi, onClick }: { fi: FI; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center gap-3 py-3 px-1 border-b border-white/5 last:border-0 hover:bg-white/5 active:bg-white/10 transition-colors rounded-sm"
  >
    <FileText size={16} className="text-amber-400/60 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-amber-400 text-sm font-medium">
          #{fi.fiNumber}
        </span>
        <span className="text-white/30 text-xs flex items-center gap-1">
          <Calendar size={11} />
          {formatContactDate(fi.contactDateTime)}
        </span>
      </div>
      <p className="text-white/50 text-xs truncate flex items-center gap-1 mt-0.5">
        <MapPin size={11} className="shrink-0" />
        {getLocationText(fi)}
      </p>
    </div>
    <ChevronRight size={16} className="text-white/20 shrink-0" />
  </button>
);

const RecognitionRow = ({ event }: { event: RecognitionEvent }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
    <Award size={15} className="text-amber-400 shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-white/80 text-sm leading-snug">{event.message}</p>
      <p className="text-white/30 text-xs mt-1">
        {formatRelativeTime(event.timestamp)}
      </p>
    </div>
  </div>
);

// ── Main screen ────────────────────────────────────────────────────────────

// ── Drafts panel ──────────────────────────────────────────────────────────
const DraftsPanel = ({
  drafts,
  onResume,
  onDelete,
  onClose,
}: {
  drafts: DraftForm[];
  onResume: (draft: DraftForm) => void;
  onDelete: (fiNumber: string) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full sm:max-w-sm bg-black/85 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold text-sm">Saved Drafts</p>
          <p className="text-white/40 text-xs">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
          <X size={16} />
        </button>
      </div>

      {drafts.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">No saved drafts</p>
      ) : (
        <div className="space-y-2 overflow-y-auto">
          {drafts.map((d) => (
            <div key={d.fiNumber} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-amber-400 text-sm font-medium">FI #{d.fiNumber}</p>
                <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5 truncate">
                  <Clock size={10} />
                  {d.location.text || 'No location set'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onResume(d)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium hover:bg-amber-400/20 transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => onDelete(d.fiNumber)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ── Main screen ────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const navigate = useNavigate();
  const deputy = mockDeputy;
  const [drafts, setDrafts] = useState<DraftForm[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  // Load drafts on mount and whenever panel opens
  useEffect(() => {
    setDrafts(getDrafts());
  }, [showDrafts]);

  const handleDeleteDraft = (fiNumber: string) => {
    deleteDraft(fiNumber);
    setDrafts(getDrafts());
  };

  const handleResumeDraft = (draft: DraftForm) => {
    // Navigate to NewFI with the draft pre-loaded via location state
    navigate('/fi/new', { state: { draft } });
  };

  return (
    <div className="relative min-h-screen">

      {/* Bronco background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/LightningFI/assets/bronco-bg.jpg')` }}
      />
      {/* Dark overlay — slightly lighter than login so photo reads through */}
      <div className="fixed inset-0 bg-black/60" />

      {/* Sticky header sits above everything */}
      <div className="relative z-40">
        <Header deputy={deputy} notificationCount={mockRecognitionEvents.length} />
      </div>

      {/* Scrollable content */}
      {/* Drafts panel */}
      {showDrafts && (
        <DraftsPanel
          drafts={drafts}
          onResume={handleResumeDraft}
          onDelete={handleDeleteDraft}
          onClose={() => setShowDrafts(false)}
        />
      )}

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Greeting card */}
        <div className={`${glass} px-5 py-5`}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/80 mb-1">
            Your FIs Matter
          </p>
          <h1 className="text-white text-xl font-medium">
            {getGreeting()}, {deputy.rank} {deputy.firstName}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
            &middot; Currently on Patrol &middot; {deputy.shift}
          </p>
        </div>

        {/* Action row: Drafts + New FI */}
        <div className="flex gap-3">
          {/* Drafts button */}
          <button
            onClick={() => setShowDrafts(true)}
            className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors relative"
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">Drafts</span>
            {drafts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[#1a1410] text-[10px] font-bold flex items-center justify-center">
                {drafts.length}
              </span>
            )}
          </button>

          {/* New FI CTA */}
          <button
            onClick={() => navigate('/fi/new')}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-amber-400/90 hover:bg-amber-400 active:scale-[0.98]
              backdrop-blur-xl
              text-[#1a1410] font-semibold text-base
              rounded-2xl py-4 px-6
              transition-all duration-150
              shadow-lg shadow-amber-400/20
              border border-amber-300/40
            "
          >
            <Plus size={20} />
            New Field Interview
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={mockStats.fisThisWeek} label="FIs This Week" />
          <StatCard value={mockStats.recognitionEvents} label="Recognition" />
          <StatCard value={mockStats.avgTimePerFI} label="Avg. per FI" />
          <StatCard value={mockStats.totalFIs.toLocaleString()} label="Total FIs" />
        </div>

        {/* Two-column layout on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

          {/* Recent FIs */}
          <div className="sm:col-span-3">
            <div className={`${glass} p-4`}>
              <p className="text-xs tracking-[0.3em] uppercase text-amber-400/80 mb-3">
                Recent FIs
              </p>
              {mockFIs.map((fi) => (
                <FIRow
                  key={fi.fiNumber}
                  fi={fi}
                  onClick={() => navigate(`/fi/${fi.fiNumber}`)}
                />
              ))}
            </div>
          </div>

          {/* Right column — recognition + performance */}
          <div className="sm:col-span-2 space-y-4">

            <div className={`${glass} p-4`}>
              <p className="text-xs tracking-[0.3em] uppercase text-amber-400/80 mb-3">
                Recognition
              </p>
              {mockRecognitionEvents.map((evt) => (
                <RecognitionRow key={evt.id} event={evt} />
              ))}
            </div>

            <div className={`${glass} px-4 py-4`}>
              <div className="flex items-start gap-3">
                <Star size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm leading-relaxed">
                  You're documenting{' '}
                  <span className="text-amber-400 font-medium">23% more thoroughly</span>{' '}
                  than last month. Keep it up.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="h-6" />
      </main>
    </div>
  );
};
