import type { Metadata } from "next";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";

export const metadata: Metadata = {
  title: "Privacy Policy | Agrasen Technologies",
  description:
    "Learn how Agrasen Technologies collects, uses, and protects your personal information. Read our full privacy policy.",
};

const sections = [
  {
    heading: "Introduction",
    content: `Agrasen Technologies Inc. ("Agrasen Technologies," "we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit agrasentechnologies.com (the "Site"), contact us, subscribe to our communications, or use our IT consulting and related services.

By using our Site or services, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    heading: "Information We Collect",
    content: `We may collect the following categories of information:

Personal Information You Provide
• Name, email address, phone number, and company name
• Messages and details submitted through contact forms, quote requests, or consultations
• Billing and project-related information when you engage our services

Automatically Collected Information
• IP address, browser type, device type, and operating system
• Pages visited, time spent on pages, and referring URLs
• Cookie identifiers and similar tracking technologies

Information from Third Parties
• Analytics and marketing tools (such as Google Analytics and HubSpot)
• Professional networking platforms if you connect with us through those channels`,
  },
  {
    heading: "How We Use Your Information",
    content: `We use collected information to:

• Respond to inquiries, quote requests, and service-related communications
• Deliver IT consulting, development, and advisory services you request
• Send newsletters, updates, or marketing communications (with your consent where required)
• Improve our Site, services, and customer experience
• Analyze Site traffic and user behavior
• Maintain security and prevent fraud or abuse
• Comply with legal obligations and enforce our agreements

We process information based on legitimate business interests, contractual necessity, your consent, or legal requirements, as applicable.`,
  },
  {
    heading: "Cookies and Tracking Technologies",
    content: `Our Site uses cookies and similar technologies to operate effectively and understand how visitors use our content. These may include:

• Essential cookies required for Site functionality
• Analytics cookies to measure traffic and performance
• Marketing and chat cookies (including HubSpot) to support lead communication and customer support

You can manage cookie preferences through your browser settings. Disabling cookies may limit certain Site features. Where required by law, we will obtain consent before placing non-essential cookies.`,
  },
  {
    heading: "Information Sharing and Disclosure",
    content: `We do not sell your personal information. We may share information with:

• Service providers who assist with hosting, analytics, email, CRM, payment processing, or IT infrastructure, under confidentiality obligations
• Professional advisors (legal, accounting) when necessary
• Law enforcement or regulatory authorities when required by law or to protect rights and safety
• Successor entities in connection with a merger, acquisition, or business transfer

All third-party partners are expected to handle data in accordance with applicable privacy laws and our contractual requirements.`,
  },
  {
    heading: "Data Retention",
    content: `We retain personal information only as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law. Retention periods may vary based on:

• The nature of our relationship with you
• Legal, tax, and accounting requirements
• Ongoing business or contractual needs

When information is no longer needed, we take reasonable steps to delete or anonymize it.`,
  },
  {
    heading: "Data Security",
    content: `We implement administrative, technical, and organizational safeguards designed to protect your information, including:

• SSL/TLS encryption for data transmitted through our Site
• Access controls and authentication for internal systems
• Secure hosting and infrastructure practices
• Periodic review of security measures

No method of transmission or storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.`,
  },
  {
    heading: "Your Privacy Rights",
    content: `Depending on your location, you may have rights regarding your personal information, including the right to:

• Access the personal information we hold about you
• Request correction of inaccurate information
• Request deletion of your information, subject to legal exceptions
• Opt out of marketing communications
• Restrict or object to certain processing activities
• Request a portable copy of your data where applicable

To exercise these rights, contact us using the information below. We will respond within the timeframe required by applicable law.`,
  },
  {
    heading: "California Privacy Rights (CCPA/CPRA)",
    content: `If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), including the right to know what personal information we collect, request deletion, and opt out of the sale or sharing of personal information.

Agrasen Technologies does not sell personal information. To submit a privacy request, contact us at the address below. We will verify your identity before processing requests.`,
  },
  {
    heading: "Children's Privacy",
    content: `Our Site and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us and we will take steps to delete it promptly.`,
  },
  {
    heading: "International Users",
    content: `Agrasen Technologies is based in the United States. If you access our Site from outside the U.S., your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate. By using our Site, you consent to such transfers subject to applicable law.`,
  },
  {
    heading: "Third-Party Links",
    content: `Our Site may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    heading: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.`,
  },
  {
    heading: "Contact Us",
    content: `If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:

Agrasen Technologies Inc.
1317 Edgewater Drive Suite 536
Orlando, FL 32804
Email: samir dot agrawal at agrasentechnologies dot com`,
  },
];

export default function PrivacyPolicyPage() {
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
              <span className="text-accent">Privacy Policy</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Privacy Policy
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
              At Agrasen Technologies Inc., we are committed to protecting your
              privacy. This Privacy Policy explains how we handle your personal
              information when you visit our website or work with us.
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
