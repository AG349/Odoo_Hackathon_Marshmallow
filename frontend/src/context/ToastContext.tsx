import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../utils';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((title: string, description?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = {
              success: CheckCircle,
              warning: AlertTriangle,
              error: XCircle,
              info: Info,
            }[t.type];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                className={cn(
                  "pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-card p-4 shadow-premium dark:shadow-dark-premium select-none border-border/85"
                )}
              >
                <div className={cn(
                  "rounded-lg p-1.5 shrink-0",
                  t.type === 'success' && "bg-emerald-500/10 text-emerald-500",
                  t.type === 'warning' && "bg-amber-500/10 text-amber-500",
                  t.type === 'error' && "bg-rose-500/10 text-rose-500",
                  t.type === 'info' && "bg-indigo-500/10 text-indigo-500"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                  {t.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                  )}
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  className="rounded-lg p-1 text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export type { ToastType };
