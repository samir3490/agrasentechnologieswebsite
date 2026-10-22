import { BlogPost } from "./posts";

/**
 * Weekly QuickBase feature series (Thursdays).
 * Published automatically by .github/workflows/publish-blog.yml when date <= today.
 */
export const scheduledPosts: BlogPost[] = [
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
