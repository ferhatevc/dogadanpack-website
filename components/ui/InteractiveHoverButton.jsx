"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/** 21st.dev Interactive Hover Button — Tailwind + marka token'ları */
export default function InteractiveHoverButton({ children, href = "#", variant = "primary", className = "", ...rest }) {
  const reduce = useReducedMotion();
  const base =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-[0.95rem] font-semibold cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf";
  const variants = {
    primary: "bg-green text-white shadow-cta",
    ghost: "bg-transparent text-green border-2 border-green",
  };
  const fillColor = variant === "primary" ? "bg-leaf" : "bg-green";
  const hoverText = variant === "primary" ? "text-white" : "text-bone";

  return (
    <motion.a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={{ scale: 0.97 }}
      animate="rest"
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        className={`absolute left-6 top-1/2 -mt-1 h-2 w-2 rounded-full ${fillColor}`}
        variants={{ rest: { scale: 0, opacity: 0 }, hover: { scale: 22, opacity: 1 } }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="relative z-10 inline-flex items-center gap-2.5"
        variants={{ rest: { x: 0, opacity: 1 }, hover: { x: 14, opacity: 0 } }}
        transition={{ duration: 0.3 }}
      >
        <span className="h-2 w-2 rounded-full bg-current opacity-80" aria-hidden="true" />
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className={`absolute inset-0 z-10 inline-flex items-center justify-center gap-2.5 ${hoverText}`}
        variants={{ rest: { x: -14, opacity: 0 }, hover: { x: 0, opacity: 1 } }}
        transition={{ duration: 0.3 }}
      >
        {children}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.span>
    </motion.a>
  );
}
