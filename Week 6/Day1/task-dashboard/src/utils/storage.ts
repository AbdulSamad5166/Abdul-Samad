// localStorage se safely read karna. JSON.parse crash kar sakta hai agar data corrupt ho,
// is liye try/catch + validation (isValid) dono use kiye.
export function readStorage<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full ya private mode: app crash nahi honi chahiye
  }
}