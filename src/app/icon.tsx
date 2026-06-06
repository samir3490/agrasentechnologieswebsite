import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
          position: "relative",
        }}
      >
        {/* Golden accent mark from logo (dot above the "i") */}
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 10,
            height: 5,
            background: "#FFB81C",
            borderTopRightRadius: 4,
            borderTopLeftRadius: 1,
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1C1C1E",
            fontFamily: "Arial, sans-serif",
            marginTop: 2,
            marginRight: 2,
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size }
  );
}
