/** Parse MM-DD, M-D, or YYYY-MM-DD → month/day */
export function parseMonthDay(raw: string): { month: number; day: number } | null {
  const parts = raw.trim().split(/[-/]/).map((p) => p.trim());
  if (parts.length < 2) return null;

  let month: number;
  let day: number;

  if (parts.length >= 3) {
    month = parseInt(parts[1]!, 10);
    day = parseInt(parts[2]!, 10);
  } else {
    month = parseInt(parts[0]!, 10);
    day = parseInt(parts[1]!, 10);
  }

  if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { month, day };
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getNextOccurrence(month: number, day: number, from: Date = new Date()): Date {
  const year = from.getFullYear();
  let candidate = new Date(year, month - 1, day);
  if (startOfDay(candidate) < startOfDay(from)) {
    candidate = new Date(year + 1, month - 1, day);
  }
  return candidate;
}

export function formatMonthDay(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
