"use client";

import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={`${centered ? "text-center" : ""} ${className}`}
    >
      {label && (
        <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
          {label}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold gradient-text leading-snug pb-1">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg text-text-secondary max-w-2xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}
