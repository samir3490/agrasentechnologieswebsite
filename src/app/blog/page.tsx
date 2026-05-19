import type { Metadata } from "next";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";
import NewsletterForm from "./NewsletterForm";

export const metadata: Metadata = {
  title: "Blog | Agrasen Technologies",
  description:
    "Insights and articles on IT strategy, business growth, productivity, and technology trends from Agrasen Technologies.",
};

const posts = [
  {
    slug: "investing-it-infrastructure",
    title: "How Investing in IT Infrastructure Drives Business Growth",
    date: "February 8, 2022",
    excerpt:
      "Every successful business is built on a strong foundation — not just products or services, but the people and systems that keep everything running smoothly.",
    category: "Business Growth",
  },
  {
    slug: "customer-relations-crisis",
    title: "Maintaining Customer Relations During a Crisis",
    date: "February 8, 2022",
    excerpt:
      "In business, not every interaction goes smoothly. Sometimes disasters in customer relations happen — delayed deliveries, product issues, or poor service.",
    category: "Customer Relations",
  },
  {
    slug: "productivity-tips-burnout",
    title: "7 Productivity Tips to Avoid Burnout",
    date: "February 8, 2022",
    excerpt:
      "In today's fast-paced world, productivity often gets confused with working longer hours. But pushing yourself too hard without breaks can lead to burnout.",
    category: "Productivity",
  },
  {
    slug: "expertly-crafted-solutions",
    title: "The Art of Expertly Crafted Business Solutions",
    date: "February 8, 2022",
    excerpt:
      "In business, quality speaks louder than words. Customers are drawn to products and services that are expertly crafted.",
    category: "Quality",
  },
  {
    slug: "business-fundamentals-value",
    title: "Business Fundamentals: Making Your Living Through Value",
    date: "February 8, 2022",
    excerpt:
      "At its core, business is the activity of creating and delivering value in exchange for financial return. But it goes much deeper than that.",
    category: "Business",
  },
  {
    slug: "choosing-company-structure",
    title: "Choosing the Right Company Structure for Your Venture",
    date: "February 2, 2022",
    excerpt:
      "Every successful business starts with the right foundation — choosing the right type of company for your venture.",
    category: "Startups",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <ParticleField />
        <GradientOrb
          className="-top-32 -left-32"
          size={420}
          color1="#818cf8"
          color2="#38bdf8"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <nav className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Blog</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Insights &amp; Articles
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Sharing our knowledge on IT strategy, productivity, and building
              resilient businesses
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Blog Grid ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={0.1 * i}>
                <article className="glass rounded-2xl p-6 sm:p-8 h-full flex flex-col hover:border-accent/40 transition-colors group">
                  <span className="inline-block self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent mb-4">
                    {post.category}
                  </span>

                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <time className="text-sm text-text-secondary mb-3">
                    {post.date}
                  </time>

                  <p className="text-text-secondary leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-accent hover:gap-2 transition-all"
                  >
                    Read More
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative glass rounded-2xl p-8 md:p-14 text-center overflow-hidden">
              <GradientOrb
                className="-bottom-20 -right-20"
                size={300}
                color1="#38bdf8"
                color2="#818cf8"
                delay={2}
              />

              <div className="relative z-10">
                <SectionHeading
                  label="Newsletter"
                  title="Stay Updated"
                  description="Get the latest insights on IT strategy, business growth, and technology trends delivered straight to your inbox."
                />
                <NewsletterForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
