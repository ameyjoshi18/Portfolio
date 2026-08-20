import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = "Amey Joshi — Complexity in. Clarity out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#061a24",
          color: "#f4f7f6",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 20,
            justifyContent: "space-between",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>{site.name}</span>
          <span>Banking systems / delivery clarity</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              background: "#ff6b4a",
              display: "flex",
              height: 6,
              marginBottom: 42,
              width: 170,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Georgia, serif",
              fontSize: 102,
              letterSpacing: "-0.045em",
              lineHeight: 0.88,
            }}
          >
            <span>Complexity in.</span>
            <span>Clarity out.</span>
          </div>
        </div>

        <div
          style={{
            borderTop: "2px solid rgba(244,247,246,0.25)",
            display: "flex",
            fontSize: 23,
            justifyContent: "space-between",
            paddingTop: 22,
          }}
        >
          <span>{site.role}</span>
          <span>{site.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
