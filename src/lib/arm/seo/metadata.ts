import type { Metadata } from "next";
import { SITE } from "@/lib/arm/site";
import { ARM_LANDING_URL, SITE_URL } from "@/lib/site-url";

const description =
  "AI Relationship Manager is a free personal CRM for birthdays, anniversaries, client follow-ups, and donor relationships. Track contacts, log interactions, get AI gift ideas, map your network, and never miss an important date.";

export const armLandingMetadata: Metadata = {
  title: `${SITE.product} — Personal CRM for Birthdays, Clients & Donors`,
  description,
  keywords: [
    "personal CRM",
    "relationship manager",
    "birthday reminder app",
    "contact management",
    "donor management NGO",
    "client follow up",
    "anniversary reminders",
    "AI gift suggestions",
    "India CRM",
    SITE.company,
  ],
  alternates: {
    canonical: ARM_LANDING_URL,
  },
  openGraph: {
    title: `${SITE.product} | ${SITE.company}`,
    description,
    url: ARM_LANDING_URL,
    siteName: SITE.company,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.product} — Personal CRM`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const armAppMetadata: Metadata = {
  robots: { index: false, follow: false },
};

export function armSoftwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.product,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description,
    url: ARM_LANDING_URL,
    provider: {
      "@type": "Organization",
      name: SITE.company,
      url: SITE_URL,
    },
  };
}

export function armFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is AI Relationship Manager?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A personal CRM that helps you track contacts, birthdays, anniversaries, interactions, and relationship health for family, clients, donors, and colleagues.",
        },
      },
      {
        "@type": "Question",
        name: "Is it free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The free plan includes up to 100 contacts. Pro and Business plans add higher limits and are available per workspace.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my own API keys?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Each workspace can connect its own OpenAI, Mapbox, email, and Google OAuth credentials in Settings → Connections.",
        },
      },
    ],
  };
}
