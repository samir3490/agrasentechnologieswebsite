import type { HealthLabel } from "@/lib/arm/types";
import { healthBadgeClass, healthLabelText } from "@/lib/arm/health/score";

export function HealthBadge({
  label,
  score,
  compact,
}: {
  label: HealthLabel;
  score?: number;
  compact?: boolean;
}) {
  return (
    <span
      className={`badge ${healthBadgeClass(label)} ${compact ? "text-[10px] px-2 py-0" : ""}`}
      title={score != null ? `Health score: ${score}` : undefined}
    >
      {healthLabelText(label)}
      {score != null && !compact ? ` · ${score}` : ""}
    </span>
  );
}
