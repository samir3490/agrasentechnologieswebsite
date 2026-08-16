/**
 * Sends blog publish / empty-queue emails using Resend or SMTP.
 * Reads .blog-publish-status.json written by publish-scheduled.js
 *
 * Env (GitHub Actions secrets):
 *   BLOG_NOTIFY_TO   — default samir.agrawal@agrasentechnologies.com
 *   EMAIL_FROM       — e.g. Agrasen Blog <noreply@agrasentechnologies.com>
 *   RESEND_API_KEY   — preferred
 *   SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT — alternative
 */
const fs = require("fs");
const path = require("path");

const statusPath = path.join(process.cwd(), ".blog-publish-status.json");
const SITE =
  trimEnv("NEXT_PUBLIC_APP_URL")?.replace(/\/$/, "") || "https://agrasentechnologies.com";
const TO = trimEnv("BLOG_NOTIFY_TO") || "samir.agrawal@agrasentechnologies.com";
const FROM =
  trimEnv("EMAIL_FROM") ||
  trimEnv("BLOG_EMAIL_FROM") ||
  "Agrasen Technologies Blog <noreply@agrasentechnologies.com>";

function trimEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) return "";
  return String(value).trim();
}

function loadStatus() {
  if (!fs.existsSync(statusPath)) {
    console.log("No status file; nothing to email.");
    return null;
  }
  return JSON.parse(fs.readFileSync(statusPath, "utf8"));
}

function isEmailConfigured() {
  if (trimEnv("RESEND_API_KEY")) return true;
  return !!(trimEnv("SMTP_HOST") && trimEnv("SMTP_USER") && trimEnv("SMTP_PASS"));
}

async function sendViaResend({ to, subject, html, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${trimEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error("Resend failed: " + res.status + " " + body);
  }
  console.log("Sent via Resend");
}

async function sendViaSmtp({ to, subject, html, text }) {
  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch {
    throw new Error("nodemailer is not installed");
  }
  const port = Number(trimEnv("SMTP_PORT") || 587);
  const transporter = nodemailer.createTransport({
    host: trimEnv("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: {
      user: trimEnv("SMTP_USER"),
      pass: trimEnv("SMTP_PASS"),
    },
  });
  await transporter.sendMail({ from: FROM, to, subject, html, text });
  console.log("Sent via SMTP");
}

async function sendEmail(payload) {
  if (trimEnv("RESEND_API_KEY")) {
    await sendViaResend(payload);
    return;
  }
  await sendViaSmtp(payload);
}

function publishEmail(status) {
  const posts = status.published || [];
  const listHtml = posts
    .map((p) => {
      const url = p.slug ? `${SITE}/blog/${p.slug}` : `${SITE}/blog`;
      return `<li><a href="${url}"><strong>${escapeHtml(p.title)}</strong></a> (${escapeHtml(p.date || status.date)})</li>`;
    })
    .join("\n");
  const listText = posts
    .map((p) => `- ${p.title} (${p.date || status.date})${p.slug ? `\n  ${SITE}/blog/${p.slug}` : ""}`)
    .join("\n");

  const emptyNoteHtml = status.emptyQueue
    ? `<p><strong>The scheduled post queue is now empty.</strong> Please add more posts to <code>src/data/scheduled-posts.ts</code> so publishing can continue.</p>`
    : `<p><strong>${status.remaining}</strong> scheduled post(s) remaining in the queue.</p>`;
  const emptyNoteText = status.emptyQueue
    ? "The scheduled post queue is now empty. Please refill src/data/scheduled-posts.ts."
    : `${status.remaining} scheduled post(s) remaining.`;

  const subject = status.emptyQueue
    ? `Blog live + queue empty: ${posts.length} post(s) published`
    : `Blog live: ${posts.length} post(s) published`;

  const html = `
    <p>Your Agrasen Technologies blog just published:</p>
    <ul>${listHtml}</ul>
    ${emptyNoteHtml}
    <p><a href="${SITE}/blog">View blog</a> · <a href="${SITE}/blog/rss.xml">RSS feed</a></p>
  `;
  const text = `Your Agrasen Technologies blog just published:\n\n${listText}\n\n${emptyNoteText}\n\nBlog: ${SITE}/blog\nRSS: ${SITE}/blog/rss.xml\n`;

  return { subject, html, text };
}

function emptyQueueEmail(status) {
  const subject = "Blog schedule empty — refill scheduled posts";
  const html = `
    <p>The Agrasen Technologies blog publish job ran on <strong>${escapeHtml(status.date)}</strong> and found <strong>no scheduled posts</strong>.</p>
    <p>Add new entries to <code>src/data/scheduled-posts.ts</code> (with future dates) so the daily GitHub Action can keep publishing.</p>
    <p><a href="${SITE}/blog">View blog</a></p>
  `;
  const text = `The blog publish job ran on ${status.date} and found no scheduled posts.\n\nAdd new entries to src/data/scheduled-posts.ts so publishing can continue.\n\nBlog: ${SITE}/blog\n`;
  return { subject, html, text };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  const status = loadStatus();
  if (!status) process.exit(0);

  if (!isEmailConfigured()) {
    console.warn(
      "Email not configured. Add GitHub Actions secrets RESEND_API_KEY (or SMTP_HOST/SMTP_USER/SMTP_PASS) and EMAIL_FROM. Skipping notify."
    );
    process.exit(0);
  }

  if (status.reason === "nothing_due") {
    console.log("Nothing due today; no email.");
    process.exit(0);
  }

  if (status.reason === "queue_empty") {
    // Weekly reminder only (Monday UTC) to avoid daily spam while the queue stays empty.
    const day = new Date().getUTCDay();
    if (day !== 1) {
      console.log("Queue empty; empty-queue reminder emails only on Mondays UTC. Skipping today.");
      process.exit(0);
    }
    const payload = emptyQueueEmail(status);
    await sendEmail({ to: TO, ...payload });
    console.log("Empty-queue reminder emailed to " + TO);
    process.exit(0);
  }

  if (status.reason === "published") {
    const payload = publishEmail(status);
    await sendEmail({ to: TO, ...payload });
    console.log("Publish notification emailed to " + TO);
    process.exit(0);
  }

  console.log("Unknown status reason: " + status.reason);
}

main().catch((err) => {
  console.error(err);
  // Do not fail the publish workflow solely because email failed.
  process.exit(0);
});
