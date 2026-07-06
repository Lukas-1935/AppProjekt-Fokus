import { useEffect, useState } from 'react';

/**
 * useState mit localStorage-Persistenz.
 * Gespeicherte Werte werden über die Defaults gemerged, damit neue
 * Felder nach App-Updates nicht verloren gehen.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      if (
        typeof defaultValue === 'object' &&
        defaultValue !== null &&
        !Array.isArray(defaultValue)
      ) {
        return { ...defaultValue, ...parsed };
      }
      return parsed;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Speicher voll oder blockiert – App läuft dann ohne Persistenz weiter.
    }
  }, [key, value]);

  return [value, setValue];
}
