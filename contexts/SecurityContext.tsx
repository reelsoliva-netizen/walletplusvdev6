import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthType, AuthCredential } from '../types';
import { generateSalt, hashCredential as hashCred, verifyCredential as verifyCred, getEncryptionKey, encrypt as aesEncrypt, decrypt as aesDecrypt } from '../utils/crypto';

interface SecurityContextType {
  // Balance Visibility
  isHidden: boolean;
  toggleHidden: () => void;

  // App Lock State (disabled)
  isLocked: boolean;

  // Auth Configuration
  authType: AuthType;
  setAuthType: (type: AuthType) => void;
  credential: AuthCredential | null;
  setCredential: (value: string, type: AuthType) => Promise<void>;
  verifyCredential: (value: string) => Promise<boolean>;
  // Session secret for encryption key derivation (not persisted)
  setSessionSecret: (value: string | null) => Promise<void>;

  // Encryption
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

  const [authType, setAuthTypeState] = useState<AuthType>(() => {
    try {
      return (window.localStorage.getItem('wp_auth_type') as AuthType) || 'none';
    } catch { return 'none'; }
  });
  const [credential, setCredentialState] = useState<AuthCredential | null>(() => {
    try {
      const raw = window.localStorage.getItem('wp_cred');
      return raw ? JSON.parse(raw) as AuthCredential : null;
    } catch { return null; }
  });
  const [sessionSecret, setSessionSecretState] = useState<string | null>(null);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState<boolean>(() => {
    try { return !!window.localStorage.getItem('wp_cred'); } catch { return false; }
  });

  useEffect(() => {
    window.localStorage.setItem('isBalanceHidden', JSON.stringify(isHidden));
  }, [isHidden]);

  const toggleHidden = () => setIsHidden(prev => !prev);

  const setCredential = async (value: string, type: AuthType) => {
    const salt = generateSalt();
    const hash = await hashCred(value, salt);
    const cred: AuthCredential = { type, hash, salt };
    setCredentialState(cred);
    setAuthTypeState(type);
    setIsEncryptionEnabled(true);
    try {
      window.localStorage.setItem('wp_cred', JSON.stringify(cred));
      window.localStorage.setItem('wp_auth_type', type);
    } catch {}
    // Do not persist plaintext; use session secret to enable encryption until app closes
    setSessionSecretState(value);
  };

  const setAuthType = (type: AuthType) => {
    setAuthTypeState(type);
    try { window.localStorage.setItem('wp_auth_type', type); } catch {}
  };

  const verifyCredential = async (value: string): Promise<boolean> => {
    if (!credential) return false;
    const ok = await verifyCred(value, credential.hash, credential.salt);
    if (ok) setSessionSecretState(value);
    return ok;
  };

  const setSessionSecret = async (value: string | null) => {
    setSessionSecretState(value);
  };

  const encrypt = async (text: string): Promise<string> => {
    try {
      if (!isEncryptionEnabled || !credential || !sessionSecret) return text;
      const key = await getEncryptionKey(sessionSecret, credential.salt);
      return await aesEncrypt(text, key);
    } catch {
      return text;
    }
  };

  const decrypt = async (encryptedText: string): Promise<string | null> => {
    try {
      if (!isEncryptionEnabled || !credential || !sessionSecret) return null;
      const key = await getEncryptionKey(sessionSecret, credential.salt);
      return await aesDecrypt(encryptedText, key);
    } catch {
      return null;
    }
  };

  const value = {
    isHidden,
    toggleHidden,
    isLocked: false,
    authType,
    setAuthType,
    credential,
    setCredential,
    verifyCredential,
    setSessionSecret,
    isEncryptionEnabled,
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
