export const GA_MEASUREMENT_ID =
  typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === "string" &&
  /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : "";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackFormSubmit({
  eventName,
  formId,
  source,
}: {
  eventName: string;
  formId: string;
  source: string;
}) {
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    form_id: formId,
    lead_source: source,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      method: "hubspot",
      form_id: formId,
      lead_source: source,
    });
  }
}
