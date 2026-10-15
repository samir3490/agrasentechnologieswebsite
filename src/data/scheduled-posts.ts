import { BlogPost } from "./posts";

/**
 * Weekly QuickBase feature series (Thursdays).
 * Published automatically by .github/workflows/publish-blog.yml when date <= today.
 */
export const scheduledPosts: BlogPost[] = [
  {
    slug: "quickbase-roles-permissions",
    title: "QuickBase Roles and Permissions: Secure Access Without Slowing the Business",
    date: "2026-10-22",
    author: "Samir Agrawal",
    category: "QuickBase",
    image: "/blog/blog-qb-roles.jpg",
    excerpt:
      "Set up QuickBase roles and permissions so people see what they need — and nothing they should not — without turning IT into a bottleneck.",
    content: `
<p>Security theater helps nobody. Neither does an app where everyone can edit everything. <strong>QuickBase roles and permissions</strong> let you open the app widely while still protecting sensitive fields, records, and admin controls.</p>

<p>This guide covers a practical approach to access design.</p>

<h2>Why Roles Matter in QuickBase</h2>
<p>Roles determine what users can see and do: tables, fields, reports, dashboards, and sometimes individual records. Done well, a sales rep never sees internal cost fields, a vendor sees only their own records, and admins retain governance.</p>

<h2>A Simple Role Model That Scales</h2>
<ul>
<li><strong>Requesters</strong> — create and track their own items</li>
<li><strong>Operators</strong> — work queues across a team</li>
<li><strong>Approvers</strong> — decide and comment</li>
<li><strong>Managers</strong> — broader reporting visibility</li>
<li><strong>Admins</strong> — structure, automations, and user access</li>
</ul>

<p>Start here, then split roles only when a real conflict appears. Too many roles become harder to audit than too few.</p>

<h2>Field-Level and Record-Level Thinking</h2>
<p>Sometimes the table is fine to open, but a field is not — salary, margin, or personal data. Other times the table is sensitive and users should only see records they own or records in their region. QuickBase supports both styles; choose based on risk, not habit.</p>

<h2>Permissions and User Experience</h2>
<p>Hidden buttons and denied saves frustrate people when the UI still teases actions they cannot complete. Align forms and dashboards with role capabilities so the app feels intentional.</p>

<h2>Governance Habits That Prevent Drift</h2>
<ul>
<li>Review role membership quarterly</li>
<li>Document why each elevated role exists</li>
<li>Separate builder access from day-to-day business roles</li>
<li>Test critical paths as each major role before release</li>
</ul>

<h2>Secure QuickBase Apps From Agrasen Technologies</h2>
<p>Access control is part of application architecture, not a final checkbox. <strong>Agrasen Technologies</strong> designs QuickBase roles and permissions with your org chart and compliance needs in mind. If you need an app that is open enough to use and closed enough to trust, <a href="/contact">talk with us</a>.</p>

<p>Good permissions are quiet. People simply work inside the right boundaries.</p>
`,
  },
  {
    slug: "quickbase-charts-kpis",
    title: "QuickBase Charts and KPIs: Visualize Performance Without Another BI Tool",
    date: "2026-10-29",
    author: "Samir Agrawal",
    category: "QuickBase",
    image: "/blog/blog-qb-charts.jpg",
    excerpt:
      "Use QuickBase charts and KPIs to track performance inside the app your team already lives in — with tips for metrics that drive action.",
    content: `
<p>Not every KPI needs a separate business intelligence stack. For operational metrics tied directly to how work is done, <strong>QuickBase charts and KPIs</strong> can put performance in front of the people who can change it.</p>

<p>Here is how to choose metrics and visualizations that change behavior.</p>

<h2>What to Chart in QuickBase</h2>
<ul>
<li>Throughput: records completed per week</li>
<li>Cycle time: average days from submission to approval</li>
<li>Backlog: open items by stage or owner</li>
<li>Quality: rejection rate or rework count</li>
<li>SLA health: percent on-time vs late</li>
</ul>

<p>If a metric cannot influence a decision this month, it probably does not belong on the primary dashboard.</p>

<h2>Chart Types and When to Use Them</h2>
<ul>
<li><strong>Bar charts</strong> for comparisons across categories</li>
<li><strong>Line charts</strong> for trends over time</li>
<li><strong>Stacked views</strong> when composition matters</li>
<li><strong>Simple number widgets</strong> for single critical KPIs</li>
</ul>

<h2>Define the Metric Once</h2>
<p>Write a one-line definition for each KPI and reuse it everywhere. "Open requests" should not mean something different on the executive dashboard than it does on the team queue. QuickBase reporting is only as aligned as your definitions.</p>

<h2>Pair Charts With Action Lists</h2>
<p>A red KPI without a drill-down is just anxiety. Place the chart next to a report of the records causing the problem. That pairing is how operational dashboards outperform slide-deck analytics.</p>

<h2>When You Still Need a BI Tool</h2>
<p>Cross-system financial analytics, heavy statistical models, or company-wide semantic layers may belong in Power BI or similar tools. Use QuickBase charts for the operational loop; reserve enterprise BI for enterprise questions.</p>

<h2>KPI Dashboards From Agrasen Technologies</h2>
<p><strong>Agrasen Technologies</strong> builds QuickBase apps where KPIs, charts, and work queues share the same trustworthy data model. If you want performance visible where work happens, <a href="/contact">request a QuickBase consultation</a>.</p>

<p>Charts should not decorate the app. They should change what the team does next.</p>
`,
  },
  {
    slug: "quickbase-webhooks-api-integrations",
    title: "QuickBase Webhooks and API Integrations: Extend Your App Beyond QuickBase",
    date: "2026-11-05",
    author: "Samir Agrawal",
    category: "QuickBase",
    image: "/blog/blog-qb-integrations.jpg",
    excerpt:
      "Learn how QuickBase webhooks and API integrations connect your app to the rest of your stack — securely and without fragile manual syncs.",
    content: `
<p>Sooner or later, every serious QuickBase application needs to talk to something else: a website form, an ERP, a document tool, a custom portal. <strong>QuickBase webhooks and API integrations</strong> are how you extend the platform without abandoning it.</p>

<p>This article explains the options at a practical level and how to approach them safely.</p>

<h2>Webhooks vs API Calls — Simple Distinction</h2>
<p><strong>Webhooks</strong> push an event out when something happens in QuickBase (or receive an event from another system). <strong>API integrations</strong> let systems create, read, update, or delete QuickBase data on demand. Many real solutions use both.</p>

<h2>Integration Scenarios That Deliver ROI</h2>
<ul>
<li>Website lead forms creating QuickBase intake records instantly</li>
<li>Pushing approved invoices to accounting software</li>
<li>Syncing project status to a customer portal</li>
<li>Triggering document generation or e-signature packets</li>
<li>Updating QuickBase when a shipment status changes upstream</li>
</ul>

<h2>Integration Design Checklist</h2>
<ul>
<li>Authentication and least-privilege tokens</li>
<li>Field mapping and data validation</li>
<li>Idempotency (no duplicate records on retry)</li>
<li>Error queues and alerting</li>
<li>Audit logs for regulated processes</li>
<li>Rate limits and volume expectations</li>
</ul>

<h2>Build vs Configure</h2>
<p>Some connections are mostly configuration through Pipelines or native connectors. Others need custom middleware, especially with legacy ERPs or complex identity matching. Choosing wrong creates either fragile duct tape or unnecessary project cost.</p>

<h2>Security Considerations</h2>
<p>Never expose more API access than the integration needs. Rotate credentials, store secrets outside shared inboxes, and monitor failed authentication attempts. Integrations expand your attack surface — treat them like production software.</p>

<h2>Agrasen Technologies Builds Connected QuickBase Systems</h2>
<p>Whether you need a clean webhook from your website or a deeper API integration with finance and operations tools, <strong>Agrasen Technologies</strong> designs the QuickBase side and the connection pattern together. If your app needs to play well with the rest of your stack, <a href="/contact">contact us to scope the integration</a>.</p>

<p>The best integrations disappear into the process — data shows up where it should, and teams stop asking who was supposed to copy it over.</p>
`,
  },
];
