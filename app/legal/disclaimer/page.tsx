import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/jpets";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational checker. It applies a dated copy (as of {RULES_AS_OF}) of the Japanese government&apos;s Guideline for Japan&apos;s Pre-Entry Tuberculosis Screening (JPETS, revised 2026-09-25), the JPETS Q&amp;A, and the Immigration Services Agency&apos;s JPETS page to your nationality, residence, status of residence and application date, and lists the designated Panel Clinics published by the Ministry of Health, Labour and Welfare.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not immigration, legal or medical advice, and it does not diagnose anything. Only a designated Panel Clinic can screen you and issue a TB Clearance Certificate. The Immigration Services Agency (for the Certificate of Eligibility) and the Japanese embassy or consulate (for the visa) decide what they accept. Dates marked &quot;scheduled&quot; (Indonesia) can move, exemptions are &quot;for the time being&quot; and can end, and the Panel Clinic list changes. Check the official sources below, and ask ISA, the embassy, your school or employer, or a licensed gyoseishoshi (行政書士) about your case. If you have symptoms such as a cough lasting more than two weeks, see a doctor.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How dates are counted</h2>
          <p className="mt-2">
            The certificate is valid 180 days from the chest X-ray (90 days after close contact with active infectious pulmonary TB in the 2 months before the X-ray). This tool counts the X-ray day as day 1, the cautious reading; under Japan&apos;s usual rule the period may run one day longer. Do not plan to the last day.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">Choices you make stay in your browser (or in a share link you create). No login, no passport numbers, no health data, no database.</p>
        </section>
      </div>
    </div>
  );
}
