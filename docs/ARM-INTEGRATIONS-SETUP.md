# ARM — Platform operator integration setup

Configure these on **Vercel → agrasen-technologies → Settings → Environment Variables**.  
Customers can also use **100% their own keys** per workspace in Settings → Connections (requires `INTEGRATIONS_ENCRYPTION_KEY`).

## Required for full platform defaults

| Variable | Where to get it | Enables |
|----------|-----------------|--------|
| `INTEGRATIONS_ENCRYPTION_KEY` | Generate 32+ random chars | Saving workspace BYOK secrets |
| `RESEND_API_KEY` + `EMAIL_FROM` | [resend.com](https://resend.com) | Reminder & digest emails |
| `CRON_SECRET` | Random secret | Securing cron endpoints (optional if using Vercel cron header) |

**Alternative email:** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` instead of Resend.

## Already configured (you confirmed)

- `NEXT_PUBLIC_FIREBASE_*` + `FIREBASE_ADMIN_*`
- `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL=https://agrasentechnologies.com`

## Optional enhancements

| Variable | Enables |
|----------|---------|
| `OPENAI_API_KEY` | Personalized AI gifts/messages (heuristics work without) |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Map page |
| `MAPBOX_ACCESS_TOKEN` | Server geocoding (can match public token) |
| `NEWS_API_KEY` | NewsAPI.org (Google RSS works without) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Pro/Business billing |
| `ALERT_EMAIL` | Platform error alerts |

## Razorpay webhook

URL: `https://agrasentechnologies.com/api/arm/billing/webhook`  
Event: `payment.captured`

## Verify after setup

1. Sign in → **Settings → Setup checklist** → run each **Test** button
2. Or call `/api/arm/platform/status` while authenticated (shows platform config flags)
3. Run `npm run test:arm-smoke` from repo root

See [ARM-PLAN.md](./ARM-PLAN.md) for phase checklist.
