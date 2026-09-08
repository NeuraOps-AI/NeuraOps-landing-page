const DAY_MS = 86_400_000;
const INDIA_OFFSET_MS = 19_800_000;
const FIRST_DAY = Date.UTC(2026, 8, 7);

/** A shared daily identity, anchored to 7 September 2026 in Asia/Kolkata. */
export function logoForDate(date: Date): number {
  const day = Math.floor((date.getTime() + INDIA_OFFSET_MS) / DAY_MS);
  const firstDay = Math.floor(FIRST_DAY / DAY_MS);
  return ((day - firstDay) % 4 + 4) % 4 + 1;
}

export function millisecondsUntilBrandChange(date: Date): number {
  const localTime = date.getTime() + INDIA_OFFSET_MS;
  return DAY_MS - ((localTime % DAY_MS + DAY_MS) % DAY_MS);
}
