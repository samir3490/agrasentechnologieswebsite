import type { Metadata } from "next";
import Link from "next/link";
import GradientOrb from "@/components/GradientOrb";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { ProductIconSvg } from "@/components/ProductIcon";
import { products, productsPage } from "@/data/products";

export const metadata: Metadata = {
  title: "Products | Agrasen Technologies",
  description:
    "Explore software products from Agrasen Technologies, including AI Relationship Manager — an AI-powered personal CRM for contacts, birthdays, reminders, and relationship intelligence.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[40vh] flex items-center bg-bg-secondary overflow-hidden">
        <GradientOrb color1="#D4A017" color2="#E8C547" size={300} className="top-0 -right-32 opacity-40" delay={0} />
        <GradientOrb color1="#D4A017" color2="#B8860B" size={250} className="bottom-0 -left-24 opacity-30" delay={2} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <ScrollReveal>
            <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-text-primary">Products</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
              {productsPage.title}
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-3xl">{productsPage.subtitle}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label={productsPage.sectionLabel}
            title={productsPage.sectionTitle}
            description={productsPage.sectionDescription}
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.08}>
                <article className="glass rounded-2xl p-8 h-full flex flex-col group hover:border-accent/50 hover:scale-[1.01] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,160,23,0.08)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                      <ProductIconSvg icon={product.icon} />
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        product.status === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.status === "available" ? "Available" : "Coming soon"}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold text-text-primary">{product.name}</h2>
                  <p className="mt-2 text-accent font-medium">{product.tagline}</p>
                  <p className="mt-4 text-text-secondary leading-relaxed flex-1">{product.description}</p>

                  {product.audiences && product.audiences.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.audiences.map((audience) => (
                        <span
                          key={audience}
                          className="rounded-full bg-bg-secondary px-3 py-1 text-xs text-text-secondary border border-border"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="mt-6 space-y-2">
                    {product.highlights.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-0.5 shrink-0" aria-hidden>
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-border">
                    {product.href && product.status === "available" ? (
                      <a
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity duration-200"
                      >
                        {product.ctaLabel ?? "Learn more"}
                        <span aria-hidden>→</span>
                      </a>
                    ) : (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-accent border border-accent/40 hover:bg-accent/5 transition-colors duration-200"
                      >
                        Contact us for early access
                      </Link>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">More products on the way</h2>
            <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
              We&apos;re building tools for recruitment, analytics, and business automation. Have an
              idea or need a custom solution? We&apos;d love to hear from you.
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
