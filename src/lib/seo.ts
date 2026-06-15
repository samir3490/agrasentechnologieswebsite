import type { Metadata } from "next";
import type { BlogPost } from "@/data/posts";
import { SITE_URL } from "@/lib/site-url";

export const SITE = {
  name: "Agrasen Technologies",
  legalName: "Agrasen Technologies Inc.",
  tagline: "IT Consulting & Application Development",
  description:
    "Agrasen Technologies delivers IT consulting, QuickBase & Smartsheet development, and strategic business solutions. Based in Orlando, FL with over 15 years of experience.",
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
  "IT Consulting",
  "Application Development",
  "Web Design",
  "UI/UX Design",
  "SEO Optimization",
  "Mobile Design",
  "Business Management Mentoring",
  "Branding & Identity",
] as const;

export function siteUrl(path = ""): string {
  return path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
}

export function ogImageUrl(path = "/opengraph-image"): string {
  return siteUrl(path);
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
  const image = ogImage ? siteUrl(ogImage.startsWith("/") ? ogImage : `/${ogImage}`) : defaultOgImage.url;
  const images = [{ url: image, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates: { canonical: url },
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
          url: siteUrl("/contact"),
          availableLanguage: "English",
        },
        areaServed: SITE.areaServed,
        sameAs: [],
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
    name: "IT Consulting Services",
    description: "Professional IT consulting and development services from Agrasen Technologies.",
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
        url: siteUrl("/services"),
      },
    })),
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
