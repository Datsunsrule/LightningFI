import { FileText, Trash2, X } from 'lucide-react';

interface ExitDraftModalProps {
  fiNumber: string;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

export const ExitDraftModal = ({
  fiNumber,
  onSaveDraft,
  onDiscard,
  onKeepEditing,
}: ExitDraftModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onKeepEditing}
    />

    {/* Modal card */}
    <div className="relative w-full max-w-sm bg-black/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl">

      {/* Close */}
      <button
        onClick={onKeepEditing}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
      >
        <X size={16} />
      </button>

      {/* Icon + title */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <FileText size={18} className="text-amber-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Save this draft?</p>
          <p className="font-mono text-amber-400 text-xs">FI #{fiNumber}</p>
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-6">
        You have unsaved information. Save as a draft to continue later, or discard to release this FI number.
      </p>

      {/* Actions */}
      <div className="space-y-2.5">
        <button
          onClick={onSaveDraft}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-[#1a1410] font-semibold text-sm transition-colors border border-amber-300/40"
        >
          <FileText size={15} />
          Save Draft
        </button>

        <button
          onClick={onDiscard}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-sm transition-colors"
        >
          <Trash2 size={15} />
          Discard &amp; Release FI Number
        </button>

        <button
          onClick={onKeepEditing}
          className="w-full py-3 rounded-xl text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          Keep Editing
        </button>
      </div>
    </div>
  </div>
);
