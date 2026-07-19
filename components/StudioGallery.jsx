"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * "Stüdyodan" — Higgsfield sinematik ürün çekimleri galerisi.
 * Asimetrik grid + tıklamayla lightbox. Görseller kalıcı: public/studio/ altında (webp).
 */

const SHOTS = [
  { src: "/studio/studio-01-set-yesil-daire.webp", alt: "DoğadanPack tam servis seti — kraft çanta, tabldot, kase, tabak ve ahşap çatal, yeşil daire fonda", span: "big" },
  { src: "/studio/studio-02-kase-kulesi.webp", alt: "Kapaklı bagasse kaseler üst üste, yanında bölmeli tabldotlar" },
  { src: "/studio/studio-03-sicak-kase.webp", alt: "Dumanı tüten bulgur kasesi — elde DoğadanPack bagasse kase" },
  { src: "/studio/studio-04-logo-makro.webp", alt: "DOĞADANPACK kabartma logo — bagasse kapak makro detay" },
  { src: "/studio/studio-05-suzulen-urunler.webp", alt: "Havada süzülen kase, tabak ve tabldot — doğal elyaf ve yaprak" },
  { src: "/studio/studio-06-urun-dizilimi.webp", alt: "Mermer bloklarda ürün dizilimi — kapaklar, çanta, kase ve servis seti", span: "tall" },
  { src: "/studio/studio-07-paket-servis.webp", alt: "Kraft DoğadanPack çantasına paket servis hazırlanıyor", span: "tall" },
  { src: "/studio/studio-08-catering-sofrasi.webp", alt: "Catering sofrasında DoğadanPack tabak ve tabldotlarla sunum", span: "big" },
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
          className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] md:grid-cols-4 md:gap-6"
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
              className={`group relative cursor-pointer overflow-hidden rounded-card border border-line bg-fiber focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf ${s.span === "big" ? "col-span-2 row-span-2" : s.span === "tall" ? "row-span-2" : ""}`}
              aria-label={`${s.alt} — büyüt`}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={s.span ? {} : { aspectRatio: "1/1" }}
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
