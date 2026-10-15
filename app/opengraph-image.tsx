import { ImageResponse } from "next/og";

export const alt = "Japan TB Screening Check (JPETS): do I need a TB clearance certificate for Japan?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "64px", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "#f0b429" }}>Free · Japan · JPETS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1050 }}>Do I need a TB clearance certificate for Japan?</div>
          <div style={{ display: "flex", fontSize: 30, color: "#9b9588", maxWidth: 1050, lineHeight: 1.35 }}>
            Philippines · Nepal · Viet Nam now · Indonesia from Jan 4, 2027 · Myanmar & China TBD
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 22, color: "#9b9588" }}>
          <span style={{ color: "#99f6e4" }}>Exemptions</span>
          <span>180-day validity</span>
          <span>Panel Clinics</span>
          <span>Free JSON API · no login</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
