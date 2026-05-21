"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HubSpotForm from "./HubSpotForm";

interface HubSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HubSpotModal({ isOpen, onClose }: HubSpotModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-bg-secondary border border-border p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Get a Quote
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Tell us about your project and we&apos;ll get back to you
                  within 24 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 ml-4 w-9 h-9 rounded-lg bg-bg-card hover:bg-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <HubSpotForm id="hs-modal-form" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
