/** Pienet muotoiluapurit mock-datalle. */

export function timeAgo(iso: string, locale: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  const fi = locale.startsWith("fi");
  if (min < 1) return fi ? "juuri nyt" : "just now";
  if (min < 60) return fi ? `${min} min sitten` : `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return fi ? `${h} h sitten` : `${h} h ago`;
  const d = Math.round(h / 24);
  return fi ? `${d} pv sitten` : `${d} d ago`;
}

export function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreClass(score: number): string {
  if (score >= 70) return "score score--hi";
  if (score >= 40) return "score score--mid";
  return "score score--lo";
}
