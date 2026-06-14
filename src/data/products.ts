export type ProductStatus = "available" | "coming-soon";

export type ProductIcon = "relationship" | "recruitment" | "analytics";

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** External app URL or internal path */
  href?: string;
  ctaLabel?: string;
  status: ProductStatus;
  icon: ProductIcon;
  highlights: string[];
  audiences?: string[];
  /** Long-form feature blocks for product detail page */
  features?: ProductFeature[];
  /** SEO meta description override for detail page */
  seoDescription?: string;
}

/** Page copy — edit here when adding products or updating messaging */
export const productsPage = {
  title: "Our Products",
  subtitle:
    "Software built by Agrasen Technologies to help people and organizations work smarter — from relationship management to recruitment and beyond.",
  sectionLabel: "Product Suite",
  sectionTitle: "Tools We Build & Operate",
  sectionDescription:
    "Each product is designed for real-world use by professionals, families, NGOs, and growing businesses.",
};

export const products: Product[] = [
  {
    id: "ai-relationship-manager",
    name: "AI Relationship Manager",
    tagline: "Your personal CRM for every relationship that matters",
    description:
      "An AI-powered relationship platform that helps you stay connected with family, friends, clients, donors, volunteers, and colleagues. Track contacts, never miss a birthday or anniversary, log interactions, and get daily reminders so important relationships stay warm.",
    href: "/ai-relationship-manager",
    ctaLabel: "Try it free",
    status: "available",
    icon: "relationship",
    highlights: [
      "Rich contact profiles — personal, work, interests, and gifting preferences",
      "Birthday & anniversary reminders with daily digest emails",
      "Modes for personal life, business, and NGO relationship management",
      "Interaction logging and relationship health insights",
      "AI gift suggestions with Amazon.in search links",
    ],
    audiences: ["Individuals", "Families", "Sales teams", "NGOs", "Community leaders"],
    seoDescription:
      "AI Relationship Manager is a free personal CRM for birthdays, anniversaries, client follow-ups, and donor relationships. Reminders, AI gift ideas, network map, Google Calendar sync, and BYOK for teams.",
    features: [
      {
        title: "Never miss an important date",
        description:
          "Birthday and anniversary reminders with a daily digest email. Sync yearly events to Google Calendar automatically.",
      },
      {
        title: "Rich contact profiles",
        description:
          "Personal, business, and NGO fields — interests, gifting preferences, company, location, and relationship type in one place.",
      },
      {
        title: "Relationship health",
        description:
          "Health scores from your last interaction show who needs attention. Log calls, meetings, and messages to keep scores current.",
      },
      {
        title: "AI assistant",
        description:
          "Gift suggestions with Amazon.in links and message drafts for check-ins, birthdays, and follow-ups — OpenAI optional.",
      },
      {
        title: "Network map",
        description:
          "See contacts on a Mapbox map by city. Geocoding runs when you save a location.",
      },
      {
        title: "Your keys, your workspace",
        description:
          "Each workspace is independent with its own API connections — OpenAI, Mapbox, email, news, and Google OAuth — encrypted per tenant.",
      },
    ],
  },
];

/** Lookup helper for future product detail pages */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
