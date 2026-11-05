# ARM — Platform operator integration setup

Configure these on **Vercel → Agrasen Technologies site project → Settings → Environment Variables**  
(the project that serves **agrasentechnologies.com** — not the old RIP project).

Customers can also use **100% their own keys** per workspace in Settings → Connections (requires `INTEGRATIONS_ENCRYPTION_KEY`).

## Do this next (in order)

### 1. Required platform secrets

| Variable | How to set |
|----------|------------|
| `INTEGRATIONS_ENCRYPTION_KEY` | 32+ random characters (required to save workspace API keys) |
| `CRON_SECRET` | Random secret (optional but recommended) |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) |
| `EMAIL_FROM` | e.g. `AI Relationship Manager <notifications@yourdomain.com>` (verified domain in Resend) |

**Alternative email:** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` instead of Resend.

After adding vars → **Redeploy** the Agrasen project.

### 2. Recommended

| Variable | Enables |
|----------|---------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Map page |
| `MAPBOX_ACCESS_TOKEN` | Server geocoding (can be the same token) |

### 3. Optional

| Variable | Enables |
|----------|---------|
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Personalized AI (heuristics work without) |
| `NEWS_API_KEY` | Richer news (RSS works without) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Billing |
| `ALERT_EMAIL` | Platform error alerts |

Razorpay webhook URL: `https://agrasentechnologies.com/api/arm/billing/webhook`  
Event: `payment.captured`

## Already configured (you confirmed)

- `NEXT_PUBLIC_FIREBASE_*` + `FIREBASE_ADMIN_*`
- `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL=https://agrasentechnologies.com`
- `ARM_OPERATOR_PASSWORD` (operator panel)

## Password reset (optional polish)

1. Firebase Console → Authentication → Templates → Password reset  
2. Action URL → `https://agrasentechnologies.com/ai-relationship-manager/reset-password`

## Verify after setup

1. Sign in → **Settings → Setup checklist** → run each **Test** button  
2. Add a contact with birthday → confirm digest on dashboard  
3. Operator panel → confirm activity appears  
4. Optionally: `npm run test:arm-smoke`

See [ARM-PLAN.md](./ARM-PLAN.md) and [ARM-TESTING.md](./ARM-TESTING.md).
