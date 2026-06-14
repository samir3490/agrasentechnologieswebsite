# Agrasen Technologies — SEO Plan

**Site:** https://agrasentechnologies.com  
**Platform:** Next.js (Vercel)  
**Last updated:** May 2026  
**Goal:** Increase organic visibility for IT consulting, QuickBase, Smartsheet, and low-code services in Orlando, FL and nationally.

---

## How to use this document

- Check off items as you complete them: `- [ ]` → `- [x]`
- **Priority:** P0 = do first, P1 = high impact, P2 = ongoing, P3 = nice to have
- Work top to bottom within each phase

---

## Current baseline (audit snapshot)

| Area | Status |
|------|--------|
| HTTPS / SSL | ✅ Active |
| Page titles & meta descriptions | ✅ Most pages |
| Open Graph (basic) | ✅ Root layout |
| Twitter cards | ✅ Root layout |
| Blog content & daily publishing | ✅ Active |
| `robots.txt` | ❌ Missing (404) |
| `sitemap.xml` | ❌ Missing (404) |
| JSON-LD structured data | ❌ Missing |
| Canonical URLs | ❌ Missing |
| OG images (social preview) | ❌ Missing |
| Google Search Console | ❓ Not verified |
| Google Analytics | ❓ Unknown |

---

## Phase 1 — Technical SEO (Foundation)

### Crawling & indexing

- [ ] **P0** Add `robots.txt` (allow all, point to sitemap)
- [ ] **P0** Add dynamic `sitemap.xml` (all static pages + blog posts)
- [ ] **P0** Set `metadataBase` in root layout to `https://agrasentechnologies.com`
- [ ] **P0** Add canonical URLs on every page
- [ ] **P1** Submit sitemap to Google Search Console
- [ ] **P1** Submit sitemap to Bing Webmaster Tools
- [ ] **P1** Request indexing for homepage and key pages in Search Console
- [ ] **P2** Verify www vs non-www redirect (pick one canonical domain)
- [ ] **P2** Check for duplicate content between Vercel preview URLs and production (ensure noindex on previews)

### Structured data (Schema.org)

- [ ] **P0** Add `Organization` + `LocalBusiness` JSON-LD on homepage
- [ ] **P1** Add `WebSite` schema with `SearchAction` (optional)
- [ ] **P1** Add `Service` schema on Services page
- [ ] **P1** Add `Article` / `BlogPosting` schema on blog posts
- [ ] **P2** Add `BreadcrumbList` schema on inner pages
- [ ] **P2** Add `JobPosting` schema on Careers page (if listing specific roles)
- [ ] **P3** Add `FAQPage` schema if FAQ section is added later

### Site performance (Core Web Vitals)

- [ ] **P1** Run Lighthouse audit on homepage, services, and blog
- [ ] **P1** Optimize large blog images (compress / WebP where needed)
- [ ] **P2** Add `loading="lazy"` audit on below-fold images (blog cards)
- [ ] **P2** Review HubSpot script impact on page speed (defer / lazy load if needed)
- [ ] **P3** Monitor Core Web Vitals in Search Console after 28 days of data

### Security & trust signals

- [ ] **P1** Ensure all pages redirect HTTP → HTTPS
- [ ] **P2** Add security headers via `vercel.json` (HSTS, X-Frame-Options, etc.)
- [ ] **P2** Verify Privacy Policy and Terms links are visible in footer (done)

---

## Phase 2 — On-page SEO

### Homepage (`/`)

- [ ] **P0** Add page-specific metadata (title, description with target keywords)
- [ ] **P1** Refine H1 to include primary keyword (e.g. "IT Consulting" or "QuickBase Development")
- [ ] **P1** Add OG image for social sharing
- [ ] **P2** Add internal links to Services, About, Blog, Contact in body content
- [ ] **P2** Add location mention in copy: "Orlando, FL" + "serving clients nationwide"

### About (`/about`)

- [ ] **P1** Expand meta description with founder credentials and location
- [ ] **P2** Add alt text if team/company images are added
- [ ] **P2** Link to Services and Contact from body copy

### Services (`/services`)

- [ ] **P0** Target keywords per service block (QuickBase, Smartsheet, IT consulting, SEO, etc.)
- [ ] **P1** Consider dedicated landing pages for top services (e.g. `/services/quickbase-development`)
- [ ] **P1** Add OG image
- [ ] **P2** Add client outcome / use-case snippets under each service

### Contact (`/contact`)

- [ ] **P1** Add LocalBusiness NAP consistency (Name, Address, Phone) matching Google Business Profile
- [ ] **P2** Add map embed or structured address markup

### Careers (`/careers`)

- [ ] **P2** Optimize title: "Careers at Agrasen Technologies | IT Jobs Orlando FL"
- [ ] **P2** Add JobPosting schema if advertising specific roles

### Blog (`/blog` + posts)

- [ ] **P1** Ensure each post has unique title, description, and OG tags (partially done)
- [ ] **P1** Add OG images per post (featured image as social preview)
- [ ] **P1** Add internal links from blog posts to Services and Contact
- [ ] **P2** Add author bio block with link to About page
- [ ] **P2** Add related posts section at bottom of each article
- [ ] **P2** Create content clusters (QuickBase, Smartsheet, AI, cybersecurity)

### Legal pages

- [ ] **P3** Set `robots: noindex` on Privacy Policy and Terms (optional — many sites index these)

---

## Phase 3 — Keyword strategy

### Primary keywords (homepage + services)

- [ ] **P0** Document target keyword list (see table below)
- [ ] **P1** Map one primary keyword per page
- [ ] **P1** Use keywords naturally in H1, H2, first paragraph, and meta description

| Page | Primary keyword | Secondary keywords |
|------|-----------------|------------------|
| Homepage | IT consulting Orlando | application development, business technology solutions |
| Services | QuickBase development | Smartsheet consulting, low-code development |
| About | IT consulting company Florida | Samir Agrawal, technology consultant |
| Blog | IT consulting blog | AI, QuickBase, Smartsheet, productivity |
| Contact | contact IT consultant Orlando | get a quote, free consultation |
| Careers | IT jobs Orlando | QuickBase developer jobs, remote IT |

### Long-tail opportunities (blog + future landing pages)

- [ ] **P1** QuickBase vs Smartsheet (published ✅)
- [ ] **P1** Low-code platforms for business (scheduled ✅)
- [ ] **P2** QuickBase developer Orlando
- [ ] **P2** Smartsheet consultant Florida
- [ ] **P2** IT consulting for small business
- [ ] **P2** HubSpot + QuickBase integration (if relevant to services)
- [ ] **P3** Create service-specific landing pages for top 3 keywords

---

## Phase 4 — Local SEO

- [ ] **P0** Claim / optimize Google Business Profile (Agrasen Technologies Inc.)
- [ ] **P0** Ensure NAP is identical everywhere: website, GBP, LinkedIn, directories
  - Name: Agrasen Technologies Inc.
  - Address: 1317 Edgewater Drive Suite 536, Orlando, FL 32804
- [ ] **P1** Add business to Bing Places
- [ ] **P1** Add business to Apple Maps Connect
- [ ] **P2** Get listed on Clutch, GoodFirms, or similar B2B directories
- [ ] **P2** Encourage Google reviews from satisfied clients
- [ ] **P3** Add location page or "Areas We Serve" section if targeting multiple cities

---

## Phase 5 — Analytics & monitoring

### Setup

- [ ] **P0** Verify site in Google Search Console
- [ ] **P0** Add Google Analytics 4 (GA4) or confirm HubSpot analytics covers needs
- [ ] **P1** Set up conversion events: form submit, quote modal open, careers application
- [ ] **P1** Connect Search Console to GA4
- [ ] **P2** Set up weekly/monthly SEO reporting dashboard

### Ongoing monitoring (monthly checklist)

- [ ] **P1** Review Search Console: impressions, clicks, CTR, average position
- [ ] **P1** Review top queries and pages — adjust content accordingly
- [ ] **P1** Check for crawl errors and fix broken links
- [ ] **P2** Monitor Core Web Vitals
- [ ] **P2** Track keyword rankings for top 10 target terms
- [ ] **P2** Review competitor rankings (local IT firms, QuickBase partners)

---

## Phase 6 — Off-page SEO & authority

- [ ] **P1** Optimize LinkedIn company page (link to website, services, location)
- [ ] **P1** Add website link to email signatures and HubSpot emails
- [ ] **P2** Guest post or publish on QuickBase / Smartsheet community forums
- [ ] **P2** Pursue backlinks from Orlando business directories and tech blogs
- [ ] **P2** Share blog posts on LinkedIn (align with daily auto-publish schedule)
- [ ] **P3** Consider HARO / expert quotes for industry publications
- [ ] **P3** Partner page / client logos (with permission) for trust signals

---

## Phase 7 — Content strategy (ongoing)

- [ ] **P1** Maintain daily blog publishing (automated ✅ — 12 posts scheduled)
- [ ] **P1** Plan next batch of 12 articles after August 2026
- [ ] **P2** Add case studies / project highlights (anonymized if needed)
- [ ] **P2** Create downloadable lead magnet (e.g. "QuickBase vs Smartsheet guide" PDF)
- [ ] **P2** Refresh old blog posts from 2022 with updated dates and content
- [ ] **P3** Add video content (YouTube) and embed on site
- [ ] **P3** Start email newsletter tied to blog (HubSpot)

---

## Phase 8 — Social & rich results

- [ ] **P1** Create default OG image (1200×630) with logo + tagline
- [ ] **P1** Add `og:image` to root layout and all major pages
- [ ] **P2** Add Twitter/X card image
- [ ] **P2** Verify social previews with Facebook Sharing Debugger and Twitter Card Validator
- [ ] **P3** Add LinkedIn insight tag if running LinkedIn ads

---

## Quick wins (do this week)

1. [ ] Add `sitemap.xml` and `robots.txt` in Next.js
2. [ ] Set `metadataBase` + canonical URLs
3. [ ] Add Organization / LocalBusiness JSON-LD
4. [ ] Verify Google Search Console
5. [ ] Create and upload default OG image
6. [ ] Claim Google Business Profile

---

## Success metrics (3–6 month targets)

| Metric | Baseline | 3-month target | 6-month target |
|--------|----------|----------------|----------------|
| Google-indexed pages | TBD | 20+ | 30+ |
| Organic monthly sessions | TBD | +50% | +150% |
| Avg. position (top 10 keywords) | TBD | Top 30 | Top 15 |
| Blog organic traffic | TBD | 100 visits/mo | 500 visits/mo |
| Contact form submissions (organic) | TBD | +25% | +75% |

*Fill in baseline numbers after Search Console and GA4 are connected.*

---

## Notes & decisions log

| Date | Decision | Notes |
|------|----------|-------|
| May 2026 | Migrated from WordPress to Next.js on Vercel | Old sitemap/robots on Bigrock no longer apply |
| May 2026 | Daily blog automation enabled | GitHub Actions publishes daily at 9:00 AM UTC |
| | | |

---

## Next step

Start with **Phase 1 (Technical SEO)** — robots.txt, sitemap, structured data, and Search Console. These unblock everything else.

When ready, ask to implement Phase 1 in code.
