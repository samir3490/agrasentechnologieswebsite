import type { Metadata } from "next";
import ServiceLandingPage from "@/components/ServiceLandingPage";
import { getServiceLanding } from "@/data/service-landings";
import { pageMetadata } from "@/lib/seo";

const service = getServiceLanding("smartsheet-solutions")!;

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.description,
  path: `/services/${service.slug}`,
});

export default function SmartsheetSolutionsPage() {
  return <ServiceLandingPage service={service} />;
}
