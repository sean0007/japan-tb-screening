export const SITE_NAME = "Japan TB Screening Check (JPETS)";

export const SITE_TAGLINE =
  "Do you need Japan's pre-entry TB clearance certificate? Nationals of the Philippines, Nepal and Viet Nam already do for stays over 3 months; Indonesia joins for COE and visa applications filed from January 4, 2027. Check your case, the exemptions (specified skilled workers are exempt for now), the 180-day validity and the designated Panel Clinics.";

export const DISCLAIMER_SHORT = "Educational guide, not immigration, legal or medical advice. Immigration (ISA), the embassy and the Panel Clinic decide; scheduled dates can move.";

export const HONESTY =
  "Rules as of 2026-10-15 from the JPETS guideline (revised 2026-09-25), the MHLW Q&A, ISA's JPETS page and MHLW's Panel Clinic list (Indonesia per 2026-10-09). Not affiliated with MHLW, ISA, MOFA or any clinic.";

export const SIBLING_TOOLS = [
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://kyushu-travel-discount.vercel.app", label: "Kyushu Travel Discount" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-intl-postage.vercel.app", label: "Japan International Postage 2027" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-parttime-check.vercel.app", label: "Japan Part-time Work Check" },
  { href: "https://japan-driving-check.vercel.app", label: "Japan Driving Check" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-tb-screening.vercel.app";
}
