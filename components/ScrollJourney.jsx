"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";

/**
 * "Yaprağın Yolculuğu" v3 — gerçek stüdyo çekimleriyle scroll anlatısı.
 * 400vh sticky sahne; kaydırdıkça 4 sahne, her biri gerçek DoğadanPack karesi:
 *  1) Bitkiden Gelir   — süzülen ürünler + yaprak (studio-05)
 *  2) Doğal Üretim     — bagasse doku, kabartma logo makrosu (studio-04)
 *  3) Sofranıza Ulaşır — elde dumanı tüten kase (studio-03)
 *  4) Doğaya Döner     — toprak tonuna kararan final + düşen yapraklar
 */

const STAGES = [
  {
    n: "1", t: "Bitkiden Gelir",
    d: "Mısır nişastası, şeker kamışı ve palmiye yaprağı — hammaddemiz doğanın kendisi.",
    img: "/studio/studio-01-set-yesil-daire.webp",
    alt: "DoğadanPack tam servis seti — kraft çanta, tabldot, kase ve ahşap çatal, yeşil daire fonda",
  },
  {
    n: "2", t: "Doğal Üretim",
    d: "Elyaf, kimyasal katkı olmadan yüksek basınç ve ısıyla şekillenir. Doku, doğanın imzasıdır.",
    img: "/studio/studio-04-logo-makro.webp",
    alt: "DOĞADANPACK kabartma logolu bagasse kapak, makro detay",
  },
  {
    n: "3", t: "Sofranıza Ulaşır",
    d: "Sağlam, sızdırmaz, premium sunum — plastik değildir, bitki bazlıdır.",
    img: "/studio/studio-03-sicak-kase.webp",
    alt: "Elde tutulan DoğadanPack kasesinde dumanı tüten sıcak yemek",
  },
  {
    n: "4", t: "Doğaya Döner",
    d: "Kullanım sonrası 180 günde komposta karışır. Geriye mikroplastik değil, toprak kalır.",
    img: null, // toprak finali: goruntu yerine ton + dusen yapraklar
  },
];

const RANGES = [
  [0.0, 0.06, 0.2, 0.26],
  [0.26, 0.32, 0.46, 0.52],
  [0.52, 0.58, 0.7, 0.76],
  [0.78, 0.84, 0.96, 1.0],
];

function FallingLeaf({ left, delay, size, duration }) {
  return (
    <motion.svg
      viewBox="0 0 52 34" width={size} height={size * 0.65}
      className="absolute -top-16" style={{ left }}
      initial={{ y: -80, rotate: 0, opacity: 0 }}
      animate={{ y: "110vh", rotate: 360, opacity: [0, 1, 1, 0.6] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    >
      <path d="M0 22 C10 4 34 -2 52 1 C50 18 36 32 16 32 C10 32 4 28 0 22 Z" fill="#4C8A2E" />
      <path d="M4 24 C18 16 34 9 48 4" stroke="#DFF0D0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function ScrollJourney() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const imgOpacities = RANGES.map((r) => useTransform(scrollYProgress, r, [0, 1, 1, 0]));
  const imgScales = RANGES.map((r) => useTransform(scrollYProgress, r, [1.1, 1.02, 1.02, 0.98]));
  const capYs = RANGES.map((r) => useTransform(scrollYProgress, r, [28, 0, 0, -28]));
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // final: zemin toprak tonuna karar
  const soilOpacity = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);

  if (reduce) {
    // hareket azaltilmis: statik 4 kare
    return (
      <section className="bg-bone px-6 py-24" aria-label="Yaprağın Yolculuğu — üretimden komposta">
        <div className="mx-auto grid max-w-wrap gap-8 md:grid-cols-2">
          {STAGES.map((s) => (
            <div key={s.n} className="overflow-hidden rounded-card border border-line bg-cream">
              {s.img && <img src={s.img} alt={s.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
              <div className="p-6">
                <span className="mb-2 block font-display text-sm italic text-leaf">{s.n} / 4</span>
                <h3 className="mb-2 font-display text-xl font-medium text-green">{s.t}</h3>
                <p className="text-sm text-[#4a5342]">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-bone" style={{ height: "400vh" }} aria-label="Yaprağın Yolculuğu — üretimden komposta">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* sahne gorselleri: tam ekran crossfade + nefes alan olcek */}
        {STAGES.map((s, i) =>
          s.img ? (
            <motion.div key={s.n} className="absolute inset-0" style={{ opacity: imgOpacities[i] }}>
              <motion.img
                src={s.img} alt={s.alt}
                className="h-full w-full object-cover"
                style={{ scale: imgScales[i] }}
              />
              {/* okunabilirlik icin sol tarafta bone gradyani */}
              <div className="absolute inset-0 bg-gradient-to-r from-bone/95 via-bone/40 to-transparent max-md:bg-gradient-to-t max-md:from-bone/95 max-md:via-bone/30" />
            </motion.div>
          ) : (
            /* final: toprak tonu + dusen yapraklar */
            <motion.div key={s.n} className="absolute inset-0" style={{ opacity: imgOpacities[i] }}>
              <div className="absolute inset-0 bg-gradient-to-b from-fiber via-[#C9B896] to-[#8A7458]" />
              <motion.div className="absolute inset-0" style={{ opacity: soilOpacity }}>
                <FallingLeaf left="12%" delay={0} size={44} duration={7} />
                <FallingLeaf left="28%" delay={2.2} size={30} duration={9} />
                <FallingLeaf left="55%" delay={1} size={38} duration={8} />
                <FallingLeaf left="72%" delay={3.4} size={26} duration={10} />
                <FallingLeaf left="86%" delay={0.6} size={34} duration={7.5} />
              </motion.div>
            </motion.div>
          )
        )}

        {/* basliklar: asimetrik krem kartlar */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-wrap px-6">
            <div className="relative h-64 max-w-md max-md:mt-auto">
              {STAGES.map((s, i) => (
                <motion.div key={s.n} style={{ opacity: imgOpacities[i], y: capYs[i] }} className="absolute inset-x-0">
                  <div className="border border-line bg-cream/90 p-7 shadow-[0_18px_40px_rgba(31,59,19,.10)] backdrop-blur-sm" style={{ borderRadius: "26px 30px 24px 32px" }}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center bg-green font-display text-sm italic text-ongreen" style={{ borderRadius: "12px 15px 11px 16px" }}>{s.n}</span>
                      <span className="flex gap-1.5" aria-hidden="true">
                        {STAGES.map((_, j) => (
                          <span key={j} className={`h-1.5 rounded-full transition-all ${j === i ? "w-6 bg-leaf" : "w-1.5 bg-line"}`} />
                        ))}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-[1.7rem] font-medium leading-tight text-green">{s.t}</h3>
                    <p className="text-sm leading-relaxed text-[#4a5342]">{s.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ilerleme cubugu */}
        <div className="absolute bottom-8 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-line/80">
          <motion.div className="h-full origin-left bg-leaf" style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  );
}
