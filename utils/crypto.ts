// --- ADVANCED CRYPTOGRAPHY UTILS ---
// This implementation uses the browser's built-in Web Crypto API for strong, standardized cryptography.
// It provides secure password hashing (PBKDF2), key derivation, and authenticated encryption (AES-GCM).

// --- CONSTANTS ---
const ENCRYPTION_PREFIX = 'wp_enc_v1::';

// --- HELPERS ---

// Helper to convert ArrayBuffer to a Base64 string.
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Helper to convert a Base64 string back to an ArrayBuffer.
const base64ToBuffer = (b64: string): ArrayBuffer => {
  const byteString = atob(b64);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper to encode a string to a Uint8Array buffer.
const textToBuffer = (text: string): Uint8Array => new TextEncoder().encode(text);


// --- HASHING & KEY DERIVATION ---

// Generates a cryptographically secure random salt.
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return bufferToBase64(array.buffer);
};

// Creates a strong hash of a credential for verification purposes.
export const hashCredential = async (credential: string, salt: string): Promise<string> => {
    const saltBuffer = base64ToBuffer(salt);
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw', textToBuffer(credential), { name: 'PBKDF2' }, false, ['deriveBits']
    );

    const hashBuffer = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 250000, // High iteration count for password hashing
            hash: 'SHA-512',
        },
        keyMaterial,
        512 // Output length in bits
    );
    return bufferToBase64(hashBuffer);
};

// Verifies a credential attempt against a stored hash and salt.
export const verifyCredential = async (credential: string, hash: string, salt: string): Promise<boolean> => {
  const newHash = await hashCredential(credential, salt);
  return newHash === hash;
};

// Derives a CryptoKey for AES-GCM encryption from the user's credential and salt.
export const getEncryptionKey = async (credential: string, salt: string): Promise<CryptoKey> => {
  const saltBuffer = base64ToBuffer(salt);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    textToBuffer(credential),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000, // Standard iteration count for key derivation
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// --- ENCRYPTION & DECRYPTION ---

// Encrypts text using AES-GCM. Returns a prefixed Base64 string.
export const encrypt = async (text: string, key: CryptoKey): Promise<string> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes is recommended for AES-GCM
  const encodedText = textToBuffer(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedText
  );

  // Combine IV and ciphertext for storage
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return `${ENCRYPTION_PREFIX}${bufferToBase64(combined.buffer)}`;
};

// Decrypts data. Expects a prefixed Base64 string. Handles non-prefixed data by returning null.
export const decrypt = async (encryptedText: string, key: CryptoKey): Promise<string | null> => {
  if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.startsWith(ENCRYPTION_PREFIX)) {
    return null;
  }

  const base64Data = encryptedText.substring(ENCRYPTION_PREFIX.length);

  try {
    const combinedBuffer = base64ToBuffer(base64Data);
    
    // IV is 12 bytes, GCM auth tag is 16 bytes. Minimum length check.
    if (combinedBuffer.byteLength < 28) {
        console.error('Decryption failed: The provided data is too small.');
        return null;
    }

    const iv = combinedBuffer.slice(0, 12);
    const ciphertext = combinedBuffer.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed. This can happen if the wrong key is used or data is corrupt.', error);
    return null;
  }
};