import { describe, expect, it } from "vitest";
import { reconcile } from "../src/reconcile";

describe("reconcile", () => {
  it("reports a customer whose amounts differ", () => {
    const result = reconcile(
      [{ accountId: "A-1", customerName: "Acme Pharmacy", monthlyAmount: "100" }],
      [{ customer: "Acme Pharmacy", amountBilled: "150" }],
    );
    expect(result).toEqual([{ type: "amount_differs", customer: "Acme Pharmacy", crmAmount: 100, billingAmount: 150 }]);
  });

  // Task 3: add your tests below.
});
