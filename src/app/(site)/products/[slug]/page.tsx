import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GradientOrb from "@/components/GradientOrb";
import ScrollReveal from "@/components/ScrollReveal";
import { ProductIconSvg } from "@/components/ProductIcon";
import { getProductById, products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductById(slug);
  if (!product) return { title: "Product Not Found" };

  const description = product.seoDescription ?? product.description;

  return pageMetadata({
    title: `${product.name} | Agrasen Technologies`,
    description,
    path: `/products/${product.id}`,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductById(slug);
  if (!product) notFound();

  const appHref = product.href?.startsWith("/") ? product.href : product.href ?? "/products";
  const signupHref =
    product.id === "ai-relationship-manager" ? "/ai-relationship-manager/signup" : appHref;

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[45vh] flex items-center bg-bg-secondary overflow-hidden">
        <GradientOrb color1="#D4A017" color2="#E8C547" size={320} className="top-0 -right-32 opacity-40" delay={0} />
        <GradientOrb color1="#D4A017" color2="#B8860B" size={260} className="bottom-0 -left-24 opacity-30" delay={2} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <ScrollReveal>
            <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-accent transition-colors">
                Products
              </Link>
              <span>/</span>
              <span className="text-text-primary">{product.name}</span>
            </nav>

            <div className="flex flex-wrap items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <ProductIconSvg icon={product.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    product.status === "available"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {product.status === "available" ? "Available now" : "Coming soon"}
                </span>
                <h1 className="mt-4 text-4xl sm:text-5xl font-bold gradient-text">{product.name}</h1>
                <p className="mt-3 text-xl text-accent font-medium">{product.tagline}</p>
                <p className="mt-4 text-lg text-text-secondary max-w-3xl leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              {product.features && product.features.length > 0 && (
                <ScrollReveal>
                  <h2 className="text-2xl font-semibold text-text-primary">What you get</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {product.features.map((feature) => (
                      <article
                        key={feature.title}
                        className="glass rounded-2xl p-6 border border-border hover:border-accent/40 transition-colors"
                      >
                        <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                          {feature.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal delay={0.1}>
                <h2 className="mt-14 text-2xl font-semibold text-text-primary">Highlights</h2>
                <ul className="mt-6 space-y-3">
                  {product.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-text-secondary">
                      <span className="text-accent shrink-0" aria-hidden>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit">
              <ScrollReveal delay={0.15}>
                <div className="glass rounded-2xl p-6 border border-border space-y-5">
                  {product.audiences && product.audiences.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-text-primary">Built for</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.audiences.map((audience) => (
                          <span
                            key={audience}
                            className="rounded-full bg-bg-secondary px-3 py-1 text-xs text-text-secondary border border-border"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.status === "available" ? (
                    <div className="space-y-3 pt-2">
                      <Link
                        href={signupHref}
                        className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
                      >
                        {product.ctaLabel ?? "Get started free"}
                      </Link>
                      {appHref !== signupHref && (
                        <Link
                          href={appHref}
                          className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-accent border border-accent/40 hover:bg-accent/5 transition-colors"
                        >
                          Open app
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/contact"
                      className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-accent border border-accent/40 hover:bg-accent/5 transition-colors"
                    >
                      Contact us for early access
                    </Link>
                  )}

                  <Link
                    href="/products"
                    className="block text-center text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    ← All products
                  </Link>
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
