import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertIcon } from '../icons';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-1">
        {isDestructive && (
          <div className="rounded-full bg-rose-100 p-2 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
            <AlertIcon className="w-5 h-5" />
          </div>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
};
