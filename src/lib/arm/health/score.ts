import type { Contact, GiftSuggestion, HealthLabel } from "@/lib/arm/types";

export function computeHealthScore(
  lastInteractionAt?: string,
  now: Date = new Date()
): { score: number; label: HealthLabel } {
  if (!lastInteractionAt) {
    return { score: 45, label: "weak" };
  }

  const days = Math.floor(
    (now.getTime() - new Date(lastInteractionAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 14) return { score: 95, label: "strong" };
  if (days <= 30) return { score: 85, label: "strong" };
  if (days <= 60) return { score: 70, label: "moderate" };
  if (days <= 120) return { score: 50, label: "moderate" };
  if (days <= 180) return { score: 35, label: "weak" };
  return { score: 15, label: "dormant" };
}

export function enrichContactHealth<T extends Pick<Contact, "lastInteractionAt" | "healthScore" | "healthLabel">>(
  contact: T
): T & { healthScore: number; healthLabel: HealthLabel } {
  const { score, label } = computeHealthScore(contact.lastInteractionAt);
  return { ...contact, healthScore: score, healthLabel: label };
}

export function healthLabelText(label: HealthLabel) {
  return { strong: "Strong", moderate: "Moderate", weak: "Weak", dormant: "Dormant" }[label];
}

export function healthBadgeClass(label: HealthLabel) {
  switch (label) {
    case "strong":
      return "bg-emerald-100 text-emerald-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "weak":
      return "bg-orange-100 text-orange-800";
    case "dormant":
      return "bg-slate-200 text-slate-600";
  }
}
