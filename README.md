# Sam's Monday

Every Monday, Sam spends five hours comparing two exports, `data/crm.csv` and `data/billing.csv`, for a leadership report. A colleague started a tool for it, `src/reconcile.ts`, but its report "never looks right".

Not problems (the same customer or amount, written differently):
- Names may differ in capital letters, spaces, periods, commas, and a trailing Inc, LLC or Ltd: `Summit Care Inc.` = `SUMMIT  CARE`.
- `$1,200.00` = `1200.00` = `1200`.

Real problems, to report:
- A customer in only one file (`missing_in_billing`, `missing_in_crm`).
- The same customer with a different amount (`amount_differs`).

## Setup

Node 20 or newer: `npm install`, then `npm test` (1 passed). `npm run check` shows your progress; run it as often as you like.

## Your tasks

Use your usual AI tools. Share your whole screen and think out loud. The tasks are independent: if one gets stuck, move on.

1. Plan (2 minutes). In `PLAN.md`: what you will build, what you will leave out and why, one question for Sam.
2. Reconcile (6 minutes). Fix `reconcile()` so it reports the real problems and nothing else. The check runs it on new files.
3. Your tests (3 minutes). In `tests/my-cases.test.ts`, add two tests that would catch a mistake of the original code or of your AI tool.
4. Report screen (3 minutes). In `src/ui/ReportView.tsx` (React and TypeScript): one heading per problem type that has problems, with its count, like "Missing in billing (2)", and its customers listed below; with no problems, "All records match".

Do not edit `check/`. At the end, run `npm run check`.
