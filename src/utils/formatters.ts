export function upper(v?: string | null) {
  return (v ?? "").toUpperCase();
}

export function formatCNPJDisplay(raw?: string | null) {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
    8,
    12
  )}-${d.slice(12, 14)}`;
}

export function formatPhoneDisplay(raw?: string | null) {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  const dd = d.slice(0, 2),
    r = d.slice(2);
  if (d.length <= 2) return `(${dd}`;
  if (d.length <= 6) return `(${dd}) ${r}`;
  if (d.length <= 10) return `(${dd}) ${r.slice(0, 4)}-${r.slice(4)}`;
  return `(${dd}) ${r.slice(0, 5)}-${r.slice(5)}`;
}
