/** GÖREV C — yksittäinen käyttö-/kiintiöpalkki (esim. ääni-AI minuutit). */
export function UsageMeter({
  label,
  used,
  unit,
  limit,
  pct,
  unlimitedLabel,
}: {
  label: string;
  used: number;
  unit: string;
  limit: number | null;
  pct: number | null;
  unlimitedLabel: string;
}) {
  const clamped = Math.min(100, pct ?? 0);
  const fillClass = pct === null ? "" : pct >= 100 ? "is-over" : pct >= 80 ? "is-warn" : "";

  return (
    <div className="usage-meter">
      <div className="usage-meter__head">
        <span>{label}</span>
        <span className="usage-meter__pct">
          {limit === null
            ? `${used.toLocaleString("fi-FI")} ${unit} · ${unlimitedLabel}`
            : `${used.toLocaleString("fi-FI")} / ${limit.toLocaleString("fi-FI")} ${unit} (${pct}%)`}
        </span>
      </div>
      {limit !== null && (
        <div className="usage-meter__track">
          <div className={`usage-meter__fill ${fillClass}`} style={{ width: `${clamped}%` }} />
        </div>
      )}
    </div>
  );
}
