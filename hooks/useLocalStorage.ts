import { useState, type Dispatch, type SetStateAction } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        // If the initial value is an array and the parsed item is not,
        // it indicates potential data corruption. Fall back to the initial value.
        if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
          console.warn(`LocalStorage item for key "${key}" is not an array, falling back to initial value.`);
          return initialValue;
        }
        return parsedItem;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const setValue = async (value: SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;