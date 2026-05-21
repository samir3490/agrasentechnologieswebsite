import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";
import NewsletterForm from "./NewsletterForm";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "Blog | Agrasen Technologies",
  description:
    "Insights and articles on IT strategy, business growth, productivity, and technology trends from Agrasen Technologies.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <ParticleField />
        <GradientOrb
          className="-top-32 -left-32"
          size={420}
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
                <article className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:border-accent/40 transition-colors group">
                  {post.image && (
                    <div className="relative w-full h-[200px]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <span className="inline-block self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent mb-4">
                      {post.category}
                    </span>

                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                      <time>{post.date}</time>
                      <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
                      <span>{post.author}</span>
                    </div>

                    <p className="text-text-secondary leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-accent hover:gap-2 transition-all"
                    >
                      Read More
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
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
                color1="#D4A017"
                color2="#B8860B"
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
