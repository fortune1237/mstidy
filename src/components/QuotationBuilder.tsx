import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conditionLabels, emptyQuotation, naira, scopeTemplates, totals, type Quotation } from "@/lib/quotation";
import type { QuoteRow } from "@/lib/quote-stats";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function QuotationBuilder({ row, history, onSave }: { row: QuoteRow; history: Map<string, number>; onSave: (q: Quotation) => Promise<void> }) {
  const [q, setQ] = useState<Quotation>(() => row.quotation ?? emptyQuotation(row.service));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const t = totals(q);
  const set = (p: Partial<Quotation>) => setQ({ ...q, ...p });
  const setItem = (i: number, p: Partial<Quotation["items"][number]>) => set({ items: q.items.map((it, j) => (j === i ? { ...it, ...p } : it)) });
  const ref = row.id.slice(0, 8).toUpperCase();

  async function save() {
    setSaving(true); setMsg("");
    try { await onSave({ ...q, updated_at: new Date().toISOString() }); setMsg("Quotation saved."); }
    catch { setMsg("Couldn't save — please try again."); }
    finally { setSaving(false); }
  }

  function print() {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = q.items.map((i) => `<tr><td>${esc(i.description)}</td><td>${i.qty} ${esc(i.unit)}</td><td>${naira(i.rate)}</td><td>${naira(i.qty * i.rate)}</td></tr>`).join("");
    w.document.write(`<!doctype html><title>MsTidy Quotation ${ref}</title><style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;color:#1d2b25}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}td:nth-child(n+2),th:nth-child(n+2){text-align:right}.t{text-align:right}small{color:#666}</style>
<h1>MsTidy<span style="color:#c39a4b">.</span></h1><small>Post-Construction &amp; Property Turnover Specialists · FCT, Abuja · +234 814 128 2602 · mstidycs@gmail.com</small>
<h2>Quotation ${ref}</h2><p><b>Prepared for:</b> ${esc(row.name)} · ${esc(row.phone)} · ${esc(row.email)}<br><b>Property:</b> ${esc(row.property_type)}, ${esc(row.property_location)}${q.size_sqm ? ` · ${q.size_sqm} m²` : ""} · Condition: ${conditionLabels[q.condition]}<br><b>Service:</b> ${esc(row.service)} · Preferred date ${esc(row.preferred_date)}<br><b>Date:</b> ${new Date().toLocaleDateString("en-NG")} · Valid for ${q.valid_days} days</p>
<table><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>${rows}</table>
<p class="t">Subtotal: ${naira(t.subtotal)}${t.discount ? `<br>Discount (${q.discount_pct}%): −${naira(t.discount)}` : ""}${q.vat ? `<br>VAT (7.5%): ${naira(t.vat)}` : ""}<br><b style="font-size:1.3em">Total: ${naira(t.total)}</b></p>
${q.notes ? `<p><b>Notes:</b><br>${esc(q.notes).replace(/\n/g, "<br>")}</p>` : ""}<script>onload=()=>print()</script>`);
    w.document.close();
  }

  const field = "h-9 rounded-md border bg-background px-2 text-sm";
  return (
    <div className="space-y-4 rounded-md border bg-background p-3 sm:p-4">
      <h3 className="font-serif text-lg text-foreground">Quotation builder · {ref}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-xs text-muted-foreground">Property size (m²)<Input type="number" min={0} value={q.size_sqm ?? ""} onChange={(e) => set({ size_sqm: e.target.value ? Number(e.target.value) : null })} /></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Condition<select className={field} value={q.condition} onChange={(e) => set({ condition: e.target.value as Quotation["condition"] })}>{Object.entries(conditionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="grid gap-1 text-xs text-muted-foreground">Valid for (days)<Input type="number" min={1} value={q.valid_days} onChange={(e) => set({ valid_days: Number(e.target.value) || 14 })} /></label>
      </div>

      <div className="space-y-2">
        {q.items.map((it, i) => {
          const past = history.get(it.description.trim().toLowerCase());
          return (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-2 rounded-md border p-2 sm:grid-cols-[1fr_70px_80px_120px_110px_auto] sm:items-center">
              <Input aria-label="Item" className="col-span-2 sm:col-span-1" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} />
              <Input aria-label="Quantity" type="number" min={0} value={it.qty} onChange={(e) => setItem(i, { qty: Number(e.target.value) })} />
              <Input aria-label="Unit" value={it.unit} onChange={(e) => setItem(i, { unit: e.target.value })} />
              <Input aria-label="Rate (₦)" type="number" min={0} placeholder="Rate ₦" value={it.rate || ""} onChange={(e) => setItem(i, { rate: Number(e.target.value) })} />
              <span className="text-sm text-foreground sm:text-right">{naira(it.qty * it.rate)}</span>
              <Button variant="ghost" size="sm" onClick={() => set({ items: q.items.filter((_, j) => j !== i) })} aria-label="Remove item">✕</Button>
              {past != null && past !== it.rate && <button type="button" className="col-span-2 text-left text-xs text-muted-foreground underline sm:col-span-6" onClick={() => setItem(i, { rate: past })}>Your past average for this item: {naira(past)} — use it</button>}
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => set({ items: [...q.items, { description: "", qty: 1, unit: "job", rate: 0 }] })}>Add item</Button>
          {q.condition === "heavy" && <Button variant="outline" size="sm" onClick={() => set({ items: [...q.items, { description: "Heavy residue surcharge", qty: 1, unit: "job", rate: 0 }] })}>Add heavy-residue surcharge</Button>}
          {q.items.length === 0 && scopeTemplates[row.service] && <Button variant="outline" size="sm" onClick={() => set({ items: emptyQuotation(row.service).items })}>Load {row.service} checklist</Button>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <textarea className="min-h-20 rounded-md border bg-background p-2 text-sm" placeholder="Terms or notes for the client (e.g. payment terms, what's excluded)" value={q.notes} onChange={(e) => set({ notes: e.target.value })} />
        <div className="space-y-1 text-sm sm:min-w-56">
          <label className="flex items-center justify-between gap-2">Discount %<Input className="h-8 w-20" type="number" min={0} max={100} value={q.discount_pct} onChange={(e) => set({ discount_pct: Number(e.target.value) })} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={q.vat} onChange={(e) => set({ vat: e.target.checked })} />Add VAT (7.5%)</label>
          <p className="flex justify-between text-muted-foreground"><span>Subtotal</span>{naira(t.subtotal)}</p>
          {t.discount > 0 && <p className="flex justify-between text-muted-foreground"><span>Discount</span>−{naira(t.discount)}</p>}
          {q.vat && <p className="flex justify-between text-muted-foreground"><span>VAT</span>{naira(t.vat)}</p>}
          <p className="flex justify-between font-serif text-xl text-foreground"><span>Total</span>{naira(t.total)}</p>
          {q.size_sqm ? <p className="text-xs text-muted-foreground">≈ {naira(Math.round(t.total / q.size_sqm))} per m²</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save quotation"}</Button>
        <Button variant="outline" onClick={print}>Print / save as PDF</Button>
        {msg && <span className="text-sm text-muted-foreground" role="status">{msg}</span>}
      </div>
    </div>
  );
}
