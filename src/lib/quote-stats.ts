export const quoteStatuses = ["new", "contacted", "quoted", "won", "lost"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

export type QuoteRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  property_location: string;
  service: string;
  property_type: string;
  preferred_date: string;
  description: string;
  status: string;
  notes: string | null;
};

export function filterQuotes(rows: QuoteRow[], q: string, status: string, service: string) {
  const s = q.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (service === "all" || r.service === service) &&
      (!s || [r.name, r.email, r.phone, r.property_location, r.description].some((v) => v.toLowerCase().includes(s))),
  );
}

export function countBy(rows: QuoteRow[], key: keyof QuoteRow) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(String(r[key]), (m.get(String(r[key])) ?? 0) + 1);
  return [...m].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

/** Won ÷ (won + lost), as a whole percent; null when nothing is decided yet. */
export function winRate(rows: QuoteRow[]) {
  const won = rows.filter((r) => r.status === "won").length;
  const lost = rows.filter((r) => r.status === "lost").length;
  return won + lost === 0 ? null : Math.round((won / (won + lost)) * 100);
}

export function monthly(rows: QuoteRow[]) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = r.created_at.slice(0, 7);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m].sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
}

const csvCell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export function toCsv(rows: QuoteRow[]) {
  const cols: (keyof QuoteRow)[] = ["created_at", "name", "phone", "email", "property_location", "service", "property_type", "preferred_date", "status", "notes", "description"];
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\r\n");
}
