import type { BillingRow, CrmRow, Mismatch } from "./types";

// First version, written by a colleague in a hurry. Sam says the report "never looks right".
export function reconcile(crm: CrmRow[], billing: BillingRow[]): Mismatch[] {
  const result: Mismatch[] = [];
  const billed = new Map(billing.map((b) => [b.customer, Number(b.amountBilled)]));

  for (const c of crm) {
    const crmAmount = Number(c.monthlyAmount);
    const billingAmount = billed.get(c.customerName);
    if (billingAmount === undefined) {
      result.push({ type: "missing_in_billing", customer: c.customerName, crmAmount });
    } else if (billingAmount !== crmAmount) {
      result.push({ type: "amount_differs", customer: c.customerName, crmAmount, billingAmount });
    }
  }
  return result;
}
