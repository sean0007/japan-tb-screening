"use client";

import { useState } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { NATIONALITIES, STATUSES, checkJpets, type Nationality } from "@/lib/jpets";
import { EXAMPLE_SHARED, NATIONALITY_LABEL, PUBLIC_URL, VERDICT_LABEL, fmtDate, resultPath, toCheckInput, type Shared } from "@/lib/share";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";

const GROUPS: { kind: string; label: string }[] = [
  { kind: "subject", label: "Mid- to long-term stay" },
  { kind: "subject_special", label: "Digital Nomad" },
  { kind: "temporarily_exempt", label: "Temporarily exempt programs" },
  { kind: "not_mid_long", label: "Short stay / diplomatic" },
];

const VERDICT_TONE: Record<string, string> = {
  required: "text-rose-300",
  not_yet_required: "text-amber",
  exempt: "text-teal-200",
  not_required: "text-teal-200",
};

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [nationality, setNationality] = useState<Nationality>(start.nationality);
  const [status, setStatus] = useState<string>(start.status);
  const [applicationDate, setApplicationDate] = useState<string>(start.applicationDate);
  const [xrayDate, setXrayDate] = useState<string>(start.xrayDate ?? "");
  const [residence, setResidence] = useState<Shared["residence"]>(start.residence);
  const [visaDirect, setVisaDirect] = useState<boolean>(start.visaDirect);

  const shared: Shared = { nationality, status, applicationDate, xrayDate: xrayDate || null, residence, visaDirect };
  const result = (() => {
    try {
      return checkJpets(toCheckInput(shared));
    } catch {
      return null;
    }
  })();
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your case</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Nationality (passport)</span>
          <select value={nationality} onChange={(e) => setNationality(e.target.value as Nationality)} className={field}>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {NATIONALITY_LABEL[n]}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-foreground">Status of residence / purpose in Japan</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
            {GROUPS.map((g) => (
              <optgroup key={g.kind} label={g.label}>
                {STATUSES.filter((s) => s.kind === g.kind).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-foreground">Where you live now</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["same", "In my country of nationality"],
                ["other", "In a non-target country (with residence permit)"],
                ["japan", "Already in Japan (change / extension)"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setResidence(v)}
                aria-pressed={residence === v}
                className={`rounded-full border px-4 py-1.5 text-sm ${residence === v ? "border-amber bg-amber/10 text-foreground" : "border-line text-muted hover:border-amber/50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">COE / visa application filed on</span>
            <span className="mt-0.5 block text-xs text-muted">The filing date decides which rule applies.</span>
            <input type="date" value={applicationDate} min="2025-01-01" max="2030-12-31" onChange={(e) => e.target.value && setApplicationDate(e.target.value)} className={`${field} font-mono`} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">Chest X-ray date</span>
            <span className="mt-0.5 block text-xs text-muted">Optional. Checks the 180-day validity.</span>
            <input type="date" value={xrayDate} min="2024-01-01" max="2030-12-31" onChange={(e) => setXrayDate(e.target.value)} className={`${field} font-mono`} />
          </label>
        </div>
        <label className="mt-5 flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" checked={visaDirect} onChange={(e) => setVisaDirect(e.target.checked)} className="mt-1" />
          <span>I apply for the visa at the embassy without a Certificate of Eligibility (COE)</span>
        </label>
      </div>

      <article data-testid="result-card" className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-black/50 lg:sticky lg:top-16 lg:self-start">
        <div className="p-5 sm:p-7">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            {NATIONALITY_LABEL[nationality]} · filed {fmtDate(applicationDate)}
          </p>
          {result ? (
            <>
              <h2 className={`mt-2 font-display text-4xl ${VERDICT_TONE[result.verdict]}`}>{VERDICT_LABEL[result.verdict]}</h2>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground">
                {result.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {result.timeline?.mandatoryFrom && (
                  <div className="rounded-2xl border border-line p-3">
                    <dt className="text-xs text-muted">Mandatory from{result.timeline.scheduled ? " (scheduled)" : ""}</dt>
                    <dd className="font-mono text-foreground">{fmtDate(result.timeline.mandatoryFrom)}</dd>
                  </div>
                )}
                {result.timeline?.screeningStart && (
                  <div className="rounded-2xl border border-line p-3">
                    <dt className="text-xs text-muted">Panel Clinics open</dt>
                    <dd className="font-mono text-foreground">{fmtDate(result.timeline.screeningStart)}</dd>
                  </div>
                )}
                {result.certificate?.xrayWindowForApplicationDate && (
                  <div className="col-span-2 rounded-2xl border border-amber/30 bg-amber/5 p-3">
                    <dt className="text-xs text-muted">X-ray window for this filing date ({result.certificate.validityDays}-day validity)</dt>
                    <dd className="font-mono text-foreground">
                      {fmtDate(result.certificate.xrayWindowForApplicationDate.earliest)} → {fmtDate(result.certificate.xrayWindowForApplicationDate.latest)}
                    </dd>
                  </div>
                )}
                {result.certificate?.validThrough && (
                  <div className={`col-span-2 rounded-2xl border p-3 ${result.certificate.validOnApplicationDate ? "border-teal-200/30 bg-teal-200/5" : "border-rose-300/30 bg-rose-300/5"}`}>
                    <dt className="text-xs text-muted">Your certificate is valid through</dt>
                    <dd className="font-mono text-foreground">
                      {fmtDate(result.certificate.validThrough)} · {result.certificate.validOnApplicationDate ? `OK on filing date (${result.certificate.daysLeftOnApplicationDate} days spare)` : "NOT valid on filing date"}
                    </dd>
                  </div>
                )}
              </dl>
              {result.certificate?.warnings.length ? (
                <ul className="mt-4 space-y-1 text-xs text-rose-200">
                  {result.certificate.warnings.map((w) => (
                    <li key={w}>⚠ {w}</li>
                  ))}
                </ul>
              ) : null}
              {result.panelClinics.totalInCountry > 0 && (result.verdict === "required" || result.verdict === "not_yet_required") && (
                <details className="mt-5 rounded-2xl border border-line p-3 text-sm">
                  <summary className="cursor-pointer text-foreground">
                    {result.panelClinics.totalInCountry} designated Panel Clinics ({result.panelClinics.cities.join(", ")})
                  </summary>
                  <ul className="mt-3 space-y-2 text-xs text-muted">
                    {result.panelClinics.clinics.map((c) => (
                      <li key={c.name + c.address}>
                        <span className="text-foreground">{c.name}</span> · {c.city} · {c.phone}
                        {c.website ? (
                          <>
                            {" · "}
                            <a href={c.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                              website
                            </a>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted">MHLW list as of {result.panelClinics.asOf}.</p>
                </details>
              )}
              <ul className="mt-5 space-y-1.5 text-xs leading-relaxed text-muted">
                {result.notes.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-amber">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-4" data-testid="share-result">
                <p className="text-xs text-muted">Share this result. The link carries only these choices; nothing is stored.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ShareBar url={shareUrl} text={`Japan TB screening (JPETS) for ${NATIONALITY_LABEL[nationality]}, filed ${applicationDate}: ${VERDICT_LABEL[result.verdict]}. Free checker:`} />
                  <a href={resultPath(shared)} className="text-sm text-muted underline underline-offset-2 hover:text-foreground">
                    Open result page
                  </a>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">Pick a nationality, status and date.</p>
          )}
        </div>
        <CardDisclaimer />
      </article>
    </div>
  );
}
