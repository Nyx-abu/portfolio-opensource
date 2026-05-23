import { ImageResponse } from "next/og";
import { siteMeta } from "@/lib/metadata";

export const runtime = "edge";
export const alt = siteMeta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: 80,
          background: "#0a0a0a",
          color: "#f5f3ef",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, background: "#3B5BDB", borderRadius: 99 }} />
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.7,
              fontFamily: "monospace",
            }}
          >
            {siteMeta.name}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          <div>Engineer.</div>
          <div style={{ color: "#a3a3a3", fontStyle: "italic" }}>Designer.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.6 }}>
          <span>{siteMeta.description}</span>
        </div>
      </div>
    ),
    size,
  );
}
