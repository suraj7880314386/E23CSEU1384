// simple storage for viewed items

const STORAGE_KEY = "viewed_notification_ids";

export function getViewedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function markAsViewed(id: string): void {
  if (typeof window === "undefined") return;
  const ids = getViewedIds();
  ids.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function markAllAsViewed(ids: string[]): void {
  if (typeof window === "undefined") return;
  const existing = getViewedIds();
  ids.forEach((id) => existing.add(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing]));
}
