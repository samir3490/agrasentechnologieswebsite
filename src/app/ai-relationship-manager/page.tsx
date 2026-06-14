import { armPath } from "@/lib/arm/paths";
import { armLandingMetadata, armFaqJsonLd, armSoftwareJsonLd } from "@/lib/arm/seo/metadata";
import Link from "next/link";
import { SITE } from "@/lib/arm/site";
import type { Metadata } from "next";

export const metadata: Metadata = armLandingMetadata;

const faqs = [
  {
    q: "What is AI Relationship Manager?",
    a: "A personal CRM for birthdays, anniversaries, client follow-ups, donor stewardship, and everyday relationships — with reminders, AI gift ideas, and a network map.",
  },
  {
    q: "Is it free?",
    a: "Yes. Start free with up to 100 contacts. Upgrade per workspace when you need more capacity.",
  },
  {
    q: "Can my team use their own API keys?",
    a: "Yes. Each workspace connects its own OpenAI, Mapbox, email, and Google Calendar credentials — ideal for agencies and NGOs.",
  },
  {
    q: "Who is it for?",
    a: "Individuals, families, sales teams, NGOs, community leaders, and anyone who wants to stay close to people who matter.",
  },
];

export default function HomePage() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(armSoftwareJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(armFaqJsonLd()) }}
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <span className="text-xl font-bold gradient-text">{SITE.name}</span>
        <div className="flex gap-3">
          <Link href={armPath("/login")} className="btn-secondary py-2">
            Sign in
          </Link>
          <Link href={armPath("/signup")} className="btn-primary py-2">
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col px-4 py-16">
        <section className="text-center">
          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {SITE.product}
          </h1>
          <p className="animate-fade-in-up stagger-1 mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            {SITE.tagline}. Track contacts, never miss a birthday or anniversary, log interactions,
            get AI gift suggestions, and map your network — for personal life, business, and NGOs.
          </p>
          <div className="animate-fade-in-up stagger-2 mt-10 flex flex-wrap justify-center gap-4">
            <Link href={armPath("/signup")} className="btn-primary px-8 py-3 text-base">
              Create free account
            </Link>
            <Link href={armPath("/login")} className="btn-secondary px-8 py-3 text-base">
              Sign in
            </Link>
          </div>
        </section>

        <section className="animate-fade-in-up stagger-3 mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Personal & Family", desc: "Birthdays, anniversaries, gift ideas" },
            { title: "Business & Sales", desc: "Clients, prospects, follow-ups" },
            { title: "NGO & Community", desc: "Donors, volunteers, beneficiaries" },
          ].map((card) => (
            <div key={card.title} className="glass-card rounded-2xl p-6 text-left hover-lift">
              <h2 className="font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold text-slate-900">Everything in one workspace</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
            {[
              "Contact CRM with personal, business & NGO fields",
              "Birthday & anniversary reminders + daily digest",
              "Google Calendar sync",
              "AI gift suggestions & message drafts",
              "Relationship health scores",
              "Network map & company news",
              "Team workspaces with your own API keys",
              "GDPR data export & audit logs",
            ].map((item) => (
              <li key={item} className="flex gap-2 rounded-lg border border-slate-100 bg-white/60 px-4 py-3">
                <span className="text-indigo-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <dl className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-2xl p-5">
                <dt className="font-semibold text-slate-900">{faq.q}</dt>
                <dd className="mt-2 text-sm text-slate-600">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
