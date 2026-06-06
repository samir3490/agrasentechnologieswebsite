import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF8",
          borderRadius: 32,
          position: "relative",
        }}
      >
        {/* Golden accent mark from logo */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 52,
            height: 26,
            background: "#FFB81C",
            borderTopRightRadius: 18,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
          }}
        />
        <div
          style={{
            fontSize: 118,
            fontWeight: 700,
            color: "#1C1C1E",
            fontFamily: "Arial, sans-serif",
            marginTop: 8,
            marginRight: 8,
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size }
  );
}
