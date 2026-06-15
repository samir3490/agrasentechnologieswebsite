import type { Metadata } from "next";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service | Agrasen Technologies",
  description:
    "Read the Terms of Service for Agrasen Technologies. These terms govern your use of our website and IT consulting services.",
  path: "/terms-of-service",
});

const sections = [
  {
    heading: "Acceptance of Terms",
    content: `By accessing or using the website at agrasentechnologies.com (the "Site") or engaging Agrasen Technologies Inc. ("Agrasen Technologies," "we," "us," or "our") for services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Site or services.

These Terms apply to all visitors, users, clients, and others who access the Site or receive services from us.`,
  },
  {
    heading: "Description of Services",
    content: `Agrasen Technologies provides IT consulting, application development, web design, UI/UX, SEO, business mentoring, and related professional technology services. Specific deliverables, timelines, fees, and scope of work are defined in separate statements of work, proposals, or service agreements between you and Agrasen Technologies.

Information on this Site is provided for general informational purposes and does not constitute a binding offer unless confirmed in a signed agreement.`,
  },
  {
    heading: "Use of the Website",
    content: `You agree to use the Site only for lawful purposes and in accordance with these Terms. You may not:

• Use the Site in any way that violates applicable federal, state, local, or international law
• Attempt to gain unauthorized access to any portion of the Site, servers, or systems connected to the Site
• Introduce viruses, malware, or other harmful code
• Scrape, crawl, or harvest data from the Site without our prior written consent
• Impersonate Agrasen Technologies, our employees, or any other person or entity
• Use the Site to transmit spam, unsolicited communications, or misleading information

We reserve the right to suspend or restrict access to the Site at our discretion if we believe these Terms have been violated.`,
  },
  {
    heading: "Intellectual Property",
    content: `All content on this Site — including text, graphics, logos, images, software, and design — is the property of Agrasen Technologies or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws.

You may view and download content for personal, non-commercial use only. You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any Site content without our prior written permission.

"Agrasen Technologies" and associated logos are trademarks of Agrasen Technologies Inc. Unauthorized use is prohibited.`,
  },
  {
    heading: "Client Projects and Deliverables",
    content: `Unless otherwise agreed in writing:

• Client-provided materials remain the property of the client
• Custom work product created specifically for a client under a paid engagement may be transferred to the client upon full payment, as specified in the applicable agreement
• Agrasen Technologies retains the right to use general knowledge, skills, and non-proprietary techniques gained during a project
• We may showcase completed work in our portfolio, case studies, or marketing materials unless a confidentiality agreement states otherwise

Pre-existing tools, frameworks, templates, and proprietary methodologies developed by Agrasen Technologies remain our intellectual property.`,
  },
  {
    heading: "Payment and Billing",
    content: `Fees for services are as quoted in proposals, invoices, or signed agreements. Unless stated otherwise:

• Payment terms are net 15 or net 30 from invoice date
• Late payments may incur interest or suspension of services
• Deposits or retainers may be required before work begins
• Third-party costs (hosting, licenses, subscriptions) are billed separately when applicable

All fees are quoted in U.S. dollars unless otherwise specified.`,
  },
  {
    heading: "Confidentiality",
    content: `Both parties may receive confidential information during the course of a business relationship. Each party agrees to:

• Protect confidential information with reasonable care
• Use confidential information only for the purpose of the engagement
• Not disclose confidential information to third parties without prior written consent, except as required by law

Confidentiality obligations survive termination of the business relationship, as specified in any applicable non-disclosure or service agreement.`,
  },
  {
    heading: "Disclaimer of Warranties",
    content: `THE SITE AND ITS CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. Professional services are provided with reasonable skill and care consistent with industry standards, but specific outcomes are not guaranteed unless expressly stated in a signed agreement.`,
  },
  {
    heading: "Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGRASEN TECHNOLOGIES INC. AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR OUR SERVICES.

OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SITE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).

Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.`,
  },
  {
    heading: "Indemnification",
    content: `You agree to indemnify, defend, and hold harmless Agrasen Technologies and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or related to:

• Your use of the Site
• Your violation of these Terms
• Your violation of any rights of a third party
• Content or materials you provide to us for use in a project`,
  },
  {
    heading: "Third-Party Links and Services",
    content: `The Site may contain links to third-party websites, tools, or services (including HubSpot, analytics providers, and cloud platforms). We do not control and are not responsible for the content, privacy practices, or availability of third-party sites or services. Your use of third-party services is subject to their respective terms and policies.`,
  },
  {
    heading: "Termination",
    content: `We may terminate or suspend your access to the Site at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

Service engagements may be terminated in accordance with the terms of the applicable service agreement. Upon termination, provisions that by their nature should survive (including intellectual property, confidentiality, disclaimers, and limitation of liability) will remain in effect.`,
  },
  {
    heading: "Governing Law and Dispute Resolution",
    content: `These Terms are governed by and construed in accordance with the laws of the State of Florida, United States, without regard to conflict of law principles.

Any dispute arising out of or relating to these Terms or the Site shall be resolved in the state or federal courts located in Orange County, Florida, and you consent to the personal jurisdiction of such courts.

Before initiating formal legal proceedings, both parties agree to attempt to resolve disputes informally by contacting us at the address below.`,
  },
  {
    heading: "Changes to These Terms",
    content: `We may revise these Terms at any time by updating this page. The "Last Updated" date at the top reflects the most recent revision. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.

For active service engagements, material changes to project-specific terms will be communicated separately and may require mutual agreement.`,
  },
  {
    heading: "Contact Us",
    content: `If you have questions about these Terms of Service, please contact us:

Agrasen Technologies Inc.
1317 Edgewater Drive Suite 536
Orlando, FL 32804
Email: samir dot agrawal at agrasentechnologies dot com`,
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <section className="relative overflow-hidden py-28 md:py-36">
        <ParticleField />
        <GradientOrb
          className="-top-32 -right-32"
          size={380}
          color1="#D4A017"
          color2="#B8860B"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <nav className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Terms of Service</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Terms of Service
            </h1>
            <p className="mt-4 text-sm text-text-secondary">
              Last updated: May 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-text-secondary leading-relaxed mb-12">
              These Terms of Service govern your access to and use of the
              Agrasen Technologies website and our professional IT consulting
              services. Please read them carefully before using our Site or
              engaging our team.
            </p>
          </ScrollReveal>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <ScrollReveal key={section.heading} delay={0.05 * i}>
                <article>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {i + 1}. {section.heading}
                  </h2>
                  <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
