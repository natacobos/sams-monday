// Task 4 check: renders your ReportView with fixed data. Do not edit.
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ReportView } from "../src/ui/ReportView";
import type { Mismatch } from "../src/types";

afterEach(cleanup);

const all: Mismatch[] = [
  { type: "missing_in_billing", customer: "Cedar Grove Clinic", crmAmount: 900 },
  { type: "missing_in_billing", customer: "Summit Care Inc.", crmAmount: 1200 },
  { type: "missing_in_crm", customer: "BRIGHTPATH RX", billingAmount: 450 },
  { type: "amount_differs", customer: "Lakeshore Wellness", crmAmount: 700, billingAmount: 750 },
];

it("shows one heading per problem type, with its count, and lists each customer", () => {
  render(<ReportView mismatches={all} />);
  screen.getByRole("heading", { name: /missing in billing \(2\)/i });
  screen.getByRole("heading", { name: /missing in crm \(1\)/i });
  screen.getByRole("heading", { name: /amount differs \(1\)/i });
  for (const m of all) expect(screen.getAllByText(new RegExp(m.customer.replace(/[.]/g, "\\."), "i")).length).toBeGreaterThan(0);
});

it("hides a problem type that has no problems", () => {
  render(<ReportView mismatches={[all[3]]} />);
  screen.getByRole("heading", { name: /amount differs \(1\)/i });
  expect(screen.queryByRole("heading", { name: /missing in billing/i })).toBeNull();
  expect(screen.queryByRole("heading", { name: /missing in crm/i })).toBeNull();
});

it("shows 'All records match' when there are no problems", () => {
  render(<ReportView mismatches={[]} />);
  screen.getByText(/all records match/i);
});
