import React from 'react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirm',
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="text-2xl font-bold text-light-900 mb-4">{title}</h2>}
        <p className="text-sm text-light-800 mb-6">{message}</p>
        <div className="flex gap-4 pt-2">
          <button type="button" onClick={onCancel} className="w-full p-3 bg-dark-700 text-light-900 font-bold rounded-lg">{cancelText}</button>
          <button type="button" onClick={onConfirm} className="w-full p-3 bg-primary text-dark-900 font-bold rounded-lg">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

