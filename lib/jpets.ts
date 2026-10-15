// Japan Pre-Entry Tuberculosis Screening (JPETS, 入国前結核スクリーニング).
// Pure functions + a dated rules table. Dates are ISO YYYY-MM-DD in Japan time.
// Sources: ISA/MOFA/MHLW Guideline (revised 2026-09-25), JPETS Q&A, ISA page 10_00219, MHLW page.

import { CLINICS, CLINICS_AS_OF, CLINICS_SOURCE, type Clinic } from "./clinics";

export const RULES_AS_OF = "2026-10-15";

export const DISCLAIMER =
  "Educational guide, not immigration, legal or medical advice. Based on the Japanese government's JPETS guideline and Q&A as of the date shown; dates marked 'scheduled' can move. The Immigration Services Agency, the Japanese embassy or consulate, and the designated Panel Clinic decide your case. Not affiliated with MHLW, ISA, MOFA or any clinic.";

export const SOURCES = [
  "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou03/english.html",
  "https://www.mhlw.go.jp/content/001469441.pdf",
  "https://www.mhlw.go.jp/content/001469448.pdf",
  "https://www.moj.go.jp/isa/10_00219.html",
  "https://jpets.mhlw.go.jp/",
  "https://www.jpets.mhlw.go.jp/doc/260925.pdf",
  CLINICS_SOURCE,
] as const;

export const TARGET_COUNTRIES = ["philippines", "nepal", "vietnam", "indonesia", "myanmar", "china"] as const;
export type TargetCountry = (typeof TARGET_COUNTRIES)[number];
export const NATIONALITIES = [...TARGET_COUNTRIES, "other"] as const;
export type Nationality = (typeof NATIONALITIES)[number];

export type CountryRule = {
  id: TargetCountry;
  name: string;
  nameJa: string;
  /** Panel Clinics start accepting JPETS screenings. null = not yet announced. */
  screeningStart: string | null;
  /** COE / visa applications filed on or after this date must include the TB Clearance Certificate. */
  mandatoryFrom: string | null;
  scheduled: boolean;
  note: string;
};

export const COUNTRIES: Record<TargetCountry, CountryRule> = {
  philippines: { id: "philippines", name: "Philippines", nameJa: "フィリピン", screeningStart: "2025-03-24", mandatoryFrom: "2025-06-23", scheduled: false, note: "In force since 2025-06-23." },
  nepal: { id: "nepal", name: "Nepal", nameJa: "ネパール", screeningStart: "2025-03-24", mandatoryFrom: "2025-06-23", scheduled: false, note: "In force since 2025-06-23." },
  vietnam: { id: "vietnam", name: "Viet Nam", nameJa: "ベトナム", screeningStart: "2025-05-26", mandatoryFrom: "2025-09-01", scheduled: false, note: "In force since 2025-09-01." },
  indonesia: {
    id: "indonesia",
    name: "Indonesia",
    nameJa: "インドネシア",
    screeningStart: "2026-11-02",
    mandatoryFrom: "2027-01-04",
    scheduled: true,
    note: "Scheduled: Panel Clinics accept screenings from 2026-11-02; the certificate is mandatory for COE / visa applications filed from 2027-01-04 (MHLW notice 2026-09-25).",
  },
  myanmar: { id: "myanmar", name: "Myanmar", nameJa: "ミャンマー", screeningStart: null, mandatoryFrom: null, scheduled: true, note: "Target country, but the start date is not yet announced (as of 2026-09-25)." },
  china: { id: "china", name: "China", nameJa: "中国", screeningStart: null, mandatoryFrom: null, scheduled: true, note: "Target country, but the start date is not yet announced (as of 2026-09-25)." },
};

/* ---------- Status of residence / purpose ---------- */

export type StatusKind = "subject" | "subject_special" | "temporarily_exempt" | "not_mid_long";
export type StatusDef = { id: string; label: string; labelJa: string; kind: StatusKind; aliases: string[]; route?: "coe" | "visa_direct" };

export const STATUSES: StatusDef[] = [
  // Mid- to long-term statuses: subject to JPETS (unless another exemption applies).
  { id: "student", label: "Student (留学), incl. Japanese language school", labelJa: "留学", kind: "subject", aliases: ["ryugaku", "language_school", "study", "college", "university"] },
  { id: "technical_intern_training", label: "Technical Intern Training (技能実習)", labelJa: "技能実習", kind: "subject", aliases: ["technical_intern", "intern", "titp", "ginou_jisshu", "jisshu", "magang"] },
  { id: "employment_for_skill_development", label: "Employment for Skill Development (育成就労, from 2027-04-01)", labelJa: "育成就労", kind: "subject", aliases: ["skill_development", "ikusei_shuro", "ikusei", "esd"] },
  { id: "engineer_humanities", label: "Engineer / Specialist in Humanities / International Services (技人国)", labelJa: "技術・人文知識・国際業務", kind: "subject", aliases: ["engineer", "gijinkoku", "humanities", "international_services", "work", "employee"] },
  { id: "skilled_labor", label: "Skilled Labor (技能), e.g. chef", labelJa: "技能", kind: "subject", aliases: ["ginou", "chef", "cook"] },
  { id: "nursing_care", label: "Nursing Care (介護) status, not EPA", labelJa: "介護", kind: "subject", aliases: ["kaigo", "care_worker"] },
  { id: "intra_company_transferee", label: "Intra-company Transferee (企業内転勤)", labelJa: "企業内転勤", kind: "subject", aliases: ["intra_company", "transferee"] },
  { id: "business_manager", label: "Business Manager (経営・管理)", labelJa: "経営・管理", kind: "subject", aliases: ["business", "manager", "keiei_kanri"] },
  { id: "highly_skilled_professional", label: "Highly Skilled Professional (高度専門職)", labelJa: "高度専門職", kind: "subject", aliases: ["hsp", "highly_skilled"] },
  { id: "professor_researcher", label: "Professor / Researcher / Instructor (教授・研究・教育)", labelJa: "教授・研究・教育", kind: "subject", aliases: ["professor", "researcher", "instructor", "teacher"] },
  { id: "other_work", label: "Other work status (medical, legal/accounting, journalist, religious, artist, entertainer)", labelJa: "その他の就労資格", kind: "subject", aliases: ["entertainer", "artist", "religious", "journalist", "medical_services", "legal_accounting"] },
  { id: "training", label: "Trainee (研修), not JICA", labelJa: "研修", kind: "subject", aliases: ["kenshu", "trainee"] },
  { id: "cultural_activities", label: "Cultural Activities (文化活動)", labelJa: "文化活動", kind: "subject", aliases: ["cultural"] },
  { id: "dependent", label: "Dependent (家族滞在)", labelJa: "家族滞在", kind: "subject", aliases: ["family", "family_stay", "kazoku_taizai"] },
  { id: "spouse_of_japanese", label: "Spouse or Child of Japanese National (日本人の配偶者等)", labelJa: "日本人の配偶者等", kind: "subject", aliases: ["spouse", "spouse_japanese", "marriage"] },
  { id: "spouse_of_permanent_resident", label: "Spouse or Child of Permanent Resident (永住者の配偶者等)", labelJa: "永住者の配偶者等", kind: "subject", aliases: ["spouse_pr", "spouse_permanent"] },
  { id: "long_term_resident", label: "Long-Term Resident (定住者)", labelJa: "定住者", kind: "subject", aliases: ["teijusha", "teiju", "nikkei"] },
  { id: "designated_activities", label: "Designated Activities (特定活動), other notifications", labelJa: "特定活動（その他）", kind: "subject", aliases: ["tokutei_katsudo", "da"] },
  { id: "other_mid_long", label: "Other stay over 3 months", labelJa: "その他（3か月超）", kind: "subject", aliases: ["other", "long_stay", "mid_long"] },
  // Explicitly included even though the stay is 6 months: Designated Activities No. 53 / 54.
  { id: "digital_nomad", label: "Digital Nomad (特定活動 No. 53)", labelJa: "デジタルノマド（特定活動告示53号）", kind: "subject_special", aliases: ["nomad", "da53"], route: "visa_direct" },
  { id: "digital_nomad_family", label: "Spouse or child of a Digital Nomad (特定活動 No. 54)", labelJa: "デジタルノマドの配偶者・子（54号）", kind: "subject_special", aliases: ["nomad_family", "da54"], route: "visa_direct" },
  // Temporarily exempt (当面の間、対象外): programs that already require a chest X-ray health check before entry.
  { id: "specified_skilled_worker", label: "Specified Skilled Worker (特定技能 i / ii)", labelJa: "特定技能", kind: "temporarily_exempt", aliases: ["ssw", "tokutei_ginou", "tokutei", "ssw1", "ssw2", "specified_skilled"] },
  { id: "epa_nurse_care_worker", label: "EPA nurse or care worker candidate", labelJa: "EPAに基づく看護師・介護福祉士", kind: "temporarily_exempt", aliases: ["epa", "epa_nurse", "epa_care"] },
  { id: "jet_programme", label: "JET Programme participant", labelJa: "JETプログラム参加者", kind: "temporarily_exempt", aliases: ["jet"] },
  { id: "jica_trainee", label: "JICA trainee (long- or short-term)", labelJa: "JICA研修員", kind: "temporarily_exempt", aliases: ["jica"] },
  { id: "jds_scholar", label: "JICA JDS scholarship student", labelJa: "JICA人材育成奨学計画（JDS）留学生", kind: "temporarily_exempt", aliases: ["jds"] },
  { id: "japan_foundation_invitee", label: "Japan Foundation long/mid-term invitation program", labelJa: "国際交流基金 中長期招へい", kind: "temporarily_exempt", aliases: ["japan_foundation", "jf"] },
  { id: "mext_embassy_scholar", label: "Japanese Government (MEXT) scholar, embassy recommendation", labelJa: "大使館推薦による国費留学生", kind: "temporarily_exempt", aliases: ["mext", "monbukagakusho", "mext_scholar"] },
  { id: "commissioned_student_training", label: "Student under commissioned education and training programs", labelJa: "外国人留学生の教育訓練の受託事業", kind: "temporarily_exempt", aliases: ["commissioned_training"] },
  { id: "da55_motor_vehicle", label: "Designated Activities No. 55 (specified motor vehicle transportation preparation)", labelJa: "特定活動告示55号（特定自動車運送業準備）", kind: "temporarily_exempt", aliases: ["da55", "driver_preparation"] },
  { id: "housekeeping_special_zone", label: "Housekeeping worker, National Strategic Special Zones", labelJa: "家事支援外国人材受入事業", kind: "temporarily_exempt", aliases: ["housekeeping", "kaji_shien"] },
  // Not mid- to long-term residents.
  { id: "temporary_visitor", label: "Temporary Visitor: tourism, business trip, family visit (短期滞在)", labelJa: "短期滞在", kind: "not_mid_long", aliases: ["tourist", "tourism", "visitor", "short_stay", "business_trip", "tanki_taizai"] },
  { id: "diplomat_official", label: "Diplomat or Official (外交・公用)", labelJa: "外交・公用", kind: "not_mid_long", aliases: ["diplomat", "official"] },
];

const STATUS_BY_KEY = new Map<string, StatusDef>();
for (const s of STATUSES) {
  STATUS_BY_KEY.set(s.id, s);
  for (const a of s.aliases) STATUS_BY_KEY.set(a, s);
}
export const STATUS_IDS = STATUSES.map((s) => s.id);

const COUNTRY_ALIASES: Record<string, Nationality> = {
  philippines: "philippines", ph: "philippines", phl: "philippines", filipino: "philippines", filipina: "philippines", philippine: "philippines", pilipinas: "philippines", "フィリピン": "philippines",
  nepal: "nepal", np: "nepal", npl: "nepal", nepali: "nepal", nepalese: "nepal", "ネパール": "nepal",
  vietnam: "vietnam", "viet nam": "vietnam", viet_nam: "vietnam", vn: "vietnam", vnm: "vietnam", vietnamese: "vietnam", "ベトナム": "vietnam",
  indonesia: "indonesia", id: "indonesia", idn: "indonesia", indonesian: "indonesia", "インドネシア": "indonesia",
  myanmar: "myanmar", mm: "myanmar", mmr: "myanmar", burma: "myanmar", burmese: "myanmar", "ミャンマー": "myanmar",
  china: "china", cn: "china", chn: "china", chinese: "china", prc: "china", "中国": "china",
};

export class RuleInputError extends Error {}

export type Residence = Nationality | "japan";
export function resolveResidence(raw: unknown): Residence {
  const v = String(raw ?? "").trim().toLowerCase();
  if (["japan", "jp", "jpn", "nihon", "nippon", "日本", "in_japan", "in japan"].includes(v)) return "japan";
  return resolveCountry(raw, "residenceCountry");
}

export function resolveCountry(raw: unknown, key = "nationality"): Nationality {
  const v = String(raw ?? "").trim().toLowerCase().replace(/[-.]/g, " ").replace(/\s+/g, " ");
  if (!v) throw new RuleInputError(`Missing ${key}. Use philippines, nepal, vietnam, indonesia, myanmar, china, or other (any other country).`);
  if (COUNTRY_ALIASES[v]) return COUNTRY_ALIASES[v];
  if (COUNTRY_ALIASES[v.replace(/ /g, "_")]) return COUNTRY_ALIASES[v.replace(/ /g, "_")];
  return "other";
}

export function resolveStatus(raw: unknown): StatusDef {
  const v = String(raw ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (!v) return STATUS_BY_KEY.get("other_mid_long")!;
  const s = STATUS_BY_KEY.get(v);
  if (!s) throw new RuleInputError(`Unknown status "${v}". Allowed: ${STATUS_IDS.join(", ")}`);
  return s;
}

/* ---------- Dates ---------- */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export function validDate(s: string): boolean {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
export function todayJst(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 3_600_000).toISOString().slice(0, 10);
}
const maxDate = (a: string, b: string) => (a > b ? a : b);

/* ---------- Check ---------- */

export const VALIDITY_DAYS = 180;
export const VALIDITY_DAYS_CLOSE_CONTACT = 90;
export const ROUTES = ["coe", "visa_direct"] as const;
export type Route = (typeof ROUTES)[number];

export type CheckInput = {
  nationality: Nationality;
  /** Country where the applicant currently lives. Defaults to the nationality. */
  residenceCountry?: Residence;
  status?: string;
  /** Period of stay expected, in months. ≤ 3 months is not a mid- to long-term stay. */
  stayMonths?: number | null;
  hasReentryPermit?: boolean;
  route?: Route;
  /** Date the COE application (or direct visa application) is filed. Defaults to today in Japan. */
  applicationDate?: string | null;
  /** Date of the chest X-ray at the Panel Clinic, if done. */
  xrayDate?: string | null;
  /** Close household / enclosed-space contact with active infectious pulmonary TB within 2 months before the X-ray. */
  closeContact?: boolean;
  /** Optional city filter for the Panel Clinic list. */
  city?: string | null;
  today?: string;
};

export type Verdict = "required" | "not_yet_required" | "exempt" | "not_required";

export const VERDICT_LABEL: Record<Verdict, string> = {
  required: "TB Clearance Certificate required",
  not_yet_required: "Not required yet",
  exempt: "Exempt from JPETS",
  not_required: "JPETS does not apply",
};

export function checkJpets(raw: CheckInput) {
  const nationality = raw.nationality;
  if (!(NATIONALITIES as readonly string[]).includes(nationality)) throw new RuleInputError(`Invalid nationality "${nationality}".`);
  const residence: Residence = raw.residenceCountry ?? nationality;
  const status = resolveStatus(raw.status);
  const today = raw.today && validDate(raw.today) ? raw.today : todayJst();
  const applicationDate = raw.applicationDate ?? today;
  if (!validDate(applicationDate)) throw new RuleInputError("applicationDate must be YYYY-MM-DD");
  if (raw.xrayDate && !validDate(raw.xrayDate)) throw new RuleInputError("xrayDate must be YYYY-MM-DD");
  if (raw.stayMonths !== undefined && raw.stayMonths !== null && (!(raw.stayMonths > 0) || raw.stayMonths > 600)) throw new RuleInputError("stayMonths must be between 1 and 600");
  const route: Route = raw.route ?? status.route ?? "coe";
  const closeContact = raw.closeContact === true;
  const validityDays = closeContact ? VALIDITY_DAYS_CLOSE_CONTACT : VALIDITY_DAYS;

  const isTarget = nationality !== "other";
  const country = isTarget ? COUNTRIES[nationality as TargetCountry] : null;
  /** Where the screening happens: the residence country if it is a target country, else the nationality. */
  const screeningCountry: TargetCountry | null = residence !== "other" && residence !== "japan" ? (residence as TargetCountry) : isTarget ? (nationality as TargetCountry) : null;

  const reasons: string[] = [];
  const notes: string[] = [];
  let verdict: Verdict;
  let reasonCode: string;

  if (!isTarget) {
    verdict = "not_required";
    reasonCode = "not_target_nationality";
    reasons.push("JPETS applies only to nationals of the Philippines, Nepal, Viet Nam, Indonesia, Myanmar and China.");
  } else if (residence === "japan") {
    verdict = "not_required";
    reasonCode = "already_in_japan";
    reasons.push("JPETS is checked when a new entrant applies for a Certificate of Eligibility or a visa from abroad. A change of status or an extension of stay filed inside Japan does not ask for a TB Clearance Certificate.");
    notes.push("If you leave Japan without a re-entry permit and come back on a new COE, JPETS applies to that new application.");
  } else if (raw.hasReentryPermit) {
    verdict = "not_required";
    reasonCode = "reentry_permit";
    reasons.push("Re-entry permit holders (including the special re-entry permit / みなし再入国) are excluded: JPETS covers new mid- to long-term entrants.");
  } else if (status.kind === "not_mid_long") {
    verdict = "not_required";
    reasonCode = "not_mid_long_term";
    reasons.push(`${status.label} is not a mid- to long-term residence status, so JPETS does not apply. Tourists and other short-stay visitors are not screened.`);
  } else if (status.kind !== "subject_special" && raw.stayMonths !== undefined && raw.stayMonths !== null && raw.stayMonths <= 3) {
    verdict = "not_required";
    reasonCode = "stay_3_months_or_less";
    reasons.push("A period of stay of 3 months or less does not make you a mid- to long-term resident, so JPETS does not apply.");
  } else if (status.kind === "temporarily_exempt") {
    verdict = "exempt";
    reasonCode = "temporarily_exempt_status";
    reasons.push(`${status.label} is on the government's temporary exemption list (当面の間、対象外), because these programs already require a pre-entry health check with a chest X-ray.`);
    notes.push("The exemption is 'for the time being' and can end. Your program's own pre-entry medical check still applies.");
  } else if (residence === "other") {
    verdict = "exempt";
    reasonCode = "resides_outside_target_countries";
    reasons.push(`You live outside the six target countries. Nationals of ${country!.name} whose current residence abroad is confirmed by a residence permit or similar document are exempt.`);
    notes.push("With the COE application, submit a copy of your residence permit (scan OK) together with ISA's explanation form (説明書), available in Japanese and English on ISA's JPETS page.");
  } else {
    const ruleCountry = country!;
    if (!ruleCountry.mandatoryFrom) {
      verdict = "not_yet_required";
      reasonCode = "start_date_not_announced";
      reasons.push(`${ruleCountry.name} is a JPETS target country, but the start date has not been announced yet. No certificate is required until it is.`);
    } else if (applicationDate < ruleCountry.mandatoryFrom) {
      verdict = "not_yet_required";
      reasonCode = "before_mandatory_date";
      reasons.push(`Applications filed before ${ruleCountry.mandatoryFrom} do not need the certificate (${ruleCountry.name}${ruleCountry.scheduled ? ", scheduled" : ""}). What counts is the date the application is filed.`);
      if (route === "coe") notes.push(`If your COE is issued without a certificate because it was filed before ${ruleCountry.mandatoryFrom}, you do not need one for the visa application either, even after that date (JPETS Q&A 21), as long as you have no TB symptoms.`);
    } else {
      verdict = "required";
      reasonCode = "required";
      reasons.push(
        route === "coe"
          ? `Submit a TB Clearance Certificate from a designated Panel Clinic with your Certificate of Eligibility (COE) application. Mandatory for ${ruleCountry.name} nationals since ${ruleCountry.mandatoryFrom}.`
          : `Submit a TB Clearance Certificate from a designated Panel Clinic with your visa application at the Japanese embassy or consulate (no COE route). Mandatory for ${ruleCountry.name} nationals since ${ruleCountry.mandatoryFrom}.`,
      );
    }
    if (residence !== nationality) notes.push(`You live in ${COUNTRIES[residence as TargetCountry].name}, another target country, so the residence exemption does not apply. Screen at a Panel Clinic there if one exists, and confirm with ISA or the embassy which list applies to you.`);
    if (status.id === "employment_for_skill_development" && applicationDate < "2027-04-01") notes.push("Employment for Skill Development (育成就労) is scheduled to replace Technical Intern Training on 2027-04-01. A Panel Clinic chest X-ray may also satisfy that program's X-ray item, and some clinics do both on the same day (JPETS Q&A).");
    if (status.id === "technical_intern_training") notes.push("Technical intern trainees are NOT on the exemption list (only Specified Skilled Workers and the other listed programs are).");
    if (status.kind === "subject_special") notes.push("Digital Nomads (No. 53) and their families (No. 54) are covered even though their stay is up to 6 months. They usually apply for the visa directly at an embassy, so the certificate goes with the visa application.");
  }

  // Timeline status for the nationality's country on the application date.
  const timeline = country
    ? {
        country: country.id,
        name: country.name,
        screeningStart: country.screeningStart,
        mandatoryFrom: country.mandatoryFrom,
        scheduled: country.scheduled,
        phaseOnApplicationDate: !country.mandatoryFrom
          ? "not_announced"
          : applicationDate >= country.mandatoryFrom
            ? "mandatory"
            : country.screeningStart && applicationDate >= country.screeningStart
              ? "screening_open_not_mandatory"
              : "not_started",
        daysUntilMandatory: country.mandatoryFrom && applicationDate < country.mandatoryFrom ? daysBetween(applicationDate, country.mandatoryFrom) : 0,
        note: country.note,
      }
    : null;

  // Certificate validity and X-ray window.
  const screenStart = screeningCountry ? COUNTRIES[screeningCountry].screeningStart : null;
  let certificate: null | {
    validityDays: number;
    xrayDate: string | null;
    validThrough: string | null;
    validOnApplicationDate: boolean | null;
    daysLeftOnApplicationDate: number | null;
    xrayWindowForApplicationDate: { earliest: string; latest: string } | null;
    warnings: string[];
  } = null;
  if (verdict === "required" || (verdict === "not_yet_required" && country?.mandatoryFrom) || raw.xrayDate) {
    const warnings: string[] = [];
    let validThrough: string | null = null;
    let validOn: boolean | null = null;
    let daysLeft: number | null = null;
    if (raw.xrayDate) {
      validThrough = addDays(raw.xrayDate, validityDays - 1);
      if (raw.xrayDate > applicationDate) {
        validOn = false;
        warnings.push("The X-ray date is after the application date. The certificate must exist when you file.");
      } else {
        validOn = applicationDate <= validThrough;
        daysLeft = validOn ? daysBetween(applicationDate, validThrough) : null;
        if (!validOn) warnings.push(`The certificate expired on ${validThrough}, before the ${applicationDate} application. Get a new screening at a Panel Clinic.`);
      }
      if (screenStart && raw.xrayDate < screenStart) warnings.push(`That X-ray is before Panel Clinics in ${COUNTRIES[screeningCountry!].name} started JPETS screening (${screenStart}). Only TB Clearance Certificates issued by a designated Panel Clinic under JPETS are accepted.`);
    }
    const earliestRaw = addDays(applicationDate, -(validityDays - 1));
    const window = screenStart ? { earliest: maxDate(earliestRaw, screenStart), latest: applicationDate } : null;
    if (window && window.earliest > window.latest) warnings.push(`Panel Clinics in ${COUNTRIES[screeningCountry!].name} only accept screenings from ${screenStart}.`);
    certificate = {
      validityDays,
      xrayDate: raw.xrayDate ?? null,
      validThrough,
      validOnApplicationDate: validOn,
      daysLeftOnApplicationDate: daysLeft,
      xrayWindowForApplicationDate: window && window.earliest <= window.latest ? window : null,
      warnings,
    };
  }

  // Panel Clinics.
  const cityQ = raw.city?.trim().toLowerCase() || "";
  const allClinics = screeningCountry ? CLINICS.filter((c) => c.country === screeningCountry) : [];
  const clinics: Clinic[] = cityQ ? allClinics.filter((c) => c.city.toLowerCase().includes(cityQ) || c.address.toLowerCase().includes(cityQ)) : allClinics;
  const clinicCities = [...new Set(allClinics.map((c) => c.city))];

  const documents: string[] = [];
  if (verdict === "required" || verdict === "not_yet_required") {
    documents.push("TB Clearance Certificate issued by a designated Panel Clinic (a copy or scan is accepted).");
    documents.push("Valid passport at the Panel Clinic (identity check).");
    documents.push("If you truly cannot submit it for unavoidable reasons: ISA's reason statement (理由書); decided case by case.");
  } else if (reasonCode === "resides_outside_target_countries") {
    documents.push("Copy of your residence permit (or similar) for the country you live in, plus ISA's explanation form (説明書).");
  }

  if (verdict === "required" || verdict === "not_yet_required") {
    notes.push(`The certificate is valid ${VALIDITY_DAYS} days from the chest X-ray (${VALIDITY_DAYS_CLOSE_CONTACT} days after close contact with active infectious pulmonary TB in the 2 months before the X-ray). validThrough counts the X-ray day as day 1, the cautious reading.`);
    notes.push("With the COE route, the certificate only has to be valid when the COE application is filed. The later visa application and landing do not need to be inside the 180 days (JPETS Q&A 17).");
    notes.push("Only certificates from designated Panel Clinics count; a negative TB line on another hospital's check-up is not accepted. The applicant pays; prices vary by clinic.");
    notes.push("Children are screened too (under 5: usually a skin test or IGRA instead of an X-ray unless findings suggest TB). Pregnant applicants may postpone the X-ray or have it with double lead shielding.");
    notes.push("Keep your own copy: you may be asked for it after entering Japan.");
  }
  if (nationality === "china") notes.push("Hong Kong, Macao and Taiwan travel documents: the guideline does not say how they are treated. Ask the embassy once China's start date is set.");

  return {
    verdict,
    verdictLabel: VERDICT_LABEL[verdict],
    required: verdict === "required",
    reasonCode,
    reasons,
    submitWith: verdict === "required" || verdict === "not_yet_required" ? (route === "coe" ? "coe_application" : "visa_application") : null,
    input: {
      nationality,
      residenceCountry: residence,
      status: status.id,
      statusLabel: status.label,
      stayMonths: raw.stayMonths ?? null,
      hasReentryPermit: raw.hasReentryPermit === true,
      route,
      applicationDate,
      applicationDateDefaultedToToday: !raw.applicationDate,
      closeContact,
    },
    timeline,
    certificate,
    documents,
    panelClinics: {
      country: screeningCountry,
      count: clinics.length,
      totalInCountry: allClinics.length,
      cities: clinicCities,
      asOf: CLINICS_AS_OF,
      source: CLINICS_SOURCE,
      note: screeningCountry === "indonesia" ? "Indonesia's list is expanding on a rolling basis; check MHLW's list before booking." : screeningCountry && !allClinics.length ? "No Panel Clinics published yet for this country." : null,
      clinics,
    },
    notes,
    sources: [...SOURCES],
    rulesAsOf: RULES_AS_OF,
    today,
  };
}

export type CheckResult = ReturnType<typeof checkJpets>;

export const RULES = {
  name: "Japan Pre-Entry Tuberculosis Screening (JPETS) rules",
  rulesAsOf: RULES_AS_OF,
  whoIsCovered:
    "Nationals of the Philippines, Viet Nam, Indonesia, Nepal, Myanmar and China who intend to enter and stay in Japan as mid- to long-term residents (period of stay over 3 months; not Temporary Visitor, Diplomat or Official), excluding re-entry permit holders, plus Designated Activities No. 53 (Digital Nomad) and No. 54 (their spouse or child).",
  exemptions: {
    residenceOutsideTargetCountries: "Exempt if a residence permit or similar document confirms you currently live outside the target countries. Submit its copy with ISA's explanation form (説明書).",
    temporarilyExemptStatuses: STATUSES.filter((s) => s.kind === "temporarily_exempt").map((s) => ({ id: s.id, label: s.label, labelJa: s.labelJa })),
  },
  countries: Object.values(COUNTRIES),
  whenToSubmit: [
    "With the Certificate of Eligibility (COE) application at a Regional Immigration Services Bureau.",
    "With the visa application at a Japanese diplomatic mission if the COE says no certificate was submitted (exceptional cases).",
    "With the visa application if you apply without a COE (for example Digital Nomad).",
  ],
  transitionRule: "The mandatory date is applied to the date the application is filed. A COE filed before the mandatory date and issued without a certificate needs no certificate at the later visa stage (Q&A 21).",
  validity: { days: VALIDITY_DAYS, closeContactDays: VALIDITY_DAYS_CLOSE_CONTACT, countedFrom: "date of the chest X-ray", mustBeValidAt: "COE application (or the direct visa application). Not needed again for the visa or landing after a COE (Q&A 17)." },
  certificate: "Issued only by designated Panel Clinics after a medical exam and chest X-ray (sputum test at the doctor's discretion). A copy or scan is accepted. Fees are paid by the applicant and vary by clinic.",
  statuses: STATUSES.map((s) => ({ id: s.id, label: s.label, labelJa: s.labelJa, kind: s.kind })),
  panelClinics: { asOf: CLINICS_AS_OF, source: CLINICS_SOURCE, count: CLINICS.length, byCountry: Object.fromEntries(["philippines", "nepal", "vietnam", "indonesia"].map((c) => [c, CLINICS.filter((x) => x.country === c)])) },
  sources: [...SOURCES],
  disclaimer: DISCLAIMER,
};
