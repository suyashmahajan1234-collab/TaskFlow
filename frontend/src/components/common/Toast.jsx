import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useTasks();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-elevated transition-all animate-in slide-in-from-bottom-2 ${
              isError
                ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                : isSuccess
                ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-200 text-zinc-100 dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

