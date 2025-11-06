import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthType, AuthCredential } from '../types';

interface SecurityContextType {
  // Balance Visibility
  isHidden: boolean;
  toggleHidden: () => void;

  // App Lock State (disabled)
  isLocked: boolean;

  // Auth Configuration (no-op)
  authType: AuthType;
  setAuthType: (type: AuthType) => void;
  credential: AuthCredential | null;
  setCredential: (value: string, type: AuthType) => Promise<void>;
  verifyCredential: (value: string) => Promise<boolean>;

  // Encryption (disabled - data stored in localStorage)
  isEncryptionEnabled: boolean;
  encrypt: (text: string) => Promise<string>;
  decrypt: (encryptedText: string) => Promise<string | null>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHidden, setIsHidden] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem('isBalanceHidden');
      return item ? JSON.parse(item) : false;
    } catch {
      return false;
    }
  });

  const [credential] = useState<AuthCredential | null>(null);

  useEffect(() => {
    window.localStorage.setItem('isBalanceHidden', JSON.stringify(isHidden));
    window.localStorage.removeItem('walletplus-credential');
  }, [isHidden]);

  const toggleHidden = () => setIsHidden(prev => !prev);

  const setCredential = async (_value: string, _type: AuthType) => {
    return;
  };

  const setAuthType = (_type: AuthType) => {
    return;
  };

  const verifyCredential = async (_value: string): Promise<boolean> => {
    return true;
  };

  const encrypt = async (text: string): Promise<string> => {
    return text;
  };

  const decrypt = async (encryptedText: string): Promise<string | null> => {
    return encryptedText;
  };

  const value = {
    isHidden,
    toggleHidden,
    isLocked: false,
    authType: 'none' as AuthType,
    setAuthType,
    credential,
    setCredential,
    verifyCredential,
    isEncryptionEnabled: false,
    encrypt,
    decrypt,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    // Fallback defaults when provider is not mounted (e.g., during dev)
    return {
      isHidden: false,
      toggleHidden: () => {},
      isLocked: false,
      authType: 'none' as AuthType,
      setAuthType: () => {},
      credential: null,
      setCredential: async () => {},
      verifyCredential: async () => true,
      isEncryptionEnabled: false,
      encrypt: async (text: string) => text,
      decrypt: async (encryptedText: string) => encryptedText,
    };
  }
  return context;
};
