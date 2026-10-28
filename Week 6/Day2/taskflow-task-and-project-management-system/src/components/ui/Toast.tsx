import React from 'react';
import { useToast } from '../../hooks/useToast';
import { AlertIcon, CheckCircleIcon, CloseIcon, UndoIcon } from '../icons';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const bgStyles = {
          success: 'bg-emerald-900 text-white border-emerald-700',
          error: 'bg-rose-900 text-white border-rose-700',
          warning: 'bg-amber-900 text-white border-amber-700',
          info: 'bg-slate-900 text-white border-slate-700',
        }[toast.type];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-xl transition-all transform animate-slideUp ${bgStyles}`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircleIcon className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertIcon className="w-4 h-4 text-rose-400" />}
              {toast.type === 'warning' && <AlertIcon className="w-4 h-4 text-amber-400" />}
              {toast.type === 'info' && <CheckCircleIcon className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && <div className="text-xs font-bold mb-0.5">{toast.title}</div>}
              <div className="text-xs text-slate-100 break-words">{toast.message}</div>
            </div>

            {toast.undoAction && (
              <button
                type="button"
                onClick={() => {
                  toast.undoAction?.();
                  removeToast(toast.id);
                }}
                className="inline-flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-[11px] font-bold text-white hover:bg-white/30 cursor-pointer shrink-0 transition-colors"
              >
                <UndoIcon className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-slate-400 hover:text-white cursor-pointer shrink-0 p-0.5"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
