// Task 2 check: runs your reconcile() on new datasets and counts what it found. Do not edit.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { parseBilling, parseCrm } from "../src/csv";
import { reconcile } from "../src/reconcile";
import { dataset, normalize } from "./generate.mjs";

it("task 2 on new datasets", () => {
  let real = 0;
  let found = 0;
  let falseAlarms = 0;
  let error = "";
  for (const seed of [101, 202, 303]) {
    const { crmCsv, billingCsv, expected } = dataset(seed);
    real += expected.length;
    try {
      const got = reconcile(parseCrm(crmCsv), parseBilling(billingCsv));
      const want = new Set(expected.map((e: { type: string; key: string }) => e.type + "|" + e.key));
      const seen = new Set<string>();
      for (const m of got) {
        const k = m.type + "|" + normalize(m.customer ?? "");
        if (want.has(k) && !seen.has(k)) {
          found++;
          seen.add(k);
        } else falseAlarms++;
      }
    } catch (e) {
      error = String(e).slice(0, 120);
    }
  }
  const out = join(process.cwd(), "check", ".out");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "task2.json"), JSON.stringify({ real, found, falseAlarms, error }));
});
