import type { Metadata } from "next";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Agrasen Technologies",
  description:
    "Get in touch with Agrasen Technologies for IT consulting, web development, SEO, and business solutions. Located in Orlando, FL.",
};

const contactCards = [
  {
    key: "address",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
    label: "USA Office",
    lines: [
      "Agrasen Technologies Inc.",
      "1317 Edgewater Drive Suite 962",
      "Orlando, FL 32804",
    ],
  },
  {
    key: "email",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    ),
    label: "Email Us",
    lines: ["samir.agrawal@agrasentechnologies.com"],
    href: "mailto:samir.agrawal@agrasentechnologies.com",
  },
  {
    key: "hours",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    label: "Business Hours",
    lines: ["Monday – Friday", "9:00 AM – 6:00 PM EST"],
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <ParticleField />
        <GradientOrb
          className="-top-32 -right-32"
          size={420}
          color1="#38bdf8"
          color2="#818cf8"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <nav className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Contact</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Get In Touch
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Let&apos;s discuss how we can help transform your business
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Info Cards */}
            <div className="space-y-6">
              <SectionHeading
                label="Contact Info"
                title="Let's Start a Conversation"
                description="Reach out through any of the channels below and our team will get back to you within 24 hours."
                centered={false}
              />

              <div className="space-y-5 mt-8">
                {contactCards.map((card, i) => (
                  <ScrollReveal key={card.key} delay={0.1 * (i + 1)}>
                    <div className="glass rounded-xl p-5 flex items-start gap-4 hover:border-accent/40 transition-colors">
                      <div className="shrink-0 w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">
                          {card.label}
                        </h3>
                        {card.lines.map((line) =>
                          card.href ? (
                            <a
                              key={line}
                              href={card.href}
                              className="block text-sm text-text-secondary hover:text-accent transition-colors break-all"
                            >
                              {line}
                            </a>
                          ) : (
                            <p
                              key={line}
                              className="text-sm text-text-secondary"
                            >
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <ScrollReveal delay={0.15} direction="right">
              <div className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6">
                  Send Us a Message
                </h3>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Map Placeholder ─── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative glass rounded-2xl overflow-hidden h-72 md:h-96 flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.15),transparent_70%)]" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(56,189,248,0.25) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">
                  Orlando, FL
                </h3>
                <p className="mt-2 text-text-secondary">
                  Visit us at our Orlando office
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
