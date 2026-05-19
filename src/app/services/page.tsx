import type { Metadata } from "next";
import Link from "next/link";
import GradientOrb from "@/components/GradientOrb";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Services | Agrasen Technologies",
  description:
    "Explore the full range of IT services from Agrasen Technologies — IT consulting, application development, web design, UI/UX, SEO, mobile design, business mentoring, and branding.",
};

const services = [
  {
    title: "IT Consulting",
    description:
      "Driving Project Success with Expert IT Consultation. Bridging the gap between technical and non-technical teams is crucial for project success. From requirement gathering to project execution within strict timelines, we ensure seamless coordination and delivery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: "Application Development",
    description:
      "Custom solutions built on QuickBase, Smartsheet, and other low-code platforms. We create powerful business applications that streamline workflows and boost productivity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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
    description: "Understand your business needs",
  },
  {
    step: 2,
    title: "Strategy",
    description: "Create a tailored solution plan",
  },
  {
    step: 3,
    title: "Execution",
    description: "Build and deliver with precision",
  },
  {
    step: 4,
    title: "Support",
    description: "Ongoing optimization and growth",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center bg-bg-secondary overflow-hidden">
        <GradientOrb size={300} className="top-0 -right-32 opacity-40" delay={0} />
        <GradientOrb color1="#818cf8" color2="#6366f1" size={250} className="bottom-0 -left-24 opacity-30" delay={2} />

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
              Comprehensive IT solutions tailored to your business — from consulting and development to design, branding, and strategic mentorship.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="What We Do"
            title="Full-Spectrum IT Services"
            description="Each engagement is shaped around your unique business goals."
          />

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-8 h-full group hover:border-accent/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.08)]">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">{s.title}</h3>
                  <p className="mt-3 text-text-secondary leading-relaxed">{s.description}</p>
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
              Tell us about your project and we&apos;ll show you what&apos;s possible.
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
  );
}
