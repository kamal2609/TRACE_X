import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let border = 'border-cyan-500/40 bg-slate-900/95 text-cyan-200';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

        if (toast.type === 'danger') {
          border = 'border-rose-500/60 bg-rose-950/95 text-rose-100 shadow-lg shadow-rose-950/50';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          border = 'border-amber-500/50 bg-amber-950/95 text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'success') {
          border = 'border-emerald-500/50 bg-emerald-950/95 text-emerald-100';
          icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3.5 flex items-start gap-3 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${border}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold uppercase tracking-wider">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
