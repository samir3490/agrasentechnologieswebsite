export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://agrasentechnologies.com";

export const ARM_PUBLIC_PATH = "/ai-relationship-manager";

export const ARM_LANDING_URL = `${SITE_URL}${ARM_PUBLIC_PATH}`;
