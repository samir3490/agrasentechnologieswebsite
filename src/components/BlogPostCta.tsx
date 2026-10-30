import Link from "next/link";
import { FREE_REVIEW_OFFER } from "@/lib/contact";

export default function BlogPostCta() {
  return (
    <div className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
        Need this built in QuickBase?
      </h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        Agrasen Technologies designs custom QuickBase apps, automations, and dashboards
        around how your team already works. {FREE_REVIEW_OFFER} and we&apos;ll map the
        fastest path from spreadsheet to a system people will actually use.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/contact"
          className="inline-block px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity text-center"
        >
          {FREE_REVIEW_OFFER}
        </Link>
        <Link
          href="/services/quickbase-development"
          className="inline-block px-6 py-3 rounded-lg text-sm font-semibold border border-border text-text-primary hover:border-accent hover:text-accent transition-colors text-center"
        >
          QuickBase development
        </Link>
      </div>
    </div>
  );
}
