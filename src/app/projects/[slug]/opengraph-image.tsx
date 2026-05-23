import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/data";

export const runtime = "nodejs";
export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

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
        <div style={{ display: "flex", gap: 12, alignItems: "center", opacity: 0.7 }}>
          <div style={{ width: 8, height: 8, background: "#3B5BDB", borderRadius: 99 }} />
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Project
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 110,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          {project?.title ?? "Untitled"}
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.65, maxWidth: 900 }}>
          {project?.description ?? ""}
        </div>
      </div>
    ),
    size,
  );
}
