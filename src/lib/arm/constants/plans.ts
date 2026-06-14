export const PLAN_LIMITS = {
  free: 100,
  pro: 5000,
  business: 5000,
  enterprise: 100000,
} as const;

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
