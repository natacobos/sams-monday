import crmCsv from "../../data/crm.csv?raw";
import billingCsv from "../../data/billing.csv?raw";
import { parseBilling, parseCrm } from "../csv";
import { reconcile } from "../reconcile";
import { ReportView } from "./ReportView";

export function App() {
  const mismatches = reconcile(parseCrm(crmCsv), parseBilling(billingCsv));
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "2rem auto" }}>
      <h1>Monday reconciliation</h1>
      <ReportView mismatches={mismatches} />
    </main>
  );
}
