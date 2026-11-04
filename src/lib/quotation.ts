export type LineItem = { description: string; qty: number; unit: string; rate: number };
export type Quotation = {
  items: LineItem[];
  size_sqm: number | null;
  condition: "light" | "standard" | "heavy";
  discount_pct: number;
  vat: boolean;
  valid_days: number;
  notes: string;
  updated_at?: string;
};

export const VAT_RATE = 0.075; // Nigerian VAT
export const conditionLabels = { light: "Light", standard: "Standard", heavy: "Heavy (extra residue)" } as const;

/** Scope checklists per service — descriptions only; the owner sets every price. */
export const scopeTemplates: Record<string, string[]> = {
  "Post-Construction Cleaning": ["Construction dust & debris removal", "Cement, plaster & paint residue removal", "Window, frame & glass detailing", "Floor scrubbing & finishing", "Fixtures, fittings & sanitary ware detailing"],
  "Post-Renovation Cleaning": ["Renovation dust removal (all surfaces)", "Paint & adhesive mark removal", "Protective covering removal", "Fixtures & fittings detailing", "Floor cleaning & finishing"],
  "Property Transition Cleaning (Move-In/Move-Out)": ["Kitchen cabinets & appliances (inside/out)", "Bathrooms & sanitary ware sanitising", "Wardrobes, shelves & storage", "Windows & glass", "Floors & skirting"],
  "Fumigation Services": ["Site inspection & pest identification", "Interior treatment", "Exterior / perimeter treatment", "Preparation & re-entry guidance"],
};

export function emptyQuotation(service: string): Quotation {
  return {
    items: (scopeTemplates[service] ?? []).map((description) => ({ description, qty: 1, unit: "job", rate: 0 })),
    size_sqm: null, condition: "standard", discount_pct: 0, vat: false, valid_days: 14, notes: "",
  };
}

export function totals(q: Quotation) {
  const subtotal = q.items.reduce((s, i) => s + Math.max(0, i.qty) * Math.max(0, i.rate), 0);
  const pct = Math.min(100, Math.max(0, q.discount_pct));
  const discount = Math.round(subtotal * pct) / 100;
  const net = subtotal - discount;
  const vat = q.vat ? Math.round(net * VAT_RATE * 100) / 100 : 0;
  return { subtotal, discount, net, vat, total: net + vat };
}

export const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

/** Average past rate per line description, from the owner's own saved quotations. */
export function rateHistory(quotations: (Quotation | null | undefined)[]) {
  const m = new Map<string, { sum: number; n: number }>();
  for (const q of quotations) for (const i of q?.items ?? []) {
    if (i.rate <= 0) continue;
    const k = i.description.trim().toLowerCase();
    const v = m.get(k) ?? { sum: 0, n: 0 };
    m.set(k, { sum: v.sum + i.rate, n: v.n + 1 });
  }
  return new Map([...m].map(([k, v]) => [k, Math.round(v.sum / v.n)]));
}

/** Average quoted total and count per service, for pricing insight. */
export function serviceInsights(rows: { service: string; status: string; quotation: Quotation | null }[]) {
  const m = new Map<string, { total: number; n: number; won: number }>();
  for (const r of rows) {
    if (!r.quotation?.items?.length) continue;
    const t = totals(r.quotation).total;
    if (t <= 0) continue;
    const v = m.get(r.service) ?? { total: 0, n: 0, won: 0 };
    m.set(r.service, { total: v.total + t, n: v.n + 1, won: v.won + (r.status === "won" ? 1 : 0) });
  }
  return [...m].map(([service, v]) => ({ service, quotes: v.n, average: Math.round(v.total / v.n), won: v.won }));
}
