import { ImageResponse } from "next/og";
import { checkJpets } from "@/lib/jpets";
import { EXAMPLE_SHARED, NATIONALITY_LABEL, VERDICT_COLOR, VERDICT_LABEL, fmtDate, parseShared, toCheckInput } from "@/lib/share";

export async function GET(req: Request) {
  const shared = parseShared(new URL(req.url).searchParams) ?? EXAMPLE_SHARED;
  const r = checkJpets(toCheckInput(shared));
  const stats = [
    { label: "application filed", value: fmtDate(shared.applicationDate) },
    { label: r.timeline?.scheduled ? "mandatory from (scheduled)" : "mandatory from", value: r.timeline?.mandatoryFrom ? fmtDate(r.timeline.mandatoryFrom) : r.timeline ? "not announced" : "n/a" },
    { label: "certificate validity", value: r.certificate ? `${r.certificate.validityDays} days` : "—" },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "56px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>Japan TB Screening · JPETS</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>rules as of {r.rulesAsOf}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, color: "#c9c3b6" }}>
            {NATIONALITY_LABEL[shared.nationality]} · {r.input.statusLabel.split(" (")[0]}
          </div>
          <div style={{ display: "flex", marginTop: 10, fontSize: 84, fontWeight: 800, letterSpacing: "-0.03em", color: VERDICT_COLOR[r.verdict], lineHeight: 1.05 }}>{VERDICT_LABEL[r.verdict]}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #23252c", borderRadius: 24, padding: "14px 20px", background: "#101218" }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: "#f3efe4" }}>{s.value}</span>
              <span style={{ fontSize: 20, color: "#9b9588" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>japan-tb-screening.vercel.app · free, no login</span>
          <span>Not legal or medical advice.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}
