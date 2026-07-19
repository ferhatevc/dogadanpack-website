"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/** 21st.dev "FAQ Accordion" — Tailwind + marka token'ları, erişilebilir */
export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`overflow-hidden rounded-card border bg-cream transition-colors ${isOpen ? "border-moss" : "border-line"}`}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-leaf"
            >
              <span className={`text-[0.95rem] font-semibold transition-colors ${isOpen ? "text-green" : "text-ink"}`}>{item.q}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-fiber"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F3B13" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  initial={reduce ? { height: "auto" } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed text-[#4a5342]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
