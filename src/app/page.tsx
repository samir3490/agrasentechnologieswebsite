import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "550+", label: "Happy Clients" },
  { value: "650+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
];

const services = [
  {
    title: "IT Consulting",
    description: "Strategic IT guidance for project success",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "Application Development",
    description: "Custom solutions on QuickBase & Smartsheet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h4.5A2.25 2.25 0 0112.75 6v4.5a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zM3.75 17.25A2.25 2.25 0 016 15h4.5a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0110.5 24H6a2.25 2.25 0 01-2.25-2.25v-4.5zM15 6a2.25 2.25 0 012.25-2.25H21A2.25 2.25 0 0123.25 6v4.5A2.25 2.25 0 0121 12.75h-3.75A2.25 2.25 0 0115 10.5V6z" />
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
    title: "UI/UX Design",
    description: "Intuitive experiences users love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
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
  {
    title: "Business Mentoring",
    description: "Expert guidance for growth",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
];

const checkItems = [
  "GE Lighting & Universal Music Group Alumni",
  "QuickBase & Smartsheet Experts",
  "Full-Stack IT Solutions",
  "Orlando, FL Based — Serving Globally",
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
              Innovating Since 2014
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Transforming Business Through
              <br />
              <span className="gradient-text">Intelligent Technology</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              We deliver cutting-edge IT consulting, application development, and strategic
              solutions that drive measurable growth for businesses worldwide.
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
            title="Our Core Services"
            description="From strategy to execution, we provide end-to-end technology solutions that empower businesses to innovate, scale, and lead their industries."
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
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-accent to-accent-secondary">
              <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    <circle cx="40" cy="40" r="2" fill="#D4A017" />
                    <circle cx="80" cy="30" r="1.5" fill="#B8860B" />
                    <circle cx="120" cy="50" r="2" fill="#D4A017" />
                    <circle cx="160" cy="35" r="1" fill="#B8860B" />
                    <circle cx="60" cy="80" r="1.5" fill="#D4A017" />
                    <circle cx="100" cy="90" r="2" fill="#B8860B" />
                    <circle cx="140" cy="75" r="1.5" fill="#D4A017" />
                    <circle cx="30" cy="120" r="2" fill="#B8860B" />
                    <circle cx="70" cy="130" r="1" fill="#D4A017" />
                    <circle cx="110" cy="140" r="2" fill="#B8860B" />
                    <circle cx="150" cy="125" r="1.5" fill="#D4A017" />
                    <circle cx="50" cy="160" r="1.5" fill="#B8860B" />
                    <circle cx="90" cy="170" r="2" fill="#D4A017" />
                    <circle cx="130" cy="165" r="1" fill="#B8860B" />
                    <circle cx="170" cy="155" r="2" fill="#D4A017" />
                    <line x1="40" y1="40" x2="80" y2="30" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="80" y1="30" x2="120" y2="50" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="120" y1="50" x2="160" y2="35" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="60" y1="80" x2="100" y2="90" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="100" y1="90" x2="140" y2="75" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="40" y1="40" x2="60" y2="80" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="80" y1="30" x2="100" y2="90" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="120" y1="50" x2="140" y2="75" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="30" y1="120" x2="70" y2="130" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="70" y1="130" x2="110" y2="140" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="110" y1="140" x2="150" y2="125" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="50" y1="160" x2="90" y2="170" stroke="#D4A017" strokeWidth="0.3" />
                    <line x1="90" y1="170" x2="130" y2="165" stroke="#B8860B" strokeWidth="0.3" />
                    <line x1="130" y1="165" x2="170" y2="155" stroke="#D4A017" strokeWidth="0.3" />
                  </svg>
                </div>
                <p className="text-5xl font-bold gradient-text relative z-10">15+</p>
                <p className="mt-3 text-xl text-text-primary font-semibold relative z-10">
                  Years of IT Consulting
                </p>
                <div className="mt-6 flex gap-3 relative z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                    QuickBase
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
                    Smartsheet
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                    Full-Stack
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Content */}
          <div>
            <SectionHeading
              label="About Us"
              title="Driving Growth Through Technology"
              centered={false}
            />
            <ScrollReveal delay={0.2}>
              <p className="mt-6 text-text-secondary leading-relaxed">
                Founded by industry veterans with experience at GE Lighting and Universal Music Group,
                Agrasen Technologies has been at the forefront of IT consulting since 2014. We combine
                deep technical expertise with a genuine understanding of business challenges to deliver
                solutions that create lasting impact.
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
              Ready to Transform Your Business?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Let&apos;s discuss how our expertise can help you achieve your technology goals
              and drive meaningful results.
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
