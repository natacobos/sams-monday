// Builds a CRM export, a billing export and the list of real problems between them, from a seed.
// `npm run check` uses fresh seeds, so a solution must follow the rules in the README, not the sample files.

const BASE = [
  "Northwind Pharmacy Inc.", "Bluebird Health LLC", "Cedar Grove Clinic", "Harbor Point Medical Ltd",
  "Maple Street Pharmacy", "Summit Care Inc.", "Riverside Family Health", "Oak Valley Drugs LLC",
  "Lakeshore Wellness", "Pinecrest Medical Group", "Sunrise Senior Care Inc.", "Golden Gate Pharmacy",
  "Silver Creek Clinic LLC", "Redwood Health Partners", "Brightpath Rx", "Westfield Apothecary Ltd",
  "Evergreen Specialty Pharmacy", "Clearwater Health Inc.", "Granite State Medical", "Hillside Pediatrics LLC",
  "Meadowbrook Pharmacy", "Coastal Care Partners", "Prairie View Clinic", "Ironwood Medical Ltd",
  "Bayside Compounding", "Willow Creek Health Inc.", "Stonebridge Pharmacy", "Fairview Rx LLC",
  "Highland Family Clinic", "Crescent Health Services",
];

export function normalize(name) {
  return name.toLowerCase().replace(/[.,]/g, "").replace(/\s+/g, " ").trim().replace(/ (inc|llc|ltd)$/, "");
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The same customer, written the way the billing system writes it.
function billingName(name, rand) {
  let n = name;
  if (rand() < 0.5) n = /( Inc\.| LLC| Ltd)$/.test(n) ? n.replace(/( Inc\.| LLC| Ltd)$/, "") : n + [" Inc.", " LLC", " Ltd"][Math.floor(rand() * 3)];
  if (rand() < 0.5) n = n.replace(/[.,]/g, "");
  if (rand() < 0.4) n = n.replace(/ /g, "  ");
  const c = rand();
  if (c < 0.35) n = n.toUpperCase();
  else if (c < 0.55) n = n.toLowerCase();
  return n;
}

function money(value, rand) {
  const fixed = value.toFixed(2);
  if (rand() < 0.3) return fixed;
  const [whole, cents] = fixed.split(".");
  return "$" + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + cents;
}

const quote = (v) => (/[",]/.test(v) ? `"${v}"` : v);

export function dataset(seed) {
  const rand = rng(seed);
  const names = shuffle(BASE, rand).slice(0, 22);
  const crm = [];
  const billing = [];
  const expected = [];
  names.forEach((name, i) => {
    const amount = 200 + Math.floor(rand() * 48) * 100 + (rand() < 0.2 ? 50 : 0);
    const crmAmount = rand() < 0.5 ? String(amount) : amount.toFixed(1);
    const id = "A-" + (1000 + Math.floor(rand() * 9000));
    if (i < 3) {
      crm.push([id, name, crmAmount]);
      expected.push({ type: "missing_in_billing", key: normalize(name) });
    } else if (i < 5) {
      billing.push([billingName(name, rand), money(amount, rand)]);
      expected.push({ type: "missing_in_crm", key: normalize(name) });
    } else if (i < 8) {
      const delta = (25 + Math.floor(rand() * 16) * 25) * (rand() < 0.5 ? -1 : 1);
      crm.push([id, name, crmAmount]);
      billing.push([billingName(name, rand), money(amount + delta, rand)]);
      expected.push({ type: "amount_differs", key: normalize(name) });
    } else {
      crm.push([id, name, crmAmount]);
      billing.push([billingName(name, rand), money(amount, rand)]);
    }
  });
  const csv = (header, rows) => [header, ...shuffle(rows, rand).map((r) => r.map(quote).join(","))].join("\n") + "\n";
  return {
    crmCsv: csv("account_id,customer_name,monthly_amount", crm),
    billingCsv: csv("customer,amount_billed", billing),
    expected,
  };
}
