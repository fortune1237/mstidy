import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { serviceNames } from "@/lib/quote-schema";
import { QuotationBuilder } from "@/components/QuotationBuilder";
import { naira, rateHistory, serviceInsights, type Quotation } from "@/lib/quotation";
import { countBy, filterQuotes, monthly, quoteStatuses, toCsv, winRate, type QuoteRow } from "@/lib/quote-stats";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Client quotes dashboard | MsTidy" },
      { name: "description", content: "Private MsTidy dashboard for client quote requests." },
      { property: "og:title", content: "Client quotes dashboard | MsTidy" },
      { property: "og:description", content: "Private MsTidy dashboard for client quote requests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const admin = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      return !!data;
    },
  });
  const quotes = useQuery({
    queryKey: ["quotes"],
    enabled: admin.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as (QuoteRow & { quotation: Quotation | null })[];
    },
  });

  const rows = quotes.data ?? [];
  const shown = useMemo(() => filterQuotes(rows, q, status, service), [rows, q, status, service]);

  const history = useMemo(() => rateHistory(rows.map((r) => r.quotation)), [rows]);
  const insights = useMemo(() => serviceInsights(rows), [rows]);
  async function saveQuotation(id: string, quotation: Quotation) {
    const { error } = await supabase.from("quote_requests").update({ quotation: quotation as never }).eq("id", id);
    if (error) throw error;
    qc.invalidateQueries({ queryKey: ["quotes"] });
  }
  async function setRow(id: string, patch: { status?: string; notes?: string }) {
    await supabase.from("quote_requests").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["quotes"] });
  }
  function exportCsv() {
    const blob = new Blob(["\uFEFF" + toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mstidy-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const header = (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
      <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Client quotes</h1>
      <div className="flex gap-2">
        {admin.data && <Button variant="outline" onClick={exportCsv}>Export CSV</Button>}
        <Button variant="ghost" onClick={signOut}>Sign out</Button>
      </div>
    </header>
  );

  if (admin.isLoading) return <main className="p-6 text-muted-foreground">Loading…</main>;
  if (!admin.data)
    return (
      <main className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
        {header}
        <p className="text-muted-foreground">This account doesn't have access. Sign in with the MsTidy business email after confirming it.</p>
      </main>
    );

  const rate = winRate(rows);
  const stats = [
    { label: "Total quotes", value: rows.length },
    { label: "New", value: rows.filter((r) => r.status === "new").length },
    { label: "Won", value: rows.filter((r) => r.status === "won").length },
    { label: "Win rate", value: rate == null ? "—" : `${rate}%` },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {header}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-serif text-3xl text-foreground">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 font-medium text-foreground">Quotes per month</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthly(rows)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 font-medium text-foreground">By service</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={countBy(rows, "service")} dataKey="value" nameKey="name" outerRadius={80} label={({ value }) => value}>
                  {countBy(rows, "service").map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-2 font-medium text-foreground">Pricing insights from your quotations</h2>
        {insights.length === 0 ? <p className="text-sm text-muted-foreground">Open a client below and build a quotation — averages per service will appear here.</p> : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{insights.map((i) => (
            <div key={i.service} className="rounded-md border p-3"><p className="text-xs text-muted-foreground">{i.service}</p><p className="font-serif text-xl text-foreground">{naira(i.average)}</p><p className="text-xs text-muted-foreground">avg of {i.quotes} quotation{i.quotes > 1 ? "s" : ""} · {i.won} won</p></div>
          ))}</div>
        )}
      </section>

      <section className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search name, phone, email, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Status" className="h-10 rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select aria-label="Service" className="h-10 rounded-md border bg-background px-3 text-sm" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="all">All services</option>
          {serviceNames.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </section>

      <section className="space-y-2">
        {quotes.isLoading && <p className="text-muted-foreground">Loading quotes…</p>}
        {!quotes.isLoading && shown.length === 0 && <p className="text-muted-foreground">No quotes match.</p>}
        {shown.map((r) => (
          <article key={r.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button className="min-w-0 text-left" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <p className="font-medium text-foreground">{r.name} · <span className="text-muted-foreground">{r.service}</span></p>
                <p className="text-sm text-muted-foreground">{r.property_location} · {new Date(r.created_at).toLocaleDateString()} · wants {r.preferred_date}</p>
              </button>
              <select aria-label={`Status for ${r.name}`} className="h-9 rounded-md border bg-background px-2 text-sm" value={r.status} onChange={(e) => setRow(r.id, { status: e.target.value })}>
                {quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {open === r.id && (
              <div className="mt-3 space-y-2 border-t pt-3 text-sm">
                <p><a className="underline" href={`tel:${r.phone}`}>{r.phone}</a> · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a> · {r.property_type}</p>
                <p className="whitespace-pre-wrap text-foreground">{r.description}</p>
                <textarea
                  defaultValue={r.notes ?? ""}
                  placeholder="Private notes (saved when you click away)"
                  className="w-full rounded-md border bg-background p-2"
                  onBlur={(e) => e.target.value !== (r.notes ?? "") && setRow(r.id, { notes: e.target.value })}
                />
                <QuotationBuilder row={r} history={history} onSave={(qt) => saveQuotation(r.id, qt)} />
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
