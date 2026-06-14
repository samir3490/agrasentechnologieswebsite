import type { Metadata } from "next";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import SectionHeading from "@/components/SectionHeading";
import HubSpotForm from "@/components/HubSpotForm";

export const metadata: Metadata = {
  title: "Careers | Agrasen Technologies",
  description:
    "Join Agrasen Technologies. Explore career opportunities in IT consulting, application development, QuickBase, Smartsheet, and low-code solutions. Apply today.",
};

const CAREERS_FORM_ID = "d4953ed8-9916-4643-8eff-788ee1708b92";

const whyJoin = [
  {
    title: "Meaningful Work",
    description:
      "Help businesses solve real problems with technology — from low-code platforms to full-stack solutions that drive measurable results.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "Growth & Learning",
    description:
      "Work with QuickBase, Smartsheet, modern web stacks, and emerging AI tools while learning from experienced consultants and developers.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Flexible Environment",
    description:
      "We support remote and hybrid collaboration with clients across industries, giving you variety in projects and flexibility in how you work.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    title: "Collaborative Culture",
    description:
      "Join a team that values integrity, quality, and client success — where your ideas are heard and your contributions make a difference.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

const openRoles = [
  {
    title: "IT Consultant",
    type: "Full-time / Contract",
    description:
      "Bridge technical and business teams, gather requirements, and deliver successful IT projects on QuickBase, Smartsheet, and enterprise platforms.",
  },
  {
    title: "Low-Code Application Developer",
    type: "Full-time / Contract",
    description:
      "Design and build custom business applications on QuickBase and Smartsheet. Experience with workflows, integrations, and data modeling preferred.",
  },
  {
    title: "Web Developer / UI Designer",
    type: "Full-time / Part-time",
    description:
      "Create modern, responsive websites and user interfaces. Proficiency in HTML, CSS, JavaScript, and frameworks such as React or Next.js is a plus.",
  },
  {
    title: "Business Analyst",
    type: "Contract",
    description:
      "Analyze client processes, document requirements, and support project delivery across consulting engagements.",
  },
];

const applicationSteps = [
  {
    step: "1",
    title: "Submit Your Application",
    description:
      "Complete the form below with your resume, contact details, and the role you are interested in.",
  },
  {
    step: "2",
    title: "Initial Review",
    description:
      "Our team reviews applications and reaches out to qualified candidates within 5–7 business days.",
  },
  {
    step: "3",
    title: "Interview",
    description:
      "Selected candidates are invited for a phone or video interview to discuss experience, skills, and fit.",
  },
  {
    step: "4",
    title: "Offer & Onboarding",
    description:
      "Successful candidates receive an offer and are onboarded with the tools, access, and project context needed to succeed.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <section className="relative overflow-hidden py-28 md:py-36">
        <ParticleField />
        <GradientOrb
          className="-top-32 -right-32"
          size={420}
          color1="#D4A017"
          color2="#B8860B"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <nav className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">Careers</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Join Our Team
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Build your career with Agrasen Technologies — where innovation,
              quality, and client success come first.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Why Agrasen"
            title="Why Work With Us"
            description="For over 15 years, we've helped businesses transform through technology. Our team thrives on solving complex problems with practical, high-quality solutions."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJoin.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 h-full hover:border-accent/40 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Open Roles"
            title="Current Opportunities"
            description="We are always looking for talented professionals. If you don't see a perfect match, submit a general application — we review all qualified candidates."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {openRoles.map((role, i) => (
              <ScrollReveal key={role.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full border border-border hover:border-accent/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {role.title}
                    </h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {role.type}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <p className="mt-10 text-center text-text-secondary text-sm">
              Agrasen Technologies is an equal opportunity employer. We welcome
              applications from all qualified candidates regardless of race,
              gender, age, religion, disability, or background.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="How It Works"
            title="Application Process"
            description="Our hiring process is straightforward and respectful of your time."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {applicationSteps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-accent to-accent-secondary text-white font-bold text-lg flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <SectionHeading
                label="Apply Now"
                title="Submit Your Application"
                description="Ready to join Agrasen Technologies? Fill out the form and tell us about yourself. Please include your resume and the position you are applying for."
                centered={false}
              />

              <ScrollReveal delay={0.15}>
                <div className="mt-8 space-y-4 text-sm text-text-secondary">
                  <p>
                    <strong className="text-text-primary">What to include:</strong>{" "}
                    Resume/CV, cover letter (optional), LinkedIn profile, and
                    portfolio or work samples if applicable.
                  </p>
                  <p>
                    <strong className="text-text-primary">Location:</strong>{" "}
                    Orlando, FL (remote and hybrid options available for many roles)
                  </p>
                  <p>
                    <strong className="text-text-primary">Questions?</strong>{" "}
                    Visit our{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                      contact page
                    </Link>{" "}
                    for general inquiries.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1} direction="right">
              <div className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6">
                  Job Application Form
                </h3>
                <HubSpotForm
                  id="hs-careers-form"
                  formId={CAREERS_FORM_ID}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
