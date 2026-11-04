import { describe, expect, it } from "vitest";
import { filterQuotes, toCsv, winRate, type QuoteRow } from "./quote-stats";

const row = (o: Partial<QuoteRow>): QuoteRow => ({
  id: "1", created_at: "2026-10-01T00:00:00Z", name: "Ada", phone: "+234", email: "a@x.com",
  property_location: "Wuse", service: "Post-Renovation Cleaning", property_type: "House", preferred_date: "2026-11-01",
  description: "Full clean", status: "new", notes: null, ...o,
});

describe("quote stats", () => {
  it("win rate counts only won vs lost", () => {
    expect(winRate([row({ status: "won" }), row({ status: "lost" }), row({ status: "lost" }), row({ status: "new" })])).toBe(33);
    expect(winRate([row({})])).toBeNull();
  });
  it("filters by status and search text", () => {
    const rows = [row({ id: "a", status: "won", property_location: "Maitama" }), row({ id: "b" })];
    expect(filterQuotes(rows, "maitama", "all", "all").map((r) => r.id)).toEqual(["a"]);
    expect(filterQuotes(rows, "", "new", "all").map((r) => r.id)).toEqual(["b"]);
  });
  it("neutralises spreadsheet formulas in CSV", () => {
    expect(toCsv([row({ name: "=HACK()" })])).toContain(`"'=HACK()"`);
  });
});
