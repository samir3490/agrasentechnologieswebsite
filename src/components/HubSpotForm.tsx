"use client";

import { useEffect, useRef } from "react";

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
        }) => void;
      };
    };
  }
}

const PORTAL_ID = "7145941";
const FORM_ID = "6eb36758-b2d9-4bb6-b6c1-dd496fa9fbd7";
const REGION = "na1";
const SCRIPT_SRC = "//js.hsforms.net/forms/embed/v2.js";

export default function HubSpotForm({ id = "hs-contact" }: { id?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (createdRef.current) return;

    const createForm = () => {
      if (!window.hbspt || !containerRef.current) return;
      createdRef.current = true;
      window.hbspt.forms.create({
        portalId: PORTAL_ID,
        formId: FORM_ID,
        region: REGION,
        target: `#${id}`,
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
      existing.addEventListener("load", createForm);
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.charset = "utf-8";
    script.async = true;
    script.onload = createForm;
    document.head.appendChild(script);
  }, [id]);

  return (
    <div
      id={id}
      ref={containerRef}
      className="hubspot-form-wrapper"
    />
  );
}
