"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/** 21st.dev "Testimonials with Marquee" — Tailwind + marka token'ları */
function Card({ quote, name, role }) {
  return (
    <figure className="flex w-[340px] flex-none flex-col gap-6 rounded-card border border-line bg-cream p-8 max-sm:w-[280px]">
      <blockquote className="font-display text-[1.02rem] italic leading-normal text-ink">“{quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-organic bg-fiber text-lg font-extrabold text-green" aria-hidden="true">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-green">{name}</div>
          <div className="text-xs text-[#5a6350]">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsMarquee({ items, speed = 40 }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="mt-2 grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => <Card key={t.name} {...t} />)}
      </div>
    );
  }

  const row = [...items, ...items];
  return (
    <div className="relative mt-2" aria-label="Müşteri referansları">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bone to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bone to-transparent" aria-hidden="true" />
      <motion.div
        className="flex w-max gap-6 py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {row.map((t, i) => <Card key={`${t.name}-${i}`} {...t} />)}
      </motion.div>
    </div>
  );
}
