# Retire rip-theta.vercel.app

The standalone RIP app on **rip-theta.vercel.app** is deprecated. All traffic should go to:

**https://agrasentechnologies.com/ai-relationship-manager**

---

## Option A — Redirect in the old Vercel project (recommended)

In the **rip-theta** Vercel project, add or merge this `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://agrasentechnologies.com/ai-relationship-manager/:path*",
      "permanent": true
    }
  ]
}
```

Then redeploy the rip-theta project (or delete the project after confirming redirect works).

**Steps in Vercel dashboard:**

1. Open project **rip-theta** (or whatever the old RIP project is named)
2. Settings → Domains — note `rip-theta.vercel.app`
3. Add `vercel.json` to that repo’s root with the redirect above
4. Deploy → visit `https://rip-theta.vercel.app` and confirm 308 to agrasen

---

## Option B — Remove the old project

If you no longer need the domain:

1. Vercel → rip-theta project → Settings → Delete Project
2. Update any bookmarks or docs that still point to rip-theta

---

## Already done on agrasen site

- Products page links to `/ai-relationship-manager` (not rip-theta)
- ARM landing, signup, and app live under agrasentechnologies.com
- Sitemap and Search Console point at agrasen URLs

---

## Internal Firestore paths

Backend collections still use the `ripAccounts/` and `ripUsers/` prefixes. This is internal only — no user-facing change required unless you run a data migration later.
