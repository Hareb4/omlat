const STORAGE_KEY = "omlat.openrouter.apiKey";

let memoryKey = "";

export function getClientApiKey(): string {
  if (memoryKey) return memoryKey;
  if (typeof window === "undefined") return "";
  memoryKey = window.sessionStorage.getItem(STORAGE_KEY) || "";
  return memoryKey;
}

export function setClientApiKey(key: string): void {
  memoryKey = key.trim();
  if (typeof window === "undefined") return;
  if (memoryKey) {
    window.sessionStorage.setItem(STORAGE_KEY, memoryKey);
    return;
  }
  window.sessionStorage.removeItem(STORAGE_KEY);
}
