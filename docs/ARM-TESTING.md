# AI Relationship Manager — Testing

## Automated tests

```bash
npm test                 # Unit tests (vitest) — dates, health, crypto, validation, AI heuristics, news RSS
npm run test:arm-smoke   # Production HTTP smoke tests (36 checks on agrasentechnologies.com)
```

CI runs `npm test` on push/PR when ARM files change (`.github/workflows/arm-tests.yml`).

### What smoke tests cover

- Public pages and product SEO routes
- `sitemap.xml`, `robots.txt`, `security.txt`, JSON-LD
- Security headers (HSTS, X-Frame-Options, nosniff)
- All protected APIs return 401 without auth
- Cron and Razorpay webhook reject unauthorized calls
- Google Calendar callback redirect
- 1 MB request body limit
- App routes `noindex`

### What requires manual login

| Feature | Steps |
|---------|--------|
| Auth | Sign up / Google sign-in → onboarding → welcome banner |
| Contacts | Add → edit → log interaction → delete |
| Digest | Dashboard shows birthdays from contacts |
| Calendar | Settings → Connect Google Calendar → verify events |
| AI | Contact → gift suggestions / message draft |
| Map | Contact with city → Map page pin (Mapbox token required) |
| News | Contact with company → Refresh news |
| BYOK | Settings → Connections → save keys → Test buttons |
| Billing | Settings → Plan & billing → Razorpay checkout |
| Compliance | Export JSON, audit log, team member add/remove |

Use **Settings → Setup checklist** Test buttons to verify each integration for your workspace.

---

*Last updated: June 2026*
