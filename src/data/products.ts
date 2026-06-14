export type ProductStatus = "available" | "coming-soon";

export type ProductIcon = "relationship" | "recruitment" | "analytics";

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
  },
];

/** Lookup helper for future product detail pages */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
