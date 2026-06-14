import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/ai-relationship-manager/dashboard",
          "/ai-relationship-manager/contacts",
          "/ai-relationship-manager/map",
          "/ai-relationship-manager/settings",
          "/ai-relationship-manager/onboarding",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
