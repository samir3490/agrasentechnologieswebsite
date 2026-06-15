import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import JsonLd from "@/components/JsonLd";
import { posts } from "@/data/posts";
import { blogPostingJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return pageMetadata({
    title: `${post.title} | Agrasen Technologies Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
    ogImage: post.image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <main className="min-h-screen bg-bg-primary">
        <section className="relative overflow-hidden py-28 md:py-36">
          <ParticleField />
          <GradientOrb
            className="-top-32 -right-32"
            size={420}
            color1="#D4A017"
            color2="#B8860B"
          />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <nav className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/blog"
                  className="hover:text-accent transition-colors"
                >
                  Blog
                </Link>
                <span>/</span>
                <span className="text-accent truncate max-w-[200px]">
                  {post.title}
                </span>
              </nav>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-text-secondary">
                {formattedDate} &middot; By {post.author}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {post.image && (
              <ScrollReveal>
                <div className="relative w-full h-[300px] md:h-[420px] rounded-2xl overflow-hidden mb-10 border border-border">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div
                className="[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:text-text-secondary [&_li]:mb-2 [&_li]:leading-relaxed [&_strong]:text-text-primary [&_a]:text-accent [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4"
                  >
                    <path
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
}
