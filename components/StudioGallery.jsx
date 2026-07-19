"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * "Stüdyodan" — Higgsfield sinematik ürün çekimleri galerisi.
 * Asimetrik grid + tıklamayla lightbox. Görseller şimdilik Higgsfield CDN'inden;
 * canlıya çıkmadan önce public/studio/ altına indirilmeli (bkz. README).
 */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3EGFPhR8FNajJSJ8hPymRN2Qe4U";

const SHOTS = [
  { src: `${CDN}/hf_20260715_085202_d1428113-9acd-42c0-aa0d-283c2739e41a.png`, alt: "DoğadanPack kraft çanta ve tabldot seti — stüdyo çekimi", big: true },
  { src: `${CDN}/hf_20260715_085202_34a2f398-d1db-43aa-9f20-08981a83cf2c.png`, alt: "Havada süzülen bagasse kaplar ve yaprak" },
  { src: `${CDN}/hf_20260715_085011_dd10c0b1-2252-488d-95fe-b066f9ea4a13.png`, alt: "DoğadanPack kabartmalı kapak — makro detay" },
  { src: `${CDN}/hf_20260714_223322_7d931ce8-7838-4cc3-bc26-5297bbf618fe.png`, alt: "Catering sofrasında DoğadanPack sunumu", big: true },
  { src: `${CDN}/hf_20260714_165156_a038a7e4-d023-4310-9a9b-54ee4ccabd4f.png`, alt: "Kraft çantada ürünler ve servis seti" },
  { src: `${CDN}/hf_20260714_164651_135c7ad1-5606-45bb-9d89-a9d6f52e38b2.png`, alt: "Elde bagasse kase — sıcak servis" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function StudioGallery() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <section id="studyo" className="px-6 py-24">
      <div className="mx-auto max-w-wrap">
        <motion.div
          className="mb-12 max-w-2xl"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
        >
          <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Stüdyodan
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-3.5 font-display text-h2 font-medium text-green">
            Ürünlerimiz kamera karşısında
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#4a5342]">
            Sinematik stüdyo çekimleriyle bagasse dokusunu ve doğal sunumu yakından görün.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        >
          {SHOTS.map((s, i) => (
            <motion.button
              key={s.src}
              variants={fadeUp}
              onClick={() => setOpen(i)}
              whileHover={reduce ? {} : { y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={`group relative cursor-pointer overflow-hidden rounded-card border border-line bg-fiber focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf ${s.big ? "col-span-2 row-span-2" : ""}`}
              aria-label={`${s.alt} — büyüt`}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: "1/1" }}
              />
              <span className="pointer-events-none absolute inset-0 bg-green/0 transition-colors duration-300 group-hover:bg-green/10" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            role="dialog" aria-modal="true" aria-label={SHOTS[open].alt}
          >
            <motion.img
              src={SHOTS[open].src}
              alt={SHOTS[open].alt}
              className="max-h-[85vh] max-w-full rounded-card shadow-2xl"
              initial={reduce ? {} : { scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce ? {} : { scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={close}
              aria-label="Kapat"
              className="absolute right-6 top-6 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-cream text-green"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
