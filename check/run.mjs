// `npm run check`: one line per task, for the interviewer. Do not edit anything in check/.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "check", ".out");
const VITEST = join(ROOT, "node_modules", "vitest", "vitest.mjs");
const mark = (ok) => (ok ? "✓" : "✗");
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");

function vitest(args, env = {}) {
  const r = spawnSync(process.execPath, [VITEST, "run", ...args], { cwd: ROOT, env: { ...process.env, ...env }, encoding: "utf8" });
  return r;
}
function results(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).testResults.flatMap((f) => f.assertionResults);
  } catch {
    return null;
  }
}

rmSync(OUT, { recursive: true, force: true });

// Task 1: the three answers in PLAN.md
const plan = read("PLAN.md");
const prompts = ["What I will build", "What I am leaving out", "One question I would ask Sam"];
const answered = prompts.filter((p) => {
  const after = plan.split(p)[1] ?? "";
  const body = after.split("\n").slice(1).join("\n").split(/\n(?=What I|One question)/)[0];
  return body.replace(/[#\s]/g, "").length >= 10;
}).length;

// Tasks 2 and 4: the check tests
vitest(["--config", "check/vitest.config.mjs", "--reporter=json", "--outputFile", join(OUT, "check.json")]);
const t2 = existsSync(join(OUT, "task2.json")) ? JSON.parse(readFileSync(join(OUT, "task2.json"), "utf8")) : null;
const screenTests = (results(join(OUT, "check.json")) ?? []).filter((t) => !t.title.startsWith("task 2"));
const screenPassed = screenTests.filter((t) => t.status === "passed").length;

// Task 3: the candidate's tests, on their code and on the code as it was given
vitest(["tests/my-cases.test.ts", "--reporter=json", "--outputFile", join(OUT, "mine.json")]);
vitest(["tests/my-cases.test.ts", "--reporter=json", "--outputFile", join(OUT, "original.json")], { RECONCILE_IMPL: "original" });
const EXAMPLE = "reports a customer whose amounts differ";
const mine = (results(join(OUT, "mine.json")) ?? []).filter((t) => t.title !== EXAMPLE);
const onOriginal = new Map((results(join(OUT, "original.json")) ?? []).map((t) => [t.fullName, t.status]));
const allPass = mine.length > 0 && mine.every((t) => t.status === "passed");
const catching = mine.filter((t) => t.status === "passed" && onOriginal.get(t.fullName) !== "passed").length;

// TypeScript
const tsc = spawnSync(process.execPath, [join(ROOT, "node_modules", "typescript", "bin", "tsc"), "--noEmit"], { cwd: ROOT, encoding: "utf8" });
const tsErrors = (tsc.stdout.match(/error TS/g) ?? []).length;

// Fingerprint of check/, so the interviewer can see it was not edited
const hash = createHash("sha256");
for (const f of readdirSync(join(ROOT, "check")).filter((f) => f !== ".out").sort()) hash.update(f).update(readFileSync(join(ROOT, "check", f)));

const line = (label, text) => console.log(label.padEnd(20, ".") + " " + text);
console.log("\nSam's Monday — check\n");
line("T1 Plan", `${answered}/3 answers written ${mark(answered === 3)}`);
line(
  "T2 Reconcile",
  !t2 ? "did not run ✗" : t2.error ? `crashed: ${t2.error} ✗` : `found ${t2.found}/${t2.real} real problems, ${t2.falseAlarms} false alarms (3 new datasets)`,
);
line("T3 Your tests", `${mine.length} new tests, all pass: ${allPass ? "yes" : "no"}, catch the old code's mistakes: ${catching}`);
line("T4 Report screen", `${screenPassed}/3 checks ${mark(screenPassed === 3)}`);
line("TypeScript", tsErrors ? `${tsErrors} errors ✗` : "compiles ✓");
line("check files", hash.digest("hex").slice(0, 8));
console.log("");
