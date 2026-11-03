// One row of the CRM export (data/crm.csv).
export type CrmRow = {
  accountId: string;
  customerName: string;
  monthlyAmount: string; // as exported, e.g. "1200" or "1200.5"
};

// One row of the billing export (data/billing.csv).
export type BillingRow = {
  customer: string;
  amountBilled: string; // as exported, e.g. "$1,200.00"
};

export type MismatchType = "missing_in_billing" | "missing_in_crm" | "amount_differs";

export type Mismatch = {
  type: MismatchType;
  customer: string;
  crmAmount?: number;
  billingAmount?: number;
};
