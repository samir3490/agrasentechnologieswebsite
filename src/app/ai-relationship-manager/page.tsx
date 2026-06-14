import { armPath } from "@/lib/arm/paths";
import Link from "next/link";
import { SITE } from "@/lib/arm/site";

export default function HomePage() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col">
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

      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {SITE.product}
        </h1>
        <p className="animate-fade-in-up stagger-1 mt-4 max-w-2xl text-lg text-slate-600">
          {SITE.tagline}. Track birthdays, manage donors and clients, log interactions, and
          never lose touch with the people who matter.
        </p>
        <div className="animate-fade-in-up stagger-2 mt-10 flex flex-wrap justify-center gap-4">
          <Link href={armPath("/signup")} className="btn-primary px-8 py-3 text-base">
            Create free account
          </Link>
          <Link href={armPath("/login")} className="btn-secondary px-8 py-3 text-base">
            Sign in
          </Link>
        </div>
        <div className="animate-fade-in-up stagger-3 mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Personal & Family", desc: "Birthdays, anniversaries, gift ideas" },
            { title: "Business & Sales", desc: "Clients, prospects, follow-ups" },
            { title: "NGO & Community", desc: "Donors, volunteers, beneficiaries" },
          ].map((card) => (
            <div key={card.title} className="glass-card rounded-2xl p-6 text-left hover-lift">
              <h3 className="font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
