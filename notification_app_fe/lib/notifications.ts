/**
 * Notification types and API utilities
 */

export type NotificationType = "Event" | "Result" | "Placement";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "";
}

const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

export async function fetchNotifications(params: FetchParams = {}): Promise<Notification[]> {
  const url = new URL(BASE_URL);

  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.notification_type) url.searchParams.set("notification_type", params.notification_type);

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const data: NotificationsResponse = await res.json();
    return applyFilters(data.notifications ?? [], params);
  } catch (err) {
    // Return mock data if the API is blocked or offline (e.g. company firewall)
    console.warn("API unavailable or blocked, falling back to mock data.", err);
    return applyFilters(MOCK_NOTIFICATIONS, params);
  }
}

// Helper to apply API parameters to mock data locally
function applyFilters(notifications: Notification[], params: FetchParams): Notification[] {
  let filtered = [...notifications];
  if (params.notification_type) {
    filtered = filtered.filter(n => n.Type === params.notification_type);
  }
  
  // Sort descending by timestamp before pagination
  filtered.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

  if (params.page && params.limit) {
    const start = (params.page - 1) * params.limit;
    return filtered.slice(start, start + params.limit);
  } else if (params.limit) {
    return filtered.slice(0, params.limit);
  }
  return filtered;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:51:30" },
  { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
  { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
  { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:50:54" },
  { ID: "ea836726-c25e-4f21-a72f-544a6af8a37f", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
  { ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c", Type: "Result", Message: "external", Timestamp: "2026-04-22 17:50:30" },
  { ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:18" },
  { ID: "1cfce5ee-ad37-4894-8946-d707627176a5", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:50:06" },
  { ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
  { ID: "8a7412bd-6065-4d09-8501-a37f11cc848b", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" },
  { ID: "9a7412bd-6065-4d09-8501-a37f11cc848c", Type: "Placement", Message: "Google hiring for Software Engineer", Timestamp: "2026-04-23 10:00:00" },
  { ID: "1b7412bd-6065-4d09-8501-a37f11cc848d", Type: "Event", Message: "Annual Sports Meet", Timestamp: "2026-04-23 11:30:00" },
  { ID: "2c7412bd-6065-4d09-8501-a37f11cc848e", Type: "Result", Message: "Final Semester Results Published", Timestamp: "2026-04-24 09:15:00" },
  { ID: "3d7412bd-6065-4d09-8501-a37f11cc848f", Type: "Placement", Message: "Amazon On-Campus Drive", Timestamp: "2026-04-24 14:00:00" },
  { ID: "4e7412bd-6065-4d09-8501-a37f11cc8490", Type: "Event", Message: "Guest Lecture on AI", Timestamp: "2026-04-25 10:00:00" }
];

// Priority Score calculation for priority view
export const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

export interface ScoredNotification extends Notification {
  _priorityScore: number;
  _recencyBonus: number;
}

export function computeTopN(notifications: Notification[], n: number): ScoredNotification[] {
  if (!notifications.length) return [];

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
  );
  const total = sorted.length;

  const scored: ScoredNotification[] = sorted.map((notif, idx) => {
    const recencyBonus = (total - idx) * 10;
    const typeWeight = TYPE_WEIGHTS[notif.Type as NotificationType] ?? 0;
    return { ...notif, _recencyBonus: recencyBonus, _priorityScore: typeWeight + recencyBonus };
  });

  scored.sort((a, b) => {
    if (b._priorityScore !== a._priorityScore) return b._priorityScore - a._priorityScore;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });

  return scored.slice(0, n);
}
