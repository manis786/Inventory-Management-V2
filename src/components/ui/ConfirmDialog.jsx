import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, primary
  loading = false
}) {
  const accentColors = {
    danger: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    primary: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
  };

  const buttonVariants = {
    danger: 'danger',
    warning: 'warning',
    primary: 'primary'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`p-3 rounded-full mb-4 ${accentColors[type]}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-805 dark:text-slate-100 mb-2">
          {title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
