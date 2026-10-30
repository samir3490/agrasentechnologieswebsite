export type ServiceLanding = {
  slug: string;
  name: string;
  title: string;
  h1: string;
  description: string;
  image: string;
  imageAlt: string;
  intro: string;
  outcomes: { title: string; body: string }[];
  fit: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
};

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "quickbase-development",
    name: "QuickBase Development",
    title: "QuickBase Development | Custom Apps Orlando FL",
    h1: "QuickBase Development for Teams Tired of Spreadsheets",
    description:
      "Custom QuickBase applications from Agrasen Technologies in Orlando, FL. Tables, workflows, roles, dashboards, and automations built around how your team already works.",
    image: "/services/service-quickbase.jpg",
    imageAlt: "Custom QuickBase application development",
    intro:
      "Agrasen Technologies designs QuickBase apps around the process you run today — not a generic template. Operations, project, and field teams get one system for intake, approvals, reporting, and follow-through instead of scattered sheets and email.",
    outcomes: [
      {
        title: "Tables and relationships that match the work",
        body: "Customers, jobs, tasks, vendors, and files modeled as they actually connect — so reports and automations stop fighting the data.",
      },
      {
        title: "Workflows and roles people can live in",
        body: "Stages, owners, and permissions so the right people see the right records without turning IT into a bottleneck.",
      },
      {
        title: "Dashboards and automations that move work",
        body: "KPIs, aging queues, notifications, and Pipelines that keep the process moving when someone is out of the office.",
      },
    ],
    fit: [
      "You run operations in Excel, Google Sheets, or email threads",
      "Approvals stall because nobody can see where a request sits",
      "Field or project teams need one place to update status",
      "Leadership wants numbers without a weekly spreadsheet merge",
      "You already have QuickBase and need it rebuilt around the real process",
    ],
    process: [
      {
        title: "Map the workflow",
        description: "We walk the process you run in sheets, inboxes, and tribal knowledge — including the exceptions that break templates.",
      },
      {
        title: "Design the app",
        description: "Tables, relationships, roles, and forms are designed before we over-build automations.",
      },
      {
        title: "Build and iterate",
        description: "Ship a usable QuickBase application, then refine dashboards and automations as the team uses it.",
      },
      {
        title: "Support the change",
        description: "The process will change. The app should be able to change with it without starting over.",
      },
    ],
    faqs: [
      {
        question: "Do you work with companies outside Orlando?",
        answer:
          "Yes. Agrasen Technologies is based in Orlando, FL and builds QuickBase applications for teams nationwide.",
      },
      {
        question: "Can you migrate our Excel or Google Sheets into QuickBase?",
        answer:
          "Yes. Most QuickBase projects start with the sheets you already use. We design the tables and relationships first, then bring history across in a way the new app can actually run.",
      },
      {
        question: "How long does a QuickBase project take?",
        answer:
          "Smaller workflow apps can ship in weeks. Larger multi-team systems take longer. A free 30-minute workflow review is how we size the work before you commit to a build.",
      },
      {
        question: "What is included in the free 30-minute workflow review?",
        answer:
          "We map the process you want to replace, identify what belongs in QuickBase, and outline a practical next step. There is no obligation to start a project.",
      },
    ],
    related: [
      { href: "/services/low-code-applications", label: "Low-Code Applications" },
      { href: "/services/smartsheet-solutions", label: "Smartsheet Solutions" },
    ],
  },
  {
    slug: "low-code-applications",
    name: "Low-Code Applications",
    title: "Low-Code Applications | Business Software in Weeks",
    h1: "Low-Code Applications Your Team Can Actually Run",
    description:
      "Low-code business applications from Agrasen Technologies. Forms, approvals, reporting, and integrations shipped in weeks — then iterated as the process changes.",
    image: "/services/service-low-code.jpg",
    imageAlt: "Low-code business application design",
    intro:
      "When you need business software in weeks, not a year-long custom build, low-code is the practical path. We use the platform that fits the process — often QuickBase, sometimes Smartsheet or another tool — and ship something operations can run without a developer for every change.",
    outcomes: [
      {
        title: "Software that matches the process",
        body: "Intake, approvals, assignments, and reporting designed around how work already moves — then tightened after people use it.",
      },
      {
        title: "Faster than a custom code project",
        body: "Low-code is how we get a usable application in front of the team quickly, then iterate instead of waiting on a long waterfall build.",
      },
      {
        title: "Room to change",
        body: "Processes do not freeze at go-live. The application should be maintainable by the business as rules, roles, and reports evolve.",
      },
    ],
    fit: [
      "A custom software quote came back too slow or too expensive",
      "Departments are inventing their own trackers that do not talk to each other",
      "You need approvals, audit history, and reporting — not another spreadsheet",
      "IT cannot staff a full custom-dev team for an internal workflow",
      "You want a platform your operations team can live in after launch",
    ],
    process: [
      {
        title: "Choose the fit",
        description: "QuickBase, Smartsheet, or another low-code tool — based on the process, not a vendor pitch.",
      },
      {
        title: "Scope the first useful version",
        description: "We ship the workflow people will use this quarter, not a 40-module wish list.",
      },
      {
        title: "Build around real records",
        description: "Forms, permissions, and reporting are designed together so the app is usable on day one.",
      },
      {
        title: "Iterate",
        description: "Once the team is in the system, we add automations and integrations that actually pay off.",
      },
    ],
    faqs: [
      {
        question: "Is low-code the same as QuickBase?",
        answer:
          "QuickBase is the primary platform we build on. Low-code is the broader approach: ship a maintainable application on the platform that fits, which is often QuickBase and sometimes Smartsheet or another tool.",
      },
      {
        question: "Will we be locked into a platform we cannot change?",
        answer:
          "Every platform is a choice. We pick based on the process, volume, permissions, and who will maintain the app. The goal is a system you can run — not a demo that only a vendor can touch.",
      },
      {
        question: "Can low-code replace a full custom build?",
        answer:
          "For many operational systems, yes. If you need a public consumer product or deep custom engineering, that is a different project. The free workflow review is how we tell the difference.",
      },
      {
        question: "Where are you based?",
        answer:
          "Agrasen Technologies is in Orlando, FL and works with teams nationwide.",
      },
    ],
    related: [
      { href: "/services/quickbase-development", label: "QuickBase Development" },
      { href: "/services/smartsheet-solutions", label: "Smartsheet Solutions" },
    ],
  },
  {
    slug: "smartsheet-solutions",
    name: "Smartsheet Solutions",
    title: "Smartsheet Solutions | Connected Workspaces and Reporting",
    h1: "Smartsheet Solutions Leadership Will Actually Check",
    description:
      "Connected Smartsheet workspaces, automations, and reporting from Agrasen Technologies. Turn shared sheets into an operating system for projects, vendors, and capacity.",
    image: "/services/service-smartsheet.jpg",
    imageAlt: "Smartsheet workspace and reporting",
    intro:
      "Shared sheets become unreliable the moment more than a few people edit them. We turn Smartsheet into a connected workspace: structured intake, automations, dashboards, and the reports leadership actually opens.",
    outcomes: [
      {
        title: "Workspaces that stay structured",
        body: "Projects, vendors, and capacity live in sheets people can update without breaking the model every Friday.",
      },
      {
        title: "Automations instead of reminder email",
        body: "Alerts, update requests, and approval paths so work does not wait on whoever remembered to chase it.",
      },
      {
        title: "Reporting that matches how you run",
        body: "Dashboards for status, risk, and load — not a wall of widgets nobody trusts.",
      },
    ],
    fit: [
      "Project or vendor tracking already lives in Smartsheet but feels fragile",
      "Leadership wants a dashboard and the source sheet cannot support it",
      "Update requests and approvals are still happening in email",
      "Multiple teams edit the same sheet and version control is tribal knowledge",
      "You are choosing between Smartsheet and QuickBase and need a clear recommendation",
    ],
    process: [
      {
        title: "Audit the current sheets",
        description: "What is working, what is duplicated, and what breaks when someone is out.",
      },
      {
        title: "Restructure the workspace",
        description: "Sheets, reports, and dashboards designed as a system — not a pile of tabs.",
      },
      {
        title: "Automate the chase",
        description: "Update requests, alerts, and handoffs so status is collected in the sheet, not in inboxes.",
      },
      {
        title: "Hand off a workspace people can run",
        description: "Permissions, naming, and a simple operating rhythm so it does not decay in 90 days.",
      },
    ],
    faqs: [
      {
        question: "Should we use Smartsheet or QuickBase?",
        answer:
          "Smartsheet is often the right fit for project, vendor, and capacity tracking that still looks like a sheet. QuickBase is usually the better fit when you need a true multi-table application with roles, record-level rules, and heavier operational workflow. We recommend based on the process — not the logo.",
      },
      {
        question: "Can you clean up an existing Smartsheet workspace?",
        answer:
          "Yes. Many engagements start with sheets that grew organically. We restructure, add automations, and give leadership a dashboard they can trust.",
      },
      {
        question: "Do you also build QuickBase apps?",
        answer:
          "Yes. QuickBase is the primary application platform at Agrasen Technologies. Some clients use both: Smartsheet for planning surfaces and QuickBase for the system of record.",
      },
      {
        question: "How do we start?",
        answer:
          "Book a free 30-minute workflow review. Bring the sheet or workspace you want to replace or repair.",
      },
    ],
    related: [
      { href: "/services/quickbase-development", label: "QuickBase Development" },
      { href: "/services/low-code-applications", label: "Low-Code Applications" },
    ],
  },
];

export function getServiceLanding(slug: string): ServiceLanding | undefined {
  return SERVICE_LANDINGS.find((service) => service.slug === slug);
}
