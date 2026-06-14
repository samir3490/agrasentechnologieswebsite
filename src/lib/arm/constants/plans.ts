import type { AccountPlan } from "@/lib/arm/types";

export const PLAN_LIMITS = {
  free: 100,
  pro: 5000,
  business: 10000,
  enterprise: 100000,
} as const;

export const BILLING_PLANS: Record<
  Exclude<AccountPlan, "free" | "enterprise">,
  {
    label: string;
    priceInPaisa: number;
    periodDays: number;
    contactLimit: number;
    description: string;
  }
> = {
  pro: {
    label: "Pro",
    priceInPaisa: 49900,
    periodDays: 30,
    contactLimit: PLAN_LIMITS.pro,
    description: "Up to 5,000 contacts, AI assistant, map & news",
  },
  business: {
    label: "Business",
    priceInPaisa: 149900,
    periodDays: 30,
    contactLimit: PLAN_LIMITS.business,
    description: "Up to 10,000 contacts, priority features, team workspaces",
  },
};

export const DEFAULT_REMINDER_INTERVALS = [30, 15, 10, 7, 3, 1] as const;

export const RELATIONSHIP_TYPES = [
  "family",
  "friend",
  "colleague",
  "client",
  "prospect",
  "donor",
  "volunteer",
  "beneficiary",
  "employee",
  "vendor",
  "other",
] as const;
