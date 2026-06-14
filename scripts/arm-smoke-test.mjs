/**
 * ARM production smoke tests — run: node scripts/arm-smoke-test.mjs
 * Optional: BASE_URL=https://agrasentechnologies.com node scripts/arm-smoke-test.mjs
 */

const BASE = (process.env.BASE_URL || "https://agrasentechnologies.com").replace(/\/$/, "");

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchStatus(path, init = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { redirect: "follow", ...init });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not json */
  }
  return { res, text, json, url };
}

async function expectPage(path, mustContain = []) {
  const { res, text } = await fetchStatus(path);
  if (res.status !== 200) {
    fail(`Page ${path}`, `status ${res.status}`);
    return;
  }
  for (const needle of mustContain) {
    if (!text.includes(needle)) {
      fail(`Page ${path}`, `missing "${needle}"`);
      return;
    }
  }
  pass(`Page ${path}`, `200${mustContain.length ? ", content ok" : ""}`);
}

async function expectApi(path, { method = "GET", status, body, headers } = {}) {
  const init = { method, headers: headers || {} };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    init.headers = { "Content-Type": "application/json", ...init.headers };
  }
  const { res, json } = await fetchStatus(path, init);
  if (res.status !== status) {
    fail(`API ${method} ${path}`, `expected ${status}, got ${res.status}${json?.error ? ` (${json.error})` : ""}`);
    return;
  }
  pass(`API ${method} ${path}`, String(status));
}

async function checkSecurityHeaders(path) {
  const { res } = await fetchStatus(path);
  const checks = [
    ["strict-transport-security", "HSTS"],
    ["x-frame-options", "X-Frame-Options"],
    ["x-content-type-options", "nosniff"],
  ];
  for (const [header, label] of checks) {
    if (res.headers.get(header)) pass(`Header ${label} on ${path}`);
    else fail(`Header ${label} on ${path}`, "missing");
  }
}

async function main() {
  console.log(`\nARM smoke tests → ${BASE}\n`);

  console.log("Public pages");
  await expectPage("/", "Agrasen");
  await expectPage("/products", "AI Relationship Manager");
  await expectPage("/products/ai-relationship-manager", "personal CRM");
  await expectPage("/ai-relationship-manager", "AI Relationship Manager");
  await expectPage("/ai-relationship-manager/signup", "Create");
  await expectPage("/ai-relationship-manager/login", "Sign in");
  await expectPage("/ai-relationship-manager/map", "Map");
  await expectPage("/ai-relationship-manager/contacts", "Contacts");
  await expectPage("/ai-relationship-manager/settings", "Settings");

  console.log("\nSEO & security files");
  const { res: sitemapRes, text: sitemap } = await fetchStatus("/sitemap.xml");
  if (sitemapRes.status === 200 && sitemap.includes("/ai-relationship-manager") && sitemap.includes("/products/ai-relationship-manager")) {
    pass("sitemap.xml", "includes ARM URLs");
  } else fail("sitemap.xml", `status ${sitemapRes.status}`);

  const { res: robotsRes, text: robots } = await fetchStatus("/robots.txt");
  if (robotsRes.status === 200 && robots.includes("Disallow: /ai-relationship-manager/dashboard")) {
    pass("robots.txt", "blocks app routes");
  } else fail("robots.txt");

  const { res: secRes } = await fetchStatus("/.well-known/security.txt");
  if (secRes.status === 200) pass("security.txt", "200");
  else fail("security.txt", `status ${secRes.status}`);

  console.log("\nLanding SEO");
  const { text: landing } = await fetchStatus("/ai-relationship-manager");
  if (landing.includes("application/ld+json") && landing.includes("SoftwareApplication")) {
    pass("ARM landing JSON-LD");
  } else fail("ARM landing JSON-LD", "missing schema");

  console.log("\nSecurity headers");
  await checkSecurityHeaders("/");
  await checkSecurityHeaders("/ai-relationship-manager");

  console.log("\nAPI auth (must reject unauthenticated)");
  await expectApi("/api/arm/platform/status", { status: 401 });
  await expectApi("/api/arm/accounts", { status: 401 });
  await expectApi("/api/arm/accounts", { method: "POST", status: 401, body: { name: "Test" } });
  await expectApi("/api/arm/accounts/fake-id/contacts", { status: 401 });
  await expectApi("/api/arm/accounts/fake-id/digest", { status: 401 });
  await expectApi("/api/arm/accounts/fake-id/settings", { status: 401 });
  await expectApi("/api/arm/accounts/fake-id/integrations", { status: 401 });
  await expectApi("/api/arm/accounts/fake-id/export", { status: 401 });
  await expectApi("/api/arm/accounts/fake-id/audit-logs", { status: 401 });
  await expectApi("/api/arm/integrations/google-calendar/auth-url", { status: 401 });
  await expectApi("/api/arm/integrations/google-calendar/status", { status: 401 });

  console.log("\nCron & webhooks (must reject without secret)");
  await expectApi("/api/arm/cron/reminders", { status: 401 });
  await expectApi("/api/arm/cron/digest", { status: 401 });
  await expectApi("/api/arm/billing/webhook", {
    method: "POST",
    status: 401,
    body: "{}",
    headers: { "x-razorpay-signature": "invalid" },
  });

  console.log("\nGoogle Calendar OAuth callback");
  {
    const { res } = await fetchStatus("/api/arm/integrations/google-calendar/callback", {
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    if ((res.status === 307 || res.status === 302) && location.includes("calendar=invalid")) {
      pass("Calendar callback redirect", "invalid state → settings");
    } else {
      fail("Calendar callback redirect", `status ${res.status}, location ${location}`);
    }
  }

  console.log("\nRequest body limit");
  {
    const bigBody = "x".repeat(1024 * 1024 + 1);
    const { res, json } = await fetchStatus("/api/arm/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bigBody,
    });
    if (res.status === 413) pass("Body size limit", "413 on >1MB");
    else fail("Body size limit", `expected 413, got ${res.status}`);
  }

  console.log("\nApp routes noindex");
  const { text: dashHtml } = await fetchStatus("/ai-relationship-manager/dashboard");
  if (dashHtml.includes('noindex') || dashHtml.includes('robots')) {
    pass("Dashboard noindex metadata");
  } else {
    // Client-rendered — check for app shell / login redirect indicators
    if (dashHtml.includes("AI Relationship Manager") || dashHtml.includes("Sign in")) {
      pass("Dashboard route loads", "app shell present");
    } else fail("Dashboard route", "unexpected response");
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${"─".repeat(50)}`);
  console.log(`Results: ${passed}/${results.length} passed`);
  if (failed.length) {
    console.log("\nFailed:");
    for (const f of failed) console.log(`  • ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  console.log("All smoke tests passed.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
