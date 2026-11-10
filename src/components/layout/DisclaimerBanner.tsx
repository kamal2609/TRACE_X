import React, { useState } from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { translations } from '../../i18n';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { language } = useUiStore();
  const t = translations[language];

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200/90 flex items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-2 overflow-hidden">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] shrink-0">
          Forensic Demonstration Mode:
        </span>
        <span className="truncate">
          {t.disclaimer}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline-block text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-600/40">
          Synthetic Ground Truth v2.4
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400/80 hover:text-amber-200 p-0.5 rounded hover:bg-amber-900/50"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
