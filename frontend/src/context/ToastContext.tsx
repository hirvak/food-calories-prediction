import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastContainer key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = ({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) => {
  let bgColor = 'bg-white border-slate-200 text-slate-800';
  let iconColor = 'text-blue-500';
  let IconComponent = Info;

  if (toast.type === 'success') {
    bgColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
    iconColor = 'text-emerald-500';
    IconComponent = CheckCircle2;
  } else if (toast.type === 'error') {
    bgColor = 'bg-rose-50 border-rose-200 text-rose-900';
    iconColor = 'text-rose-500';
    IconComponent = AlertCircle;
  } else if (toast.type === 'warning') {
    bgColor = 'bg-amber-50 border-amber-200 text-amber-900';
    iconColor = 'text-amber-500';
    IconComponent = AlertTriangle;
  }

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 transform translate-y-0 animate-slide-in ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <IconComponent className={`w-4 h-4 ${iconColor}`} />
        <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
