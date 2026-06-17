import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full no-print">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-500 shrink-0" />
  };

  const bgColors = {
    success: 'bg-white dark:bg-slate-900 border-l-4 border-emerald-500',
    error: 'bg-white dark:bg-slate-900 border-l-4 border-rose-500',
    warning: 'bg-white dark:bg-slate-900 border-l-4 border-amber-500',
    info: 'bg-white dark:bg-slate-900 border-l-4 border-cyan-500'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg border border-slate-150
        dark:border-slate-800/80 card-shadow dark:card-shadow-dark ${bgColors[toast.type]}
      `}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm text-slate-800 dark:text-slate-205 pr-2 pt-0.5 leading-relaxed font-medium">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-605 dark:hover:text-slate-300 p-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors duration-150"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
