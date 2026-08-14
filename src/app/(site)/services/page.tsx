import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import GradientOrb from "@/components/GradientOrb";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, servicesJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services | QuickBase Development & Low-Code Applications",
  description:
    "Custom QuickBase applications, low-code systems, and Smartsheet solutions from Agrasen Technologies in Orlando, FL — plus IT consulting, web design, and SEO.",
  path: "/services",
});

const services: {
  title: string;
  description: string;
  image?: string;
  icon: ReactNode;
}[] = [
  {
    title: "QuickBase Development",
    description:
      "Custom QuickBase applications built around your process — not a generic template. We design tables, workflows, roles, dashboards, and automations so operations, project, and field teams work in one system instead of scattered spreadsheets.",
    image: "/services/service-quickbase.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h4.5A2.25 2.25 0 0112.75 6v4.5a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zM3.75 17.25A2.25 2.25 0 016 15h4.5a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0110.5 24H6a2.25 2.25 0 01-2.25-2.25v-4.5zM15 6a2.25 2.25 0 012.25-2.25H21A2.25 2.25 0 0123.25 6v4.5A2.25 2.25 0 0121 12.75h-3.75A2.25 2.25 0 0115 10.5V6z" />
      </svg>
    ),
  },
  {
    title: "Low-Code Applications",
    description:
      "When you need business software in weeks, not a year-long custom build. We use low-code platforms to ship apps your team can actually run — forms, approvals, reporting, and integrations — then iterate as the process changes.",
    image: "/services/service-low-code.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Smartsheet Solutions",
    description:
      "Connected Smartsheet workspaces, automations, and reporting. We turn shared sheets into reliable operating systems for projects, vendors, and capacity — with the dashboards leadership actually checks.",
    image: "/services/service-smartsheet.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3.375 5.25h17.25v13.5H3.375V5.25zM3.375 9.75h17.25M3.375 14.25h17.25M9.75 5.25v13.5M14.25 5.25v13.5" />
      </svg>
    ),
  },
  {
    title: "IT Consulting",
    description:
      "Driving project success with expert IT consultation. Bridging the gap between technical and non-technical teams — from requirement gathering to delivery on a timeline.",
    image: "/services/service-it-consulting.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: "Web Design / Interactive",
    description:
      "Crafting Stunning Digital Experiences. Your website is your brand's first impression. We design modern, user-centric websites that capture attention and convert visitors into customers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
      </svg>
    ),
  },
  {
    title: "UI/UX Design",
    description:
      "Creating Intuitive and Engaging Experiences. We focus on understanding user behavior to design interfaces that offer seamless navigation and intuitive user experiences.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zm0 7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-7zM4 14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5z" />
      </svg>
    ),
  },
  {
    title: "SEO Optimization",
    description:
      "Maximizing Visibility, Driving Traffic. We take a strategic approach to SEO, customizing solutions to fit your business goals. From on-page optimization to advanced strategies.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
      </svg>
    ),
  },
  {
    title: "Mobile Design",
    description:
      "Designing for a Mobile-First World. With a large portion of web traffic coming from mobile devices, we ensure your website delivers a seamless experience across all screen sizes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: "Business Management Mentoring",
    description:
      "Empowering Businesses with Expert Mentorship in sales, leadership, revenue growth, and team management.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </svg>
    ),
  },
  {
    title: "Branding & Identity",
    description:
      "Building Brands That Resonate. Your brand is more than just a logo — it's the perception customers have about you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 0 1 2.828 0l2.829 2.829a2 2 0 0 1 0 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const processSteps = [
  {
    step: 1,
    title: "Discovery",
    description: "Map the workflows you run in sheets, email, and tribal knowledge",
  },
  {
    step: 2,
    title: "Platform",
    description: "Choose QuickBase, Smartsheet, or another low-code fit",
  },
  {
    step: 3,
    title: "Build",
    description: "Ship the app, dashboards, and automations your team will use",
  },
  {
    step: 4,
    title: "Support",
    description: "Iterate as the process changes — without starting over",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesJsonLd()} />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center bg-bg-secondary overflow-hidden">
        <GradientOrb color1="#D4A017" color2="#E8C547" size={300} className="top-0 -right-32 opacity-40" delay={0} />
        <GradientOrb color1="#D4A017" color2="#B8860B" size={250} className="bottom-0 -left-24 opacity-30" delay={2} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <ScrollReveal>
            <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-text-primary">Services</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
              Our Services
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Custom QuickBase applications and low-code systems first — then the consulting, design, and web work that keep them useful.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="What We Do"
            title="QuickBase and Low-Code Applications"
            description="Each engagement starts with the work your team does today — then we build the app around it."
          />

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.08}>
                <div className="glass rounded-2xl overflow-hidden h-full group hover:border-accent/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,160,23,0.08)]">
                  {s.image ? (
                    <div className="relative h-48">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                      {s.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">{s.title}</h3>
                    <p className="mt-3 text-text-secondary leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Approach"
            title="How We Work"
            description="A proven process that delivers results, every time."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-border" />

            {processSteps.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 0.12} className="text-center relative">
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white flex items-center justify-center text-xl font-bold mx-auto">
                  {p.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{p.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 border-t border-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
              Let&apos;s Build Something Great Together
            </h2>
            <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
              Tell us the process you want to replace — we&apos;ll show you the QuickBase or low-code path.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-8 px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity duration-200"
            >
              Start a Conversation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
    </>
  );
}
