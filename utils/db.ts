// Minimal IndexedDB wrapper for Wallet+ local persistence
// Stores a single key 'appData' in object store 'kv'.

const DB_NAME = 'walletplus';
const STORE_NAME = 'kv';

type TxMode = 'readonly' | 'readwrite';

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const withStore = async <T>(mode: TxMode, fn: (store: IDBObjectStore) => Promise<T> | T): Promise<T> => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    Promise.resolve(fn(store))
      .then((res) => {
        tx.oncomplete = () => resolve(res);
        tx.onerror = () => reject(tx.error);
      })
      .catch(reject);
  });
};

export const loadAppData = async (): Promise<string | null> => {
  try {
    return await withStore('readonly', (store) => {
      return new Promise<string | null>((resolve, reject) => {
        const req = store.get('appData');
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  } catch {
    return null;
  }
};

export const saveAppData = async (data: string): Promise<void> => {
  await withStore('readwrite', (store) => {
    return new Promise<void>((resolve, reject) => {
      const req = store.put(data, 'appData');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
};

export const clearAppData = async (): Promise<void> => {
  await withStore('readwrite', (store) => {
    return new Promise<void>((resolve, reject) => {
      const req = store.delete('appData');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
};

