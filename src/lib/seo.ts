import type { Metadata } from "next";
import type { BlogPost } from "@/data/posts";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/contact";
import { SITE_URL } from "@/lib/site-url";

export const SITE = {
  name: "Agrasen Technologies",
  legalName: "Agrasen Technologies Inc.",
  tagline: "QuickBase & Low-Code Applications",
  description:
    "Agrasen Technologies builds custom QuickBase applications, Smartsheet solutions, and other low-code systems. Based in Orlando, FL with over 15 years of experience.",
  locale: "en_US",
  address: {
    streetAddress: "1317 Edgewater Drive Suite 536",
    addressLocality: "Orlando",
    addressRegion: "FL",
    postalCode: "32804",
    addressCountry: "US",
  },
  founder: "Samir Agrawal",
  foundingDate: "2010",
  areaServed: ["Orlando", "Florida", "United States"],
} as const;

export const MARKETING_SERVICES = [
  "QuickBase Development",
  "Low-Code Applications",
  "Smartsheet Solutions",
  "IT Consulting",
  "Web Design",
  "UI/UX Design",
  "SEO Optimization",
  "Mobile Design",
  "Business Management Mentoring",
  "Branding & Identity",
] as const;

export const MARKETING_SERVICE_PATHS: Record<(typeof MARKETING_SERVICES)[number], string> = {
  "QuickBase Development": "/services/quickbase-development",
  "Low-Code Applications": "/services/low-code-applications",
  "Smartsheet Solutions": "/services/smartsheet-solutions",
  "IT Consulting": "/services#it-consulting",
  "Web Design": "/services#web-design",
  "UI/UX Design": "/services#ui-ux-design",
  "SEO Optimization": "/services#seo-optimization",
  "Mobile Design": "/services#mobile-design",
  "Business Management Mentoring": "/services#business-management-mentoring",
  "Branding & Identity": "/services#branding-identity",
};

export function siteUrl(path = ""): string {
  return path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
}

export const RSS_FEED_PATH = "/blog/rss.xml";

export function ogImageUrl(path = "/opengraph-image"): string {
  return siteUrl(path);
}

/** Keep RSS discovery on every page even when child metadata sets a canonical. */
export function rssAlternateTypes(): NonNullable<Metadata["alternates"]>["types"] {
  return {
    "application/rss+xml": [
      {
        url: siteUrl(RSS_FEED_PATH),
        title: `${SITE.name} Blog`,
      },
    ],
  };
}

export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
}): Metadata {
  const url = siteUrl(path);
  const image = ogImage ? siteUrl(ogImage.startsWith("/") ? ogImage : `/${ogImage}`) : ogImageUrl();
  const images = [{ url: image, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: rssAlternateTypes(),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: ogType,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function siteJsonLdGraph() {
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.legalName,
        alternateName: SITE.name,
        url: SITE_URL,
        logo: siteUrl("/logo.png"),
        image: ogImageUrl(),
        description: SITE.description,
        foundingDate: SITE.foundingDate,
        founder: {
          "@type": "Person",
          name: SITE.founder,
        },
        address: {
          "@type": "PostalAddress",
          ...SITE.address,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: CONTACT_EMAIL,
          url: siteUrl("/contact"),
          availableLanguage: "English",
        },
        areaServed: SITE.areaServed,
        sameAs: [
          SOCIAL_LINKS.linkedinCompany,
          SOCIAL_LINKS.linkedinPerson,
          SOCIAL_LINKS.github,
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: SITE.legalName,
        image: ogImageUrl(),
        url: SITE_URL,
        description: SITE.description,
        address: {
          "@type": "PostalAddress",
          ...SITE.address,
        },
        parentOrganization: { "@id": orgId },
        priceRange: "$$",
        email: CONTACT_EMAIL,
        sameAs: [SOCIAL_LINKS.linkedinCompany],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },
    ],
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "QuickBase and Low-Code Services",
    description: "Custom QuickBase applications, low-code systems, and IT consulting from Agrasen Technologies.",
    url: siteUrl("/services"),
    itemListElement: MARKETING_SERVICES.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: {
          "@type": "Organization",
          name: SITE.legalName,
          url: SITE_URL,
        },
        areaServed: SITE.areaServed,
        url: siteUrl(MARKETING_SERVICE_PATHS[name]),
      },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: siteUrl(path),
    provider: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE_URL,
    },
    areaServed: SITE.areaServed,
    serviceType: name,
  };
}

export function blogPostingJsonLd(post: BlogPost) {
  const url = siteUrl(`/blog/${post.slug}`);
  const image = post.image ? siteUrl(post.image) : ogImageUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: url,
    url,
    articleSection: post.category,
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}
