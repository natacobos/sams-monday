import type { Mismatch } from "../types";

type Props = { mismatches: Mismatch[] };

// Placeholder: shows the raw data. Sam's manager can't read this.
export function ReportView({ mismatches }: Props) {
  return <pre>{JSON.stringify(mismatches, null, 2)}</pre>;
}
