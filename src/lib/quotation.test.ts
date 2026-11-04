import { describe, expect, it } from "vitest";
import { emptyQuotation, rateHistory, totals, type Quotation } from "./quotation";
import { serviceNames } from "./quote-schema";

const q = (over: Partial<Quotation> = {}): Quotation => ({ ...emptyQuotation("x"), items: [{ description: "A", qty: 2, unit: "room", rate: 10000 }, { description: "B", qty: 1, unit: "job", rate: 5000 }], ...over });

describe("quotation", () => {
  it("adds qty × rate", () => expect(totals(q()).total).toBe(25000));
  it("applies discount before 7.5% VAT", () => {
    const t = totals(q({ discount_pct: 10, vat: true }));
    expect(t.net).toBe(22500);
    expect(t.vat).toBe(1687.5);
    expect(t.total).toBe(24187.5);
  });
  it("averages past rates per item", () => {
    const h = rateHistory([q(), q({ items: [{ description: "a", qty: 1, unit: "job", rate: 20000 }] })]);
    expect(h.get("a")).toBe(15000);
  });
  it("does not offer Deep Cleaning", () => expect(serviceNames).not.toContain("Deep Cleaning"));
});
