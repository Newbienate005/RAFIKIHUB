import { ImageResponse } from "next/og";

export const alt = "RafikiHub: get seen, get cast. Casting platform for performers in Kenya and Africa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#211F1C", padding: 80, color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 40, fontWeight: 800, display: "flex", letterSpacing: 2 }}>
          <span style={{ color: "#FF8033" }}>RAFIKI</span>HUB
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>Get seen.</div>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color: "#FF8033" }}>Get cast.</div>
        </div>
        <div style={{ fontSize: 32, color: "#D9D4CC" }}>Casting platform for actors and performers in Kenya and Africa</div>
      </div>
    ),
    size,
  );
}
