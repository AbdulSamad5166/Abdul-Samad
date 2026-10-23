import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  productTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  productTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Product"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-xs leading-relaxed">
            Are you sure you want to delete <span className="font-semibold">"{productTitle}"</span>? This action simulates a DELETE request to DummyJSON.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete Product
          </Button>
        </div>
      </div>
    </Modal>
  );
}
