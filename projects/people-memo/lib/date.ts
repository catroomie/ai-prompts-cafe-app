function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// "MM-DD" から今日以降で一番近い誕生日までの日数を返す（今日なら0）
export function daysUntilBirthday(
  mmdd: string,
  today: Date = new Date()
): number | null {
  const match = /^(\d{2})-(\d{2})$/.exec(mmdd);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const t = startOfDay(today);
  let next = startOfDay(new Date(t.getFullYear(), month - 1, day));
  if (next < t) {
    next = startOfDay(new Date(t.getFullYear() + 1, month - 1, day));
  }
  return Math.round((next.getTime() - t.getTime()) / 86_400_000);
}

// "YYYY-MM-DD" から今日まで何日経ったか
export function daysSince(dateStr: string, today: Date = new Date()): number {
  const t = startOfDay(today);
  const d = startOfDay(new Date(dateStr));
  return Math.round((t.getTime() - d.getTime()) / 86_400_000);
}
