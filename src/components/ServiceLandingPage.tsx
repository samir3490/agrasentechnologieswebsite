import Image from "next/image";
import Link from "next/link";
import GradientOrb from "@/components/GradientOrb";
import JsonLd from "@/components/JsonLd";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import type { ServiceLanding } from "@/data/service-landings";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

export default function ServiceLandingPage({ service }: { service: ServiceLanding }) {
  const path = `/services/${service.slug}`;

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.description,
          path,
        })}
      />
      <JsonLd data={faqPageJsonLd(service.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ])}
      />

      <main className="min-h-screen">
        <section className="relative min-h-[42vh] flex items-center bg-bg-secondary overflow-hidden">
          <GradientOrb color1="#D4A017" color2="#E8C547" size={300} className="top-0 -right-32 opacity-40" delay={0} />
          <GradientOrb color1="#D4A017" color2="#B8860B" size={250} className="bottom-0 -left-24 opacity-30" delay={2} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
            <ScrollReveal>
              <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
                <span>/</span>
                <span className="text-text-primary">{service.name}</span>
              </nav>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text max-w-4xl">
                {service.h1}
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-2xl leading-relaxed">
                {service.intro}
              </p>
              <Link
                href="/contact"
                className="inline-block mt-8 px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
              >
                Book a Free 30-Minute Review
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-border">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </div>
            </ScrollReveal>
            <div className="space-y-6">
              {service.outcomes.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-text-primary">{item.title}</h2>
                    <p className="mt-2 text-text-secondary leading-relaxed">{item.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Fit"
              title="This is a good match if"
              description="Bring the process you run today. We will tell you whether this platform is the right one."
            />
            <ul className="mt-12 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {service.fit.map((item, i) => (
                <ScrollReveal key={item} delay={i * 0.05}>
                  <li className="glass rounded-xl p-5 text-text-secondary leading-relaxed">{item}</li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Approach"
              title="How we work"
              description="Discovery first. The platform is a decision, not the starting slogan."
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-border" />
              {service.process.map((step, i) => (
                <ScrollReveal key={step.title} delay={i * 0.1} className="text-center relative">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white flex items-center justify-center text-xl font-bold mx-auto">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-bg-secondary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="FAQ"
              title={`${service.name} questions`}
              description="Straight answers before you book a review."
            />
            <div className="mt-10 space-y-4">
              {service.faqs.map((faq, i) => (
                <ScrollReveal key={faq.question} delay={i * 0.06}>
                  <details className="glass rounded-2xl p-6 group">
                    <summary className="cursor-pointer list-none text-lg font-semibold text-text-primary flex items-start justify-between gap-4">
                      {faq.question}
                      <span className="text-accent text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-text-secondary leading-relaxed">{faq.answer}</p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Related services</p>
            <div className="flex flex-wrap gap-3">
              {service.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-primary hover:border-accent hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 border-t border-accent/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
                Book a free 30-minute workflow review
              </h2>
              <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
                Bring the process you want to replace. We will show you the {service.name} path.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-8 px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
              >
                Book a Free Review
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
}
