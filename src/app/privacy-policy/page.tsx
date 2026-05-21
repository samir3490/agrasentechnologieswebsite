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
    heading: "Information We Collect",
    content: `We may collect personal information that you voluntarily provide when using our website or services. This includes your name, email address, phone number, company name, and any other details you share through our contact forms or during consultations. We also automatically collect certain technical data such as your IP address, browser type, operating system, referring URLs, and browsing behavior on our site through cookies and similar technologies.`,
  },
  {
    heading: "How We Use Your Information",
    content: `The information we collect is used to provide and improve our IT consulting, application development, and business advisory services. Specifically, we use your data to respond to inquiries and service requests, deliver the services you have engaged us for, send relevant updates about our offerings (with your consent), improve website functionality and user experience, comply with legal obligations, and protect against fraudulent or unauthorized activity.`,
  },
  {
    heading: "Information Sharing",
    content: `Agrasen Technologies does not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your data with trusted service providers who assist in operating our website and delivering our services, but only under strict confidentiality agreements. We may also disclose information if required by law, regulation, or legal process, or to protect the rights, property, or safety of Agrasen Technologies, our clients, or others.`,
  },
  {
    heading: "Data Security",
    content: `We implement industry-standard technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS), secure server infrastructure, access controls, and regular security assessments. While no method of internet transmission or electronic storage is 100% secure, we strive to use commercially reasonable means to protect your data.`,
  },
  {
    heading: "Cookies",
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. Cookies are small data files stored on your device. You can control cookie settings through your browser preferences; however, disabling cookies may affect certain features of our website. We use essential cookies for site functionality and analytics cookies to understand how visitors interact with our site so we can continue to improve it.`,
  },
  {
    heading: "Third-Party Links",
    content: `Our website may contain links to external websites operated by third parties. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party website you visit. Inclusion of a link does not imply endorsement of the linked site by Agrasen Technologies.`,
  },
  {
    heading: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. When we make material changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your information.`,
  },
  {
    heading: "Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

Agrasen Technologies Inc.
1317 Edgewater Drive Suite 962
Orlando, FL 32804
Email: samir.agrawal@agrasentechnologies.com`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ─── Hero ─── */}
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

      {/* ─── Content ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-text-secondary leading-relaxed mb-12">
              At Agrasen Technologies Inc., we are committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website
              or engage with our services. Please read this policy carefully. By
              using our site, you consent to the practices described herein.
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
