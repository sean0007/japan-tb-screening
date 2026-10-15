import { NATIONALITIES, STATUS_IDS, VERDICT_LABEL, validDate, type CheckInput, type Nationality, type Verdict } from "./jpets";

export const PUBLIC_URL = "https://japan-tb-screening.vercel.app";

/** Share links: /r?n=indonesia&s=student&d=2027-01-15[&x=YYYY-MM-DD][&live=other][&v=1] */
type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

export type Shared = { nationality: Nationality; status: string; applicationDate: string; xrayDate: string | null; residence: "same" | "other" | "japan"; visaDirect: boolean };

export const EXAMPLE_SHARED: Shared = { nationality: "indonesia", status: "student", applicationDate: "2027-01-15", xrayDate: null, residence: "same", visaDirect: false };
export const EXAMPLE_SSW: Shared = { nationality: "indonesia", status: "specified_skilled_worker", applicationDate: "2027-01-15", xrayDate: null, residence: "same", visaDirect: false };

export function parseShared(p: Params): Shared | null {
  const n = one(p, "n") ?? one(p, "nationality");
  if (!n || !(NATIONALITIES as readonly string[]).includes(n)) return null;
  const s = one(p, "s") ?? one(p, "status") ?? "other_mid_long";
  if (!STATUS_IDS.includes(s)) return null;
  const d = one(p, "d") ?? one(p, "applicationDate");
  if (!d || !validDate(d) || d < "2025-01-01" || d > "2030-12-31") return null;
  const x = one(p, "x") ?? one(p, "xrayDate");
  const live = one(p, "live");
  const residence = live === "other" || live === "japan" ? live : "same";
  return { nationality: n as Nationality, status: s, applicationDate: d, xrayDate: x && validDate(x) && x >= "2024-01-01" && x <= "2030-12-31" ? x : null, residence, visaDirect: one(p, "v") === "1" };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("n", s.nationality);
  q.set("s", s.status);
  q.set("d", s.applicationDate);
  if (s.xrayDate) q.set("x", s.xrayDate);
  if (s.residence !== "same") q.set("live", s.residence);
  if (s.visaDirect) q.set("v", "1");
  return q.toString();
}

export function toCheckInput(s: Shared): CheckInput {
  return {
    nationality: s.nationality,
    status: s.status,
    applicationDate: s.applicationDate,
    xrayDate: s.xrayDate,
    residenceCountry: s.residence === "same" ? undefined : s.residence,
    route: s.visaDirect ? "visa_direct" : undefined,
  };
}

export const resultPath = (s: Shared) => `/r?${sharedQuery(s)}`;
export const ogPath = (s: Shared) => `/og?${sharedQuery(s)}`;
export const isIndexable = (s: Shared) => [EXAMPLE_SHARED, EXAMPLE_SSW].some((e) => sharedQuery(e) === sharedQuery(s));

export const NATIONALITY_LABEL: Record<Nationality, string> = {
  philippines: "Philippines",
  nepal: "Nepal",
  vietnam: "Viet Nam",
  indonesia: "Indonesia",
  myanmar: "Myanmar",
  china: "China",
  other: "Other country",
};

export const VERDICT_SHORT: Record<Verdict, string> = {
  required: "Required",
  not_yet_required: "Not yet",
  exempt: "Exempt",
  not_required: "Not covered",
};
export const VERDICT_COLOR: Record<Verdict, string> = {
  required: "#fca5a5",
  not_yet_required: "#f0b429",
  exempt: "#99f6e4",
  not_required: "#99f6e4",
};
export { VERDICT_LABEL };

export function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
