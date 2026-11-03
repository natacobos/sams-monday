import type { BillingRow, CrmRow } from "./types";

// Minimal CSV reader: a header line, then rows; fields may be wrapped in double quotes.
function parse(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let current = "";
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        fields.push(current);
        current = "";
      } else current += ch;
    }
    fields.push(current);
    rows.push(fields);
  }
  return rows.slice(1);
}

export function parseCrm(text: string): CrmRow[] {
  return parse(text).map(([accountId, customerName, monthlyAmount]) => ({ accountId, customerName, monthlyAmount }));
}

export function parseBilling(text: string): BillingRow[] {
  return parse(text).map(([customer, amountBilled]) => ({ customer, amountBilled }));
}
