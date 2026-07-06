/** Sekunden als m:ss bzw. h:mm:ss formatieren. */
export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${sec}`;
  return `${m}:${sec}`;
}

/** Lokaler Datums-Schlüssel, z. B. "2026-07-06" (nicht UTC!). */
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function yesterdayKey() {
  return dateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
}
