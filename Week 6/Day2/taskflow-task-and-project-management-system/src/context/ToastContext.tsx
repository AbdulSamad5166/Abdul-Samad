import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { generateId } from '../utils/id';

interface ToastOptions {
  title?: string;
  duration?: number;
  undoAction?: () => void;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', options?: ToastOptions): string => {
      const id = generateId('toast');
      const duration = options?.duration ?? 4500;

      const newToast: ToastMessage = {
        id,
        message,
        type,
        title: options?.title,
        duration,
        undoAction: options?.undoAction,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => showToast(message, 'success', options),
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => showToast(message, 'error', options),
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => showToast(message, 'info', options),
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
    [showToast]
  );

  const value: ToastContextType = {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
