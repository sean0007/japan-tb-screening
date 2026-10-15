import assert from "node:assert/strict";
import test from "node:test";
import { CLINICS } from "./clinics";
import { COUNTRIES, RULES, STATUSES, addDays, checkJpets, resolveCountry, resolveStatus, todayJst } from "./jpets";

const T = "2026-10-15";

test("official timeline: PH/NP 2025-03-24 → 2025-06-23, VN 2025-05-26 → 2025-09-01, ID 2026-11-02 → 2027-01-04, MM/CN TBD", () => {
  assert.deepEqual([COUNTRIES.philippines.screeningStart, COUNTRIES.philippines.mandatoryFrom], ["2025-03-24", "2025-06-23"]);
  assert.deepEqual([COUNTRIES.nepal.screeningStart, COUNTRIES.nepal.mandatoryFrom], ["2025-03-24", "2025-06-23"]);
  assert.deepEqual([COUNTRIES.vietnam.screeningStart, COUNTRIES.vietnam.mandatoryFrom], ["2025-05-26", "2025-09-01"]);
  assert.deepEqual([COUNTRIES.indonesia.screeningStart, COUNTRIES.indonesia.mandatoryFrom], ["2026-11-02", "2027-01-04"]);
  assert.equal(COUNTRIES.myanmar.mandatoryFrom, null);
  assert.equal(COUNTRIES.china.mandatoryFrom, null);
});

test("Indonesia boundary: filed 2027-01-03 not yet required, 2027-01-04 required (Q&A 21: filing date counts)", () => {
  const before = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-03", today: T });
  assert.equal(before.verdict, "not_yet_required");
  assert.equal(before.timeline?.phaseOnApplicationDate, "screening_open_not_mandatory");
  assert.equal(before.timeline?.daysUntilMandatory, 1);
  assert.ok(before.notes.some((n) => n.includes("Q&A 21")));
  const on = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-04", today: T });
  assert.equal(on.verdict, "required");
  assert.equal(on.required, true);
  assert.equal(on.submitWith, "coe_application");
});

test("Indonesia today (2026-10-15): screening not started yet, 81 days to mandatory", () => {
  const r = checkJpets({ nationality: "indonesia", status: "technical_intern_training", today: T });
  assert.equal(r.verdict, "not_yet_required");
  assert.equal(r.input.applicationDate, T);
  assert.equal(r.input.applicationDateDefaultedToToday, true);
  assert.equal(r.timeline?.phaseOnApplicationDate, "not_started");
  assert.equal(r.timeline?.daysUntilMandatory, 81);
});

test("Philippines, Nepal, Viet Nam boundaries", () => {
  assert.equal(checkJpets({ nationality: "philippines", status: "student", applicationDate: "2025-06-22", today: T }).verdict, "not_yet_required");
  assert.equal(checkJpets({ nationality: "philippines", status: "student", applicationDate: "2025-06-23", today: T }).verdict, "required");
  assert.equal(checkJpets({ nationality: "nepal", status: "dependent", applicationDate: "2025-06-23", today: T }).verdict, "required");
  assert.equal(checkJpets({ nationality: "vietnam", status: "engineer_humanities", applicationDate: "2025-08-31", today: T }).verdict, "not_yet_required");
  assert.equal(checkJpets({ nationality: "vietnam", status: "engineer_humanities", applicationDate: "2025-09-01", today: T }).verdict, "required");
});

test("Myanmar and China: target but date not announced", () => {
  for (const n of ["myanmar", "china"] as const) {
    const r = checkJpets({ nationality: n, status: "student", applicationDate: "2027-06-01", today: T });
    assert.equal(r.verdict, "not_yet_required");
    assert.equal(r.reasonCode, "start_date_not_announced");
    assert.equal(r.timeline?.phaseOnApplicationDate, "not_announced");
    assert.equal(r.panelClinics.count, 0);
  }
});

test("non-target nationality is not covered", () => {
  const r = checkJpets({ nationality: "other", status: "student", applicationDate: "2027-02-01", today: T });
  assert.equal(r.verdict, "not_required");
  assert.equal(r.reasonCode, "not_target_nationality");
  assert.equal(r.timeline, null);
});

test("temporary exemption list: SSW, EPA, JET, JICA, JDS, JF, MEXT, commissioned, DA55, housekeeping", () => {
  const exempt = STATUSES.filter((s) => s.kind === "temporarily_exempt").map((s) => s.id);
  assert.equal(exempt.length, 10);
  for (const s of exempt) {
    const r = checkJpets({ nationality: "vietnam", status: s, applicationDate: "2026-11-01", today: T });
    assert.equal(r.verdict, "exempt", s);
    assert.equal(r.reasonCode, "temporarily_exempt_status");
  }
  assert.equal(checkJpets({ nationality: "indonesia", status: "tokutei_ginou", applicationDate: "2027-02-01", today: T }).verdict, "exempt");
});

test("technical intern trainees and students are NOT exempt", () => {
  const r = checkJpets({ nationality: "indonesia", status: "intern", applicationDate: "2027-02-01", today: T });
  assert.equal(r.verdict, "required");
  assert.ok(r.notes.some((n) => n.includes("NOT on the exemption list")));
});

test("not mid- to long-term: tourist, diplomat, stay ≤ 3 months, re-entry permit", () => {
  assert.equal(checkJpets({ nationality: "philippines", status: "tourist", today: T }).reasonCode, "not_mid_long_term");
  assert.equal(checkJpets({ nationality: "philippines", status: "diplomat", today: T }).verdict, "not_required");
  assert.equal(checkJpets({ nationality: "philippines", status: "training", stayMonths: 3, today: T }).reasonCode, "stay_3_months_or_less");
  assert.equal(checkJpets({ nationality: "philippines", status: "training", stayMonths: 4, today: T }).verdict, "required");
  assert.equal(checkJpets({ nationality: "vietnam", status: "engineer_humanities", hasReentryPermit: true, today: T }).reasonCode, "reentry_permit");
});

test("digital nomad (No. 53/54) is covered despite ≤ 6 months and defaults to the direct visa route", () => {
  const r = checkJpets({ nationality: "philippines", status: "digital_nomad", stayMonths: 6, today: T });
  assert.equal(r.verdict, "required");
  assert.equal(r.input.route, "visa_direct");
  assert.equal(r.submitWith, "visa_application");
  assert.equal(checkJpets({ nationality: "philippines", status: "digital_nomad_family", stayMonths: 3, today: T }).verdict, "required");
});

test("residence outside target countries = exempt; residence in another target country is not", () => {
  const r = checkJpets({ nationality: "nepal", residenceCountry: "other", status: "student", today: T });
  assert.equal(r.verdict, "exempt");
  assert.equal(r.reasonCode, "resides_outside_target_countries");
  assert.ok(r.documents[0].includes("explanation form"));
  const r2 = checkJpets({ nationality: "nepal", residenceCountry: "vietnam", status: "student", today: T });
  assert.equal(r2.verdict, "required");
  assert.equal(r2.panelClinics.country, "vietnam");
  assert.ok(r2.notes.some((n) => n.includes("another target country")));
});

test("already in Japan (change of status / extension) = not required", () => {
  const r = checkJpets({ nationality: "vietnam", residenceCountry: "japan", status: "engineer_humanities", today: T });
  assert.equal(r.verdict, "not_required");
  assert.equal(r.reasonCode, "already_in_japan");
});

test("validity: 180 days from X-ray (X-ray day = day 1), 90 days after close contact", () => {
  const ok = checkJpets({ nationality: "vietnam", status: "student", applicationDate: "2026-06-29", xrayDate: "2026-01-01", today: T });
  assert.equal(ok.certificate?.validThrough, "2026-06-29");
  assert.equal(ok.certificate?.validOnApplicationDate, true);
  assert.equal(ok.certificate?.daysLeftOnApplicationDate, 0);
  const late = checkJpets({ nationality: "vietnam", status: "student", applicationDate: "2026-06-30", xrayDate: "2026-01-01", today: T });
  assert.equal(late.certificate?.validOnApplicationDate, false);
  assert.ok(late.certificate?.warnings[0].includes("expired"));
  const cc = checkJpets({ nationality: "vietnam", status: "student", applicationDate: "2026-04-01", xrayDate: "2026-01-01", closeContact: true, today: T });
  assert.equal(cc.certificate?.validityDays, 90);
  assert.equal(cc.certificate?.validThrough, "2026-03-31");
  assert.equal(cc.certificate?.validOnApplicationDate, false);
});

test("X-ray window clamps to the Panel Clinic start date (Indonesia 2026-11-02)", () => {
  const r = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-15", today: T });
  assert.deepEqual(r.certificate?.xrayWindowForApplicationDate, { earliest: "2026-11-02", latest: "2027-01-15" });
  const r2 = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-08-01", today: T });
  assert.deepEqual(r2.certificate?.xrayWindowForApplicationDate, { earliest: addDays("2027-08-01", -179), latest: "2027-08-01" });
  const early = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-10", xrayDate: "2026-10-20", today: T });
  assert.ok(early.certificate?.warnings.some((w) => w.includes("before Panel Clinics in Indonesia started")));
  const after = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-10", xrayDate: "2027-01-12", today: T });
  assert.equal(after.certificate?.validOnApplicationDate, false);
});

test("Panel Clinics: 42 total (PH 6, NP 9, VN 17, ID 10); city filter works", () => {
  assert.equal(CLINICS.length, 42);
  const by = (c: string) => CLINICS.filter((x) => x.country === c).length;
  assert.deepEqual([by("philippines"), by("nepal"), by("vietnam"), by("indonesia")], [6, 9, 17, 10]);
  const r = checkJpets({ nationality: "indonesia", status: "student", applicationDate: "2027-01-15", city: "Surabaya", today: T });
  assert.equal(r.panelClinics.count, 1);
  assert.equal(r.panelClinics.clinics[0].name, "RS Premier Surabaya");
  assert.equal(r.panelClinics.totalInCountry, 10);
  assert.ok(r.panelClinics.cities.includes("Makassar"));
  for (const c of CLINICS) {
    assert.ok(c.name && c.city && c.address && c.phone, c.name);
    if (c.website) assert.match(c.website, /^https?:\/\//);
  }
});

test("aliases resolve", () => {
  assert.equal(resolveCountry("ID"), "indonesia");
  assert.equal(resolveCountry("Viet Nam"), "vietnam");
  assert.equal(resolveCountry("Filipino"), "philippines");
  assert.equal(resolveCountry("インドネシア"), "indonesia");
  assert.equal(resolveCountry("Brazil"), "other");
  assert.equal(resolveStatus("SSW").id, "specified_skilled_worker");
  assert.equal(resolveStatus("gijinkoku").id, "engineer_humanities");
  assert.equal(resolveStatus("").id, "other_mid_long");
  assert.throws(() => resolveStatus("wizard"));
  assert.throws(() => resolveCountry(""));
});

test("bad dates throw", () => {
  assert.throws(() => checkJpets({ nationality: "indonesia", applicationDate: "2027-02-30", today: T }));
  assert.throws(() => checkJpets({ nationality: "indonesia", xrayDate: "soon", today: T }));
});

test("todayJst uses Japan time", () => {
  assert.equal(todayJst(new Date("2026-10-14T15:30:00Z")), "2026-10-15");
  assert.equal(todayJst(new Date("2026-10-14T14:59:00Z")), "2026-10-14");
});

test("RULES has sources, exemption list and clinic list", () => {
  assert.ok(RULES.sources.length >= 5);
  assert.equal(RULES.exemptions.temporarilyExemptStatuses.length, 10);
  assert.equal(RULES.panelClinics.count, 42);
  assert.equal(RULES.countries.length, 6);
});
