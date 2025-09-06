const safeGet = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const safeSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const loadCache = <T>(key: string): T | null => safeGet<T>(key);
export const saveCache = <T>(key: string, value: T): void => safeSet<T>(key, value);

export const saveSettings = <T = unknown>(key = 'converter_settings', payload: T): void =>
  saveCache<T>(key, payload);

export const loadSettings = <T = unknown>(key = 'converter_settings'): T | null =>
  loadCache<T>(key);
