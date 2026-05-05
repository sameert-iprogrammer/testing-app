import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface ToastDisplayProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastDisplay
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastDisplay({ message, type, onDismiss }: ToastDisplayProps): React.ReactElement {
  const bgClass = type === 'success'
    ? 'bg-emerald-600'
    : 'bg-rose-600';

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 right-4 z-50 ${bgClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm transition-opacity duration-300 opacity-100`}
    >
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-white/80 hover:text-white transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
