import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calculator } from "@/components/calculator";
import { checkJpets } from "@/lib/jpets";
import { EXAMPLE_SHARED, NATIONALITY_LABEL, PUBLIC_URL, VERDICT_LABEL, fmtDate, isIndexable, ogPath, parseShared, resultPath, toCheckInput } from "@/lib/share";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const shared = parseShared(await searchParams);
  if (!shared) return { title: "Your result", robots: { index: false, follow: true } };
  const r = checkJpets(toCheckInput(shared));
  const title = `${VERDICT_LABEL[r.verdict]}: ${NATIONALITY_LABEL[shared.nationality]}, ${r.input.statusLabel.split(" (")[0]}, filed ${shared.applicationDate}`;
  const description = `${r.reasons[0]} Rules as of ${r.rulesAsOf}. Educational guide; ISA, the embassy and the Panel Clinic decide.`;
  const url = `${PUBLIC_URL}${resultPath(shared)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: isIndexable(shared) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: `Japan TB Screening (JPETS) · ${title}`, description, type: "website", url, images: [{ url: ogPath(shared), width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title: `Japan TB Screening (JPETS) · ${title}`, description, images: [ogPath(shared)] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const shared = parseShared(await searchParams);
  if (!shared) redirect("/");
  const r = checkJpets(toCheckInput(shared));
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Shared result · Japan TB Screening (JPETS)</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          <span className={r.verdict === "required" ? "text-rose-300" : r.verdict === "not_yet_required" ? "text-amber" : "text-teal-200"}>{VERDICT_LABEL[r.verdict]}</span> for {NATIONALITY_LABEL[shared.nationality]} · {r.input.statusLabel.split(" (")[0]}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Application filed {fmtDate(shared.applicationDate)} · {r.reasons[0]} · rules as of {r.rulesAsOf}
        </p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-muted underline underline-offset-2 hover:text-foreground">
            ← Start over
          </Link>
          {resultPath(shared) === resultPath(EXAMPLE_SHARED) ? null : (
            <>
              {" · "}
              <Link href={resultPath(EXAMPLE_SHARED)} className="text-muted underline underline-offset-2 hover:text-foreground">
                Open the example
              </Link>
            </>
          )}
        </p>
      </section>
      <section className="mt-8">
        <Calculator initial={shared} />
      </section>
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {HONESTY}
      </p>
    </div>
  );
}
