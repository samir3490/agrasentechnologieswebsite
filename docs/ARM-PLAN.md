# AI Relationship Manager — Build Plan

**App URL:** https://agrasentechnologies.com/ai-relationship-manager  
**Repo:** [agrasentechnologieswebsite](https://github.com/samir3490/agrasentechnologieswebsite)  
**Firebase:** `agrasen-technologies` (`ripAccounts/`, `ripUsers/`)

Legend: `[x]` done · `[ ]` not done · `[ ]` **YOUR ACTION** = you must configure or verify

---

## Phase 0 — Hosting & foundation

- [x] Next.js app merged into agrasen-technologies website
- [x] Routes under `/ai-relationship-manager`
- [x] API under `/api/arm/`
- [x] Deployed to agrasentechnologies.com
- [x] Products page links to internal app (not rip-theta.vercel.app)
- [x] Webpack build + `firebase-admin` v13 for Vercel
- [x] Firebase client env vars on Vercel
- [x] Firebase Admin credentials on Vercel
- [ ] **YOUR ACTION** — Firebase Auth → Authorized domains: `agrasentechnologies.com`, `www.agrasentechnologies.com`
- [ ] **YOUR ACTION** — Deploy Firestore rules from `firebase-agrasen/firestore.rules` after each rules change

---

## Phase 1 — Core CRM (MVP)

- [x] Google + email authentication
- [x] Workspace onboarding
- [x] Contact CRUD (personal / business / NGO fields)
- [x] Interaction logging
- [x] Dashboard + contact list/search
- [x] Free plan contact limit (100)
- [x] Firestore security rules for RIP namespaces

---

## Phase 2 — Reminders & email

- [x] Birthday / anniversary event sync
- [x] Reminder records + daily digest builder
- [x] Dashboard digest UI
- [x] Settings: notification prefs, re-sync reminders
- [x] Vercel cron (`/api/arm/cron/reminders`, `/api/arm/cron/digest`) — 8 AM IST
- [ ] **YOUR ACTION** — Email delivery: set **one** of these on Vercel (agrasen-technologies):
  - `RESEND_API_KEY` + optional `EMAIL_FROM`, or
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`
- [ ] **YOUR ACTION** — Set `CRON_SECRET` on Vercel (optional; Vercel cron header also accepted)
- [ ] **YOUR ACTION** — Set `ALERT_EMAIL` if you want platform error alerts
- [ ] Verify digest/reminder emails arrive (create contact with birthday → wait for cron or use dashboard digest)

---

## Phase 2b — Google Calendar sync

- [x] OAuth connect flow
- [x] One-way sync: birthdays & anniversaries → Google Calendar
- [x] Auto-sync on contact create/update/delete
- [x] Settings UI (connect / sync now / disconnect)
- [x] **YOUR ACTION** — `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` on Vercel *(you confirmed done)*
- [x] **YOUR ACTION** — Google Cloud: Calendar API enabled + redirect URI configured *(you confirmed done)*
- [ ] **YOUR ACTION** — Test: Settings → Connect Google Calendar → check Google Calendar for yearly events

---

## Phase 3 — AI assistant

- [x] Gift suggestions with Amazon.in search links (no Amazon API)
- [x] Message drafts (check-in, birthday, thank you, follow-up)
- [x] Heuristic fallback when OpenAI not configured
- [ ] **YOUR ACTION** — `OPENAI_API_KEY` on Vercel for personalized AI (optional)
- [ ] **YOUR ACTION** — Optional `OPENAI_MODEL` (default: `gpt-4o-mini`)

---

## Phase 4 — Relationship health

- [x] Health score from last interaction date
- [x] Labels: Strong / Moderate / Weak / Dormant
- [x] Badges on contact list + detail
- [x] Dashboard “Need attention” stat
- [x] Score updates when logging interactions
- [ ] Optional later: AI-adjusted health, interaction frequency weighting

---

## Phase 5 — Map & network view

- [x] Contact map (Mapbox)
- [x] Geocode city → lat/lng on contact save
- [x] Map nav link in app shell
- [x] Simple network summary by city / relationship type
- [x] Platform status API (`/api/arm/platform/status`)
- [ ] **YOUR ACTION** — `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` on Vercel (public map)
- [ ] **YOUR ACTION** — `MAPBOX_ACCESS_TOKEN` on Vercel (server geocoding; can be same token as public)
- [ ] **YOUR ACTION** — Test: add city to a contact → open Map → confirm pin appears

---

## Phase 6 — Company & location news

- [ ] News fetch for contact company/city
- [ ] Store in `ripAccounts/{id}/newsItems`
- [ ] UI on contact detail
- [ ] **YOUR ACTION** — News API key (e.g. `NEWS_API_KEY`) when implemented

---

## Phase 7 — Billing (Razorpay)

- [ ] Pro / Business plans
- [ ] Razorpay checkout + webhooks
- [ ] Plan limits enforcement upgrade path
- [ ] **YOUR ACTION** — `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

---

## Phase 8 — Enterprise & compliance

- [ ] Audit logs UI
- [ ] GDPR data export
- [ ] WhatsApp / push notifications
- [ ] Multi-workspace admin tools

---

## Deprecated / optional cleanup

- [ ] Retire or redirect `rip-theta.vercel.app` (standalone RIP Vercel project)
- [ ] Align all user-facing copy from “RIP” to “AI Relationship Manager”

---

## Quick reference — Vercel env vars

| Variable | Required for | Status |
|----------|----------------|--------|
| `NEXT_PUBLIC_FIREBASE_*` | Auth, app | You set |
| `FIREBASE_ADMIN_*` | API, cron | You set |
| `NEXT_PUBLIC_APP_URL` | OAuth redirects | Should be `https://agrasentechnologies.com` |
| `GOOGLE_OAUTH_CLIENT_ID/SECRET` | Calendar sync | You set |
| `OPENAI_API_KEY` | AI gifts/messages | **Optional — your action** |
| `RESEND_API_KEY` or `SMTP_*` | Email reminders | **Your action** |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Map page | **Your action** |
| `MAPBOX_ACCESS_TOKEN` | Geocoding | **Your action** |
| `CRON_SECRET` | Cron auth | **Your action** |
| `ALERT_EMAIL` | Error alerts | **Optional** |

---

*Last updated: June 2026*
