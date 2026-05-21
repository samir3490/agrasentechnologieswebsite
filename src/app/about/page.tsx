import type { Metadata } from "next";
import Link from "next/link";
import GradientOrb from "@/components/GradientOrb";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About | Agrasen Technologies",
  description:
    "Learn about Agrasen Technologies — an Orlando-based IT consulting firm founded by Samir Agrawal with over 15 years of experience in enterprise technology, QuickBase, Smartsheet, and low-code solutions.",
};

const milestones = [
  {
    label: "GE Lighting",
    description: "Early career foundation in manufacturing IT at Thomas Edison's company",
  },
  {
    label: "Universal Music Group",
    description: "Enterprise solutions for the music industry in Los Angeles",
  },
  {
    label: "Agrasen Technologies",
    description: "Founded in 2014, Orlando FL — delivering IT consulting & low-code solutions",
  },
];

const values = [
  {
    title: "Innovation",
    description: "Leveraging cutting-edge technology to solve complex problems",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Quality",
    description: "Delivering excellence in every project we undertake",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Integrity",
    description: "Building trust through transparency and honest communication",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  {
    title: "Growth",
    description: "Empowering businesses to scale with confidence",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center bg-bg-secondary overflow-hidden">
        <GradientOrb color1="#D4A017" color2="#B8860B" size={300} className="top-0 -left-32 opacity-40" delay={0} />
        <GradientOrb color1="#E8C547" color2="#D4A017" size={250} className="bottom-0 -right-24 opacity-30" delay={2} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <ScrollReveal>
            <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-text-primary">About</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
              About Agrasen Technologies
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Over 15 years of IT expertise — helping businesses transform through technology, strategy, and low-code innovation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Story"
            title="A Journey Built on Experience"
            centered={false}
          />

          <div className="mt-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ScrollReveal direction="left" className="space-y-5 text-text-secondary leading-relaxed">
              <p>
                Agrasen Technologies was founded by <strong className="text-text-primary">Samir Agrawal</strong>, a seasoned IT professional with over 15 years of hands-on experience across diverse industries and technologies.
              </p>
              <p>
                Samir&apos;s career began at <strong className="text-text-primary">GE Lighting</strong> — Thomas Edison&apos;s company — where he built a strong foundation in manufacturing IT, enterprise systems, and the discipline of large-scale operations.
              </p>
              <p>
                He later brought his expertise to <strong className="text-text-primary">Universal Music Group</strong> in Los Angeles, delivering enterprise solutions for one of the world&apos;s largest music companies and gaining deep experience in media and entertainment technology.
              </p>
              <p>
                In 2014, Samir established Agrasen Technologies in Orlando, FL to help businesses of all sizes harness the power of modern IT solutions. With a sharp focus on <strong className="text-text-primary">QuickBase</strong>, <strong className="text-text-primary">Smartsheet</strong>, and low-code platforms, the company empowers organizations to streamline operations, automate workflows, and accelerate digital transformation.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-accent mb-8">Key Milestones</h3>
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-8">
                    {milestones.map((m, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-accent bg-bg-secondary" />
                        <h4 className="text-text-primary font-semibold">{m.label}</h4>
                        <p className="text-sm text-text-secondary mt-1">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 lg:py-28 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Leadership"
            title="Meet the Founder"
            description="Decades of enterprise experience distilled into every engagement."
          />

          <ScrollReveal className="mt-12 max-w-2xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden border-l-4 border-l-accent">
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl font-bold text-text-primary">Samir Agrawal</h3>
                <p className="text-accent font-medium mt-1">CEO &amp; Founder</p>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  With over 15 years in enterprise technology spanning manufacturing, media, and consulting, Samir brings a rare blend of technical depth and business acumen. His experience at GE Lighting and Universal Music Group shaped a hands-on, results-driven approach to IT that defines Agrasen Technologies today. He specializes in QuickBase and Smartsheet development, low-code application platforms, and strategic IT consulting.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Values"
            title="What Drives Us"
            description="The principles behind every solution we deliver."
          />

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 h-full hover:border-accent/50 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{v.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">{v.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
              Ready to Discuss Your Project?
            </h2>
            <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
              Schedule a free consultation and let&apos;s explore how we can help your business grow.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-8 px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity duration-200"
            >
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
