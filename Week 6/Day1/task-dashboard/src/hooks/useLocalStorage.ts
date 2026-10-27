import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
) {
  // Lazy initializer: storage sirf pehli render par read hota hai, har render par nahi
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue, isValid))

  // Jab bhi value badle, storage me save ho jaye
  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}