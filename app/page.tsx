import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { CLINICS } from "@/lib/clinics";
import { COUNTRIES, SOURCES, STATUSES } from "@/lib/jpets";
import { PUBLIC_URL, fmtDate } from "@/lib/share";

const title = "JPETS checker: do I need a TB clearance certificate for Japan? (Indonesia from Jan 4, 2027)";
const description =
  "Free Japan Pre-Entry TB Screening (JPETS) checker: Philippines, Nepal and Viet Nam nationals need a TB Clearance Certificate from a Panel Clinic for a Japan COE or visa (stays over 3 months); Indonesia from January 4, 2027 (screening from November 2, 2026). Exemptions (specified skilled workers), 180-day validity, Panel Clinic list, free JSON API for AI agents. Not legal or medical advice.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const idClinicCities = [...new Set(CLINICS.filter((c) => c.country === "indonesia").map((c) => c.city))];
const exemptLabels = STATUSES.filter((s) => s.kind === "temporarily_exempt").map((s) => s.label);

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan TB Screening Check (JPETS)",
  alternateName: ["JPETS checker", "入国前結核スクリーニング 判定", "Cek JPETS"],
  url: PUBLIC_URL,
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja", "id"],
  description:
    "Unofficial, free checker for Japan Pre-Entry Tuberculosis Screening (JPETS): who needs a TB Clearance Certificate for a Japan Certificate of Eligibility or visa, from which date, exemptions, certificate validity, and the designated Panel Clinics, with a keyless JSON API. Educational guide, not immigration, legal or medical advice.",
};

const faq: FaqItem[] = [
  {
    q: "What is JPETS?",
    a: `Japan Pre-Entry Tuberculosis Screening (JPETS, 入国前結核スクリーニング) is a TB check that some foreign nationals must pass before moving to Japan. You get a medical exam and chest X-ray at a Panel Clinic designated by the Japanese government in your country; if you do not have active TB, the clinic issues a TB Clearance Certificate, which you submit with your Certificate of Eligibility (COE) application, or with your visa application if you apply without a COE. It is run by the Ministry of Health, Labour and Welfare with the Immigration Services Agency and the Ministry of Foreign Affairs (${SOURCES[0]}).`,
  },
  {
    q: "Who needs a TB clearance certificate for Japan?",
    a: "Nationals of the Philippines, Nepal, Viet Nam, Indonesia, Myanmar and China who will live in Japan as mid- to long-term residents (a period of stay over 3 months, for example students, technical intern trainees, engineers, dependents or spouses), plus Digital Nomads (Designated Activities No. 53) and their families (No. 54). Tourists, business visitors and other short stays of 3 months or less, diplomats, and people returning on a re-entry permit are not covered. Indonesia's requirement starts on January 4, 2027; Myanmar and China have no start date yet.",
  },
  {
    q: "When does JPETS start in Indonesia?",
    a: `Panel Clinics in Indonesia are scheduled to accept screenings from ${fmtDate(COUNTRIES.indonesia.screeningStart!)}, and the TB Clearance Certificate is scheduled to become mandatory for COE and visa applications filed from ${fmtDate(COUNTRIES.indonesia.mandatoryFrom!)} (MHLW notice of September 25, 2026). The filing date is what counts: a COE filed on January 3, 2027 does not need it; one filed on January 4, 2027 does. Indonesia had the most foreign-born TB cases in Japan in 2025 (507).`,
  },
  {
    q: "Do specified skilled workers (tokutei ginou) need JPETS?",
    a: `Not for now. Specified Skilled Workers are on the government's temporary exemption list (当面の間、対象外), because that program already requires a pre-entry health check with a chest X-ray. The full list: ${exemptLabels.join("; ")}. The exemption is "for the time being" and can change.`,
  },
  {
    q: "Do technical intern trainees and students need it?",
    a: "Yes. Technical Intern Training (技能実習) and Student (留学, including Japanese language schools) are not on the exemption list, so nationals of the target countries need the certificate once their country's mandatory date has passed. The same applies to Employment for Skill Development (育成就労), which is scheduled to replace technical intern training on April 1, 2027; a Panel Clinic X-ray may also cover that program's X-ray item.",
  },
  {
    q: "How long is the JPETS TB clearance certificate valid?",
    a: "180 days from the date of the chest X-ray, or 90 days if, in the 2 months before the X-ray, you lived with or spent a long time in an enclosed space with someone diagnosed with active infectious pulmonary TB. It must be valid on the day you file the COE application (or the visa application without a COE). This checker counts the X-ray day as day 1, so a January 1 X-ray is treated as valid through June 29.",
  },
  {
    q: "Does the certificate need to be valid when I get my visa or land in Japan?",
    a: "No, if you submitted it with your COE application. According to the JPETS Q&A (Q17), the later visa application and landing do not have to fall within the 180 days, and you do not submit it again. Keep your own copy, because you may be asked to show it after entering Japan.",
  },
  {
    q: "My COE was filed before the mandatory date. Do I need the certificate for the visa?",
    a: "No. If the COE application was filed before your country's mandatory date and the COE was issued without a certificate, you do not need one when you apply for the visa, even after that date (Q&A 21), provided you have no TB symptoms such as a cough lasting more than two weeks.",
  },
  {
    q: "I am a national of a target country but live elsewhere. Am I exempt?",
    a: "Yes, if a residence permit or similar document shows you currently live outside the six target countries. With the COE application, submit a copy of that document with ISA's explanation form (説明書). If you live in another target country (for example a Nepali national in Viet Nam), the exemption does not apply. People already in Japan who change status or extend their stay are not asked for a certificate.",
  },
  {
    q: "Where can I get JPETS screening?",
    a: `Only at designated Panel Clinics. MHLW's list (Indonesia as of October 9, 2026) has ${CLINICS.length} clinics: the Philippines ${CLINICS.filter((c) => c.country === "philippines").length}, Nepal ${CLINICS.filter((c) => c.country === "nepal").length}, Viet Nam ${CLINICS.filter((c) => c.country === "vietnam").length} and Indonesia ${CLINICS.filter((c) => c.country === "indonesia").length} (${idClinicCities.join(", ")}). Indonesia's list is growing. Certificates from other hospitals are not accepted, even if their check-up says TB negative.`,
  },
  {
    q: "How much does the JPETS screening cost?",
    a: "The applicant pays, and the price depends on the Panel Clinic. MHLW does not publish one price; check with the clinic before you book. If you are found to have active TB, you get treated first and can be screened again with a Tuberculosis Treatment Report.",
  },
  {
    q: "Do children and pregnant women need JPETS?",
    a: "Yes, both are covered. Children under 5 usually get a tuberculin skin test or IGRA instead of an X-ray unless the exam suggests TB. Pregnant applicants can postpone the X-ray (and the application) until after delivery, or have it with double-layer lead shielding.",
  },
  {
    q: "Is there a free JPETS API for AI agents?",
    a: `Yes. Free, no key, CORS open: GET ${PUBLIC_URL}/api/check?nationality=indonesia&status=student&applicationDate=2027-01-15 returns the verdict, reasons, X-ray window, documents and the Panel Clinic list. All rules at ${PUBLIC_URL}/api/rules, OpenAPI at ${PUBLIC_URL}/openapi.json, and the japan_tb_screening_check tool on https://free-agent-tools.vercel.app/mcp.`,
  },
  {
    q: "入国前結核スクリーニングの対象者は？",
    a: "フィリピン・ネパール・ベトナム・インドネシア・ミャンマー・中国の国籍を持ち、中長期在留者（再入国許可者を除く）または特定活動告示53号・54号（デジタルノマドとその家族）として入国する人です。在留資格認定証明書（COE）交付申請時（COEなしで査証申請する場合は査証申請時）に、指定健診医療機関が発行した「結核非発病証明書」を提出します。特定技能、EPA看護師・介護福祉士、JET、JICA研修員などは当面の間対象外です。技能実習と留学は対象です。",
  },
  {
    q: "インドネシアの入国前結核スクリーニングはいつから？",
    a: "指定健診医療機関での健診受付は2026年11月2日から、結核非発病証明書の提出義務付けは2027年1月4日以降に申請されたCOE・査証申請から（いずれも予定）です。1月4日より前にCOEを申請し、証明書なしでCOEが交付された場合は、査証申請時の提出は不要です。証明書の有効期間は胸部レントゲン撮影日から原則180日です。",
  },
  {
    q: "Apakah saya perlu sertifikat bebas TB (JPETS) untuk ke Jepang?",
    a: "Warga negara Indonesia yang akan tinggal di Jepang lebih dari 3 bulan (misalnya pelajar, pemagang teknis/ginou jisshu, pekerja, keluarga) wajib melampirkan TB Clearance Certificate dari Klinik Panel yang ditunjuk saat mengajukan Certificate of Eligibility (COE) atau visa yang diajukan mulai 4 Januari 2027 (rencana). Pemeriksaan di Klinik Panel dibuka mulai 2 November 2026. Pekerja Berketerampilan Spesifik (Tokutei Ginou) untuk sementara dikecualikan. Sertifikat berlaku 180 hari sejak tanggal rontgen dada.",
  },
];

export default function HomePage() {
  const countries = Object.values(COUNTRIES);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · JPETS · Indonesia from Jan 4 2027</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Do I need a TB clearance certificate for Japan?</h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-foreground sm:text-xl">Japan Pre-Entry Tuberculosis Screening (JPETS) checker</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Moving to Japan from the Philippines, Nepal or Viet Nam? You already need a chest X-ray at a Panel Clinic before your COE. Indonesia joins for applications filed from January 4, 2027. Pick your case to see if it applies, when, and where to get screened.
        </p>
      </section>

      <section className="mt-8">
        <Calculator />
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">JPETS start dates by country</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nationality</th>
                <th className="px-4 py-3 font-medium">Panel Clinics open</th>
                <th className="px-4 py-3 font-medium">Certificate mandatory for applications filed from</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3 text-foreground">
                    {c.name} <span className="text-muted">{c.nameJa}</span>
                  </td>
                  <td className="px-4 py-3 font-mono">{c.screeningStart ? fmtDate(c.screeningStart) : "not announced"}</td>
                  <td className="px-4 py-3 font-mono">
                    {c.mandatoryFrom ? fmtDate(c.mandatoryFrom) : "not announced"}
                    {c.scheduled && c.mandatoryFrom ? " (scheduled)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Temporarily exempt: {exemptLabels.join("; ")}. Also exempt: nationals whose residence outside the six countries is documented.
        </p>
        <p className="mt-2 text-sm text-muted">
          Official pages:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://jpets.mhlw.go.jp/" target="_blank" rel="noopener noreferrer">
            JPETS (MHLW)
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://www.moj.go.jp/isa/10_00219.html" target="_blank" rel="noopener noreferrer">
            ISA
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href="https://www.mhlw.go.jp/content/001471856.pdf" target="_blank" rel="noopener noreferrer">
            Panel Clinic list (PDF)
          </a>
        </p>
      </section>

      <section className="mt-12 max-w-3xl rounded-3xl border border-line bg-panel/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">For AI agents and developers</h2>
        <p className="mt-2 text-sm text-muted">
          Keyless JSON, CORS open, GET or POST:{" "}
          <a className="font-mono text-foreground underline underline-offset-2" href="/api/check?nationality=indonesia&status=student&applicationDate=2027-01-15">
            /api/check?nationality=indonesia&amp;status=student&amp;applicationDate=2027-01-15
          </a>
          . All rules and clinics: <a className="font-mono text-foreground underline underline-offset-2" href="/api/rules">/api/rules</a>. Docs: <a className="underline underline-offset-2" href="/openapi.json">OpenAPI</a>,{" "}
          <a className="underline underline-offset-2" href="/llms.txt">llms.txt</a>, MCP tool <span className="font-mono text-foreground">japan_tb_screening_check</span> on{" "}
          <a className="underline underline-offset-2" href="https://free-agent-tools.vercel.app" target="_blank" rel="noopener noreferrer">
            free-agent-tools
          </a>
          .
        </p>
      </section>

      <FaqSection items={faq} heading="JPETS questions" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
