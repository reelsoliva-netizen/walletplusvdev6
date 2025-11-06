import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

interface PrivacyContextType {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        title: opts.title || 'Confirm',
        message: opts.message,
        confirmText: opts.confirmText || 'OK',
        cancelText: opts.cancelText || 'Cancel',
      });
      setResolver(() => resolve);
    });
  }, []);

  const handleCancel = () => {
    resolver?.(false);
    setDialog(null);
    setResolver(null);
  };

  const handleConfirm = () => {
    resolver?.(true);
    setDialog(null);
    setResolver(null);
  };

  return (
    <PrivacyContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog
          isOpen={true}
          title={dialog.title || 'Confirm'}
          message={dialog.message}
          cancelText={dialog.cancelText || 'Cancel'}
          confirmText={dialog.confirmText || 'OK'}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = (): PrivacyContextType => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

