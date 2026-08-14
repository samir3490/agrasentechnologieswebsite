import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Agrasen Technologies | QuickBase & Low-Code Applications Orlando FL",
  description:
    "Custom QuickBase applications, Smartsheet solutions, and low-code systems from Agrasen Technologies in Orlando, FL. Over 15 years helping businesses nationwide.",
  path: "/",
});

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "550+", label: "Happy Clients" },
  { value: "650+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
];

const services = [
  {
    title: "QuickBase Development",
    description: "Custom apps, workflows, and dashboards on QuickBase",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h4.5A2.25 2.25 0 0112.75 6v4.5a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zM3.75 17.25A2.25 2.25 0 016 15h4.5a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0110.5 24H6a2.25 2.25 0 01-2.25-2.25v-4.5zM15 6a2.25 2.25 0 012.25-2.25H21A2.25 2.25 0 0123.25 6v4.5A2.25 2.25 0 0121 12.75h-3.75A2.25 2.25 0 0115 10.5V6z" />
      </svg>
    ),
  },
  {
    title: "Low-Code Applications",
    description: "Ship business software faster — without the wait of custom code",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Smartsheet Solutions",
    description: "Connected sheets, automations, and reporting your teams will use",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 5.25h17.25v13.5H3.375V5.25zM3.375 9.75h17.25M3.375 14.25h17.25M9.75 5.25v13.5M14.25 5.25v13.5" />
      </svg>
    ),
  },
  {
    title: "IT Consulting",
    description: "Strategic guidance from requirements through delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "Web Design",
    description: "Modern websites that convert visitors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 003 12c0-1.264.26-2.467.73-3.418" />
      </svg>
    ),
  },
  {
    title: "SEO Optimization",
    description: "Higher rankings, more traffic",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const checkItems = [
  "GE Lighting & Universal Music Group Alumni",
  "QuickBase & Smartsheet specialists",
  "Low-code applications built around your process",
  "Orlando, FL based — serving clients nationwide",
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        <GradientOrb
          color1="#D4A017"
          color2="#B8860B"
          size={500}
          className="top-[-10%] left-[-10%]"
          delay={0}
        />
        <GradientOrb
          color1="#E8C547"
          color2="#D4A017"
          size={450}
          className="bottom-[-10%] right-[-10%]"
          delay={2}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border border-border text-accent bg-accent/5 mb-8">
              QuickBase &amp; Low-Code Since 2014
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              QuickBase Apps Built
              <br />
              <span className="gradient-text">Around How You Work</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              We design custom QuickBase applications and other low-code systems that
              replace spreadsheets, automate workflows, and give your team one place to work.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
              >
                Get Started
              </Link>
              <a
                href="#services"
                className="px-8 py-3.5 rounded-lg border border-border text-text-primary font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                Our Services
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="What We Do"
            title="QuickBase, Low-Code, and More"
            description="Start with the application your operations actually need — then the consulting, design, and web work that support it."
            centered
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 h-full hover:border-accent/50 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Decorative Panel */}
          <ScrollReveal direction="left">
            <div className="relative rounded-2xl overflow-hidden min-h-[400px]">
              <Image
                src="/services/quickbase-office-sign.jpg"
                alt="Agrasen Technologies QuickBase consulting"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="relative z-10 flex flex-col justify-end min-h-[400px] p-10">
                <p className="text-5xl font-bold text-white">15+</p>
                <p className="mt-3 text-xl text-white font-semibold">
                  Years building QuickBase apps
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white border border-white/25">
                    QuickBase
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white border border-white/25">
                    Smartsheet
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white border border-white/25">
                    Low-Code
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Content */}
          <div>
            <SectionHeading
              label="About Us"
              title="The Apps Your Operations Run On"
              centered={false}
            />
            <ScrollReveal delay={0.2}>
              <p className="mt-6 text-text-secondary leading-relaxed">
                Founded by industry veterans from GE Lighting and Universal Music Group,
                Agrasen Technologies has been building QuickBase applications and low-code
                systems since 2014. We learn how your teams actually work, then turn that
                into software they will use — without a year-long custom build.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <ul className="mt-6 space-y-3">
                {checkItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent shrink-0">
                      <path
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <a
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-accent font-semibold hover:underline"
              >
                Learn More
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary" />
        <GradientOrb
          color1="#D4A017"
          color2="#B8860B"
          size={300}
          className="top-[-20%] left-[10%]"
          delay={1}
        />
        <GradientOrb
          color1="#E8C547"
          color2="#D4A017"
          size={250}
          className="bottom-[-20%] right-[10%]"
          delay={3}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary">
              Ready to Build on QuickBase?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Tell us the workflows you want to automate. We&apos;ll show you what&apos;s possible
              in QuickBase and other low-code platforms.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link
              href="/contact"
              className="inline-block mt-8 px-8 py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
