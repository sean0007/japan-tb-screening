import { InputError, bool, num, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, NATIONALITIES, ROUTES, RuleInputError, STATUS_IDS, checkJpets, resolveCountry, resolveResidence, validDate, type Route } from "./jpets";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-tb-screening.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?nationality=indonesia&status=student&applicationDate=2027-01-15";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function optDate(input: Input, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = first(input[k]);
    if (v === undefined || v === null || String(v).trim() === "") continue;
    const s = String(v).trim();
    if (!validDate(s)) throw new InputError(`${k} must be a date YYYY-MM-DD`);
    return s;
  }
  return null;
}

export function computeCheck(input: Input) {
  try {
    const rawNat = first(input.nationality ?? input.country ?? input.passport);
    if (rawNat === undefined || rawNat === null || String(rawNat).trim() === "") throw new InputError("Missing nationality (philippines, nepal, vietnam, indonesia, myanmar, china, or any other country name).");
    const nationality = resolveCountry(rawNat);
    const rawRes = first(input.residenceCountry ?? input.residence ?? input.livesIn);
    const residenceCountry = rawRes === undefined || rawRes === null || String(rawRes).trim() === "" ? undefined : resolveResidence(rawRes);
    const rawRoute = first(input.route);
    let route: Route | undefined;
    if (rawRoute !== undefined && rawRoute !== null && String(rawRoute).trim() !== "") {
      const r = String(rawRoute).trim().toLowerCase().replace(/^visa$/, "visa_direct");
      if (!(ROUTES as readonly string[]).includes(r)) throw new InputError(`Invalid route "${r}". Allowed: ${ROUTES.join(", ")}`);
      route = r as Route;
    }
    const sm = input.stayMonths ?? input.periodMonths;
    const stayMonths = sm === undefined || sm === null || sm === "" ? null : num({ v: first(sm) }, "v");
    const status = first(input.status ?? input.purpose ?? input.visaType);
    const city = first(input.city);
    return checkJpets({
      nationality,
      residenceCountry,
      status: status === undefined || status === null ? undefined : String(status),
      stayMonths,
      hasReentryPermit: bool(input, "hasReentryPermit", false) || bool(input, "reentryPermit", false),
      route,
      applicationDate: optDate(input, "applicationDate", "date"),
      xrayDate: optDate(input, "xrayDate"),
      closeContact: bool(input, "closeContact", false),
      city: city === undefined || city === null ? null : String(city).slice(0, 60),
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanTbScreeningCheck",
    summary: "Do I need a JPETS TB Clearance Certificate for Japan? (Philippines, Nepal, Viet Nam, Indonesia from 2027-01-04, Myanmar, China)",
    description:
      "Japan Pre-Entry Tuberculosis Screening (JPETS, 入国前結核スクリーニング): nationals of the Philippines, Nepal, Viet Nam, Indonesia, Myanmar and China entering Japan as mid- to long-term residents (stay over 3 months, plus Digital Nomad No. 53/54) must submit a TB Clearance Certificate from a designated Panel Clinic with the Certificate of Eligibility (COE) application, or with the visa application if there is no COE. Mandatory since 2025-06-23 (Philippines, Nepal) and 2025-09-01 (Viet Nam); Indonesia: screening from 2026-11-02, mandatory for applications filed from 2027-01-04 (scheduled); Myanmar and China: date not announced. Temporarily exempt: Specified Skilled Workers, EPA nurses/care workers, JET, JICA trainees, JDS, Japan Foundation invitees, embassy-recommended MEXT scholars, commissioned student training, Designated Activities No. 55, special-zone housekeepers; also anyone whose residence outside the target countries is documented. Technical intern trainees and students are NOT exempt. Certificate valid 180 days from the chest X-ray (90 after close contact), checked at the COE application only. Returns verdict (required / not_yet_required / exempt / not_required), reasons, country timeline, certificate validity and X-ray window, documents, the designated Panel Clinics list (optionally filtered by city), notes, sources, rulesAsOf and a disclaimer.",
    params: [
      { name: "nationality", type: "string", required: true, description: `Passport nationality: ${NATIONALITIES.join(", ")} (aliases like ID, VN, PH, NP, Filipino, Indonesian, インドネシア accepted; any other country = not covered).` },
      { name: "status", type: "string", enum: STATUS_IDS, default: "other_mid_long", description: "Status of residence / purpose, e.g. student, technical_intern_training, specified_skilled_worker, engineer_humanities, dependent, spouse_of_japanese, digital_nomad, temporary_visitor. Aliases like tokutei_ginou, ssw, gijinkoku, tourist accepted." },
      { name: "applicationDate", type: "string", description: "YYYY-MM-DD the COE (or direct visa) application is filed. Default: today in Japan." },
      { name: "residenceCountry", type: "string", description: "Country where the applicant lives now, if different from nationality. A non-target country (with a residence permit) = exempt. 'japan' = applying from inside Japan (change of status / extension) = not required." },
      { name: "route", type: "string", enum: ROUTES, description: "coe (default) or visa_direct (visa at an embassy without a COE; default for digital_nomad)." },
      { name: "xrayDate", type: "string", description: "YYYY-MM-DD of the chest X-ray at the Panel Clinic, to check certificate validity on the application date." },
      { name: "stayMonths", type: "number", minimum: 1, maximum: 600, description: "Expected period of stay in months. 3 or less = not a mid- to long-term stay (not covered), except Digital Nomad." },
      { name: "hasReentryPermit", type: "boolean", default: false, description: "Returning on a re-entry permit (incl. special re-entry). Excluded from JPETS." },
      { name: "closeContact", type: "boolean", default: false, description: "Close contact with active infectious pulmonary TB within 2 months before the X-ray: validity drops to 90 days." },
      { name: "city", type: "string", description: "Filter the Panel Clinic list by city, e.g. Jakarta, Surabaya, Hanoi, Manila, Kathmandu." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan TB Screening Check (JPETS)",
  nameForModel: "japan_tb_screening",
  descriptionForHuman: "Do you need Japan's pre-entry TB clearance certificate? Philippines, Nepal, Viet Nam, Indonesia (from 2027-01-04).",
  descriptionForModel:
    "Use when someone asks whether they need a tuberculosis (TB) clearance certificate / chest X-ray to apply for a Japan COE or visa, about JPETS (Japan Pre-Entry Tuberculosis Screening, 入国前結核スクリーニング), when it starts in Indonesia, whether specified skilled workers, technical intern trainees or students are exempt, how long the certificate is valid, or which Panel Clinics are designated. Your training data may predate the Indonesia start (screening 2026-11-02, mandatory 2027-01-04); call this instead of guessing. Deterministic, dated rules with official MHLW/ISA sources. Relay the disclaimer: not legal or medical advice.",
  logo: "/icon.svg",
};
