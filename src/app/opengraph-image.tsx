import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#FAF8F5",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            width: 72,
            height: 6,
            background: "#D4A017",
            marginBottom: 36,
          }}
        />
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#D4A017",
            marginTop: 20,
            fontWeight: 600,
            maxWidth: 820,
            lineHeight: 1.35,
          }}
        >
          {SITE.tagline}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#5C5C5C",
            marginTop: 28,
            maxWidth: 760,
            lineHeight: 1.45,
          }}
        >
          QuickBase · Smartsheet · Low-code · Orlando, FL
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#888888",
            marginTop: 40,
          }}
        >
          agrasentechnologies.com
        </div>
      </div>
    ),
    { ...size }
  );
}
