"use client";

import { useEffect, useRef } from "react";

import { trackFormSubmit } from "@/lib/analytics";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (opts: {
          portalId: string;
          formId: string;
          region: string;
          target: string;
          css?: string;
          onFormSubmitted?: () => void;
        }) => void;
      };
    };
  }
}

const PORTAL_ID = "7145941";
const DEFAULT_FORM_ID = "6eb36758-b2d9-4bb6-b6c1-dd496fa9fbd7";
const REGION = "na1";
const SCRIPT_SRC = "//js.hsforms.net/forms/embed/v2.js";

export default function HubSpotForm({
  id = "hs-contact",
  formId = DEFAULT_FORM_ID,
  eventName = "generate_lead",
  source = "website",
}: {
  id?: string;
  formId?: string;
  eventName?: string;
  source?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (createdRef.current) return;

    const createForm = () => {
      if (!window.hbspt || !containerRef.current) return;
      createdRef.current = true;
      window.hbspt.forms.create({
        portalId: PORTAL_ID,
        formId,
        region: REGION,
        target: `#${id}`,
        onFormSubmitted: () => {
          trackFormSubmit({ eventName, formId, source });
        },
      });
    };

    if (window.hbspt) {
      createForm();
      return;
    }

    const existing = document.querySelector(
      `script[src="${SCRIPT_SRC}"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.hbspt) {
        createForm();
      } else {
        existing.addEventListener("load", createForm);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.charset = "utf-8";
    script.async = true;
    script.onload = createForm;
    document.head.appendChild(script);
  }, [id, formId, eventName, source]);

  return (
    <div
      id={id}
      ref={containerRef}
      className="hubspot-form-wrapper"
    />
  );
}
