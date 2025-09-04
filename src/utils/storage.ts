const safeGet = (k: string) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const safeSet = (k: string, v: any) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const loadCache = <T>(key: string): T | null => safeGet(key);
export const saveCache = (key: string, value: any) => safeSet(key, value);

export const saveSettings = (key = 'converter_settings', payload: any) =>
  saveCache(key, payload);
export const loadSettings = (key = 'converter_settings') => loadCache<any>(key);
