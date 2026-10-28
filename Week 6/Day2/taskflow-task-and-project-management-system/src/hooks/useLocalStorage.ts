import { useState, useEffect } from 'react';
import { safeLocalStorage } from '../services/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeLocalStorage.get<T>(key, initialValue);
  });

  useEffect(() => {
    safeLocalStorage.set<T>(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
