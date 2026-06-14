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
- [x] **YOUR ACTION** — Deploy Firestore rules from `firebase-agrasen/firestore.rules` after each rules change *(you confirmed done)*

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

- [x] News fetch for contact company/city
- [x] Store in `ripAccounts/{id}/newsItems`
- [x] UI on contact detail (Refresh news button)
- [x] Google News RSS fallback (works without API key)
- [ ] **YOUR ACTION** — Optional `NEWS_API_KEY` on Vercel for NewsAPI.org (richer results in production)
- [ ] **YOUR ACTION** — Test: open contact with company/city → Refresh news → confirm headlines

---

## Phase 7 — Billing (Razorpay) + multi-tenant BYOK

Each **workspace** is independent: its own plan, contact limit, and API connections. Users can bring their own keys (BYOK) so the product works for anyone — not only the platform operator.

### Multi-tenant connections (BYOK)

- [x] Per-workspace integrations stored encrypted (`ripAccounts/{id}/private/integrations`)
- [x] Settings → **Connections** UI (OpenAI, Mapbox, News, Email, Google OAuth)
- [x] Workspace keys override platform env defaults
- [x] Map, AI, news, email cron, geocoding resolve per workspace
- [x] Google Calendar supports workspace OAuth app or platform default
- [ ] **YOUR ACTION** — Set `INTEGRATIONS_ENCRYPTION_KEY` on Vercel (32+ char secret) to enable saving workspace keys

### Billing

- [x] Pro / Business plans with Razorpay checkout
- [x] Webhook + payment verification
- [x] Per-workspace plan & contact limit upgrade
- [x] Settings → **Plan & billing** UI
- [ ] **YOUR ACTION** — `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (platform operator billing)
- [ ] **YOUR ACTION** — Razorpay webhook URL: `https://agrasentechnologies.com/api/arm/billing/webhook`
- [ ] **YOUR ACTION** — Test upgrade flow on a workspace

---

## Phase 8 — Enterprise & compliance

- [x] Audit logs (contact, settings, team, billing, export)
- [x] Audit log UI in Settings → Compliance
- [x] GDPR workspace data export (JSON download)
- [x] Team management (add/remove members, roles)
- [x] WhatsApp share from message drafts (wa.me link — no API key)
- [x] Setup checklist with Test buttons for each integration
- [ ] Push notifications (future)
- [ ] WhatsApp Business API (future — optional enterprise)

---

## Customer integration guide (self-service)

Each workspace owner can configure everything in **Settings** without contacting support:

1. **Setup checklist** — step-by-step with links to OpenAI, Mapbox, Resend, Google Cloud
2. **Test** buttons — verify each connection before going live
3. **Connections** — paste API keys (encrypted per workspace)
4. **Google Calendar** — connect personal Google account after OAuth app is saved

Platform operator env vars are **optional defaults** — customers can use 100% their own keys.

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
| `NEWS_API_KEY` | News (optional) | **Optional — RSS works without** |
| `INTEGRATIONS_ENCRYPTION_KEY` | Workspace BYOK secrets | **Your action** |
| `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` | Platform billing | **Your action** |
| Workspace Connections (Settings) | Per-tenant API keys | **Each user/org** |

---

*Last updated: June 2026*
