import type { Metadata } from "next";
import ServiceLandingPage from "@/components/ServiceLandingPage";
import { getServiceLanding } from "@/data/service-landings";
import { pageMetadata } from "@/lib/seo";

const service = getServiceLanding("low-code-applications")!;

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.description,
  path: `/services/${service.slug}`,
});

export default function LowCodeApplicationsPage() {
  return <ServiceLandingPage service={service} />;
}
