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
      <Link
        href="/contact"
        className="inline-block mt-6 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity"
      >
        {FREE_REVIEW_OFFER}
      </Link>
    </div>
  );
}
