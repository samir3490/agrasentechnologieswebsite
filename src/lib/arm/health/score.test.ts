import { describe, expect, it } from "vitest";
import { computeHealthScore, enrichContactHealth, healthLabelText } from "./score";

describe("health score", () => {
  const now = new Date("2026-06-14T12:00:00Z");

  it("returns weak when no last interaction", () => {
    expect(computeHealthScore(undefined, now)).toEqual({ score: 45, label: "weak" });
  });

  it("returns strong for recent interaction", () => {
    expect(computeHealthScore("2026-06-10T12:00:00Z", now)).toEqual({ score: 95, label: "strong" });
  });

  it("returns dormant after 180+ days", () => {
    expect(computeHealthScore("2025-01-01T12:00:00Z", now)).toEqual({ score: 15, label: "dormant" });
  });

  it("enriches contact with score and label", () => {
    const enriched = enrichContactHealth({ lastInteractionAt: "2026-06-01T12:00:00Z" });
    expect(enriched.healthLabel).toBe("strong");
    expect(enriched.healthScore).toBeGreaterThan(80);
  });

  it("formats label text", () => {
    expect(healthLabelText("dormant")).toBe("Dormant");
  });
});
