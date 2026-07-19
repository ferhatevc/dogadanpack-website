"use client";
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * E-Katalog — sayfa çeviren katalog deneyimi.
 * Sağ/sol oklar, klavye okları ve sürükleme ile sayfa çevrilir;
 * her çevirmede Web Audio ile sentezlenen kısa "sayfa hışırtısı" çalar.
 */

/* ---- sayfa cevirme sesi (dosyasiz, Web Audio) ---- */
function useFlipSound() {
  const ctxRef = useRef(null);
  const bufRef = useRef(null);
  return useCallback(() => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = ctxRef.current;
        const len = Math.floor(ctx.sampleRate * 0.28);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          const t = i / len;
          // hisirti: beyaz gurultu + hizli yukselen, yavas sonen zarf
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (t < 0.06 ? t / 0.06 : 1);
        }
        bufRef.current = buf;
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const src = ctx.createBufferSource();
      src.buffer = bufRef.current;
      src.playbackRate.value = 0.9 + Math.random() * 0.25;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2100;
      filter.Q.value = 0.7;
      const gain = ctx.createGain();
      gain.gain.value = 0.35;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
    } catch (e) { /* ses desteklenmiyorsa sessiz devam */ }
  }, []);
}

/* ---- katalog icerigi ---- */
const CAT_ICONS = {
  kase: <><path d="M3 10h18c0 5-3.5 9-9 9s-9-4-9-9Z"/><path d="M7 6c1-1.5 3-1.5 4 0s3 1.5 4 0"/></>,
  kova: <><path d="M5 8h14l-1.5 12h-11L5 8Z"/><path d="M7 8a5 5 0 0 1 10 0"/></>,
  tabak: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></>,
  kap: <><rect x="4" y="9" width="16" height="10" rx="2"/><path d="M3 9h18M8 6h8"/></>,
  tabldot: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h18M12 12v7M12 5v7"/></>,
  bardak: <><path d="M7 4h10l-1.2 16H8.2L7 4Z"/><path d="M7.5 9h9"/></>,
  fincan: <><path d="M4 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z"/><path d="M16 9h2a3 3 0 0 1 0 6h-2"/></>,
  servis: <><path d="M7 3v7M5 3v4M9 3v4M7 10v11"/><path d="M15 3c2 2 2.6 6 2 9h-2.5c-.6-3 0-7 .5-9ZM16 12v9"/></>,
  pipet: <path d="M9 21 17 4M15.5 3l3 1.5-1 2.2-3.2-1.4z"/>,
  aksesuar: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M19 5l-2.8 2.8M7.8 16.2 5 19"/></>,
};

const PAGES = [
  { type: "cover" },
  { type: "intro" },
  { type: "cat", icon: "kase", t: "Kaseler", d: "Şeker kamışı bagasse çorba ve salata kaseleri. Sıcak ve yağlı gıdaya dayanıklı, sızdırmaz.", v: "375 · 500 · 750 · 1000 ml", img: "/studio/studio-02-kase-kulesi.webp" },
  { type: "cat", icon: "kova", t: "Kovalar", d: "Büyük hacimli servis ve paket kovaları — toplu yemek ve paket servis için.", v: "4 hacim seçeneği" },
  { type: "cat", icon: "tabak", t: "Tabaklar", d: "Areca palmiye yaprağı ve bagasse tabaklar. Doğal doku, premium sunum.", v: "Yuvarlak · Kare · Kayık" },
  { type: "cat", icon: "kap", t: "Kaplar", d: "Düz ve kapaklı gıda kapları. Kraft kapak seçeneğiyle sızdırmaz paket servis.", v: "Düz · Kapaklı", img: "/studio/studio-04-logo-makro.webp" },
  { type: "cat", icon: "tabldot", t: "Tabldotlar", d: "Bölmeli menü tabakları — catering operasyonlarının vazgeçilmezi.", v: "3 · 4 · 5 bölmeli", img: "/studio/studio-06-urun-dizilimi.webp" },
  { type: "cat", icon: "bardak", t: "Bardaklar", d: "Düz ve fit bardaklar, PLA kaplamalı. Sıcak ve soğuk içecek uyumlu.", v: "Düz · Fit" },
  { type: "cat", icon: "fincan", t: "Fincanlar", d: "Doğal elyaf dokulu çay ve kahve fincanları.", v: "2 boy" },
  { type: "cat", icon: "servis", t: "Servis Setleri", d: "Mısır nişastası bazlı çatal-kaşık-bıçak, peçeteli setler.", v: "Tekli · Set", img: "/studio/studio-01-set-yesil-daire.webp" },
  { type: "cat", icon: "pipet", t: "Kağıt Pipetler", d: "%100 ekolojik kağıt pipetler. Sargılı/sargısız, işletmenize özel logo baskısı.", v: "197 × 6 mm · özel baskı" },
  { type: "cat", icon: "aksesuar", t: "Aksesuarlar", d: "Peçeteler, karıştırıcılar ve tamamlayıcı sunum ürünleri.", v: "Tüm gam" },
  { type: "back" },
];

function Page({ p }) {
  if (p.type === "cover") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-green p-10 text-center">
        <svg width="76" height="76" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="50" fill="#F7F5EE" />
          <g fill="#1F3B13" transform="translate(24,22)"><rect x="4.5" y="16" width="4" height="42" rx="2"/><rect x="0" y="0" width="2.6" height="18" rx="1.3"/><rect x="5.2" y="0" width="2.6" height="18" rx="1.3"/><rect x="10.4" y="0" width="2.6" height="18" rx="1.3"/><path d="M0 14 h13 v5 h-13 z"/></g>
          <g fill="#1F3B13" transform="translate(44,20)"><ellipse cx="6" cy="10" rx="6.5" ry="10"/><rect x="4" y="18" width="4" height="42" rx="2"/></g>
          <g fill="#1F3B13" transform="translate(63,20)"><path d="M2 0 C8 4 9 16 7.5 26 L3.5 26 C2.5 16 0.5 6 2 0 Z"/><rect x="3.5" y="24" width="4" height="38" rx="2"/></g>
        </svg>
        <div>
          <div className="text-2xl font-extrabold tracking-wide text-ongreen">DOĞADAN<span className="font-medium">PACK</span></div>
          <div className="font-display italic text-ongreen-muted">"Yeşil Bir Gelecek İçin"</div>
        </div>
        <div className="mt-4 border-t border-white/20 pt-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-ongreen-muted">Ürün Kataloğu</div>
          <div className="font-display text-4xl text-ongreen">2026</div>
        </div>
      </div>
    );
  }
  if (p.type === "intro") {
    return (
      <div className="flex h-full flex-col justify-center gap-4 bg-cream p-10">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Hakkımızda</span>
        <h3 className="font-display text-3xl font-medium leading-tight text-green">Plastik değildir.<br />Bitki bazlıdır.</h3>
        <p className="text-sm leading-relaxed text-[#4a5342]">
          Mısır nişastası, şeker kamışı bagasse ve areca palmiye yaprağından üretilen tek kullanımlık
          gıda servis ürünleri. Tüm ürünlerimiz gıda ile temasa uygundur ve endüstriyel kompostta
          180 günde doğaya döner.
        </p>
        <div className="mt-2 flex gap-6">
          <div><b className="block font-display text-xl text-green">10</b><span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6350]">Kategori</span></div>
          <div><b className="block font-display text-xl text-green">%100</b><span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6350]">Bitki Bazlı</span></div>
          <div><b className="block font-display text-xl text-green">180</b><span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6350]">Gün Kompost</span></div>
        </div>
      </div>
    );
  }
  if (p.type === "back") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-fiber p-10 text-center">
        <h3 className="font-display text-2xl font-medium text-green">Teklif almak için</h3>
        <p className="text-sm text-[#4a5342]">Sipariş hacminizi yazın, aynı gün dönelim.</p>
        <a href="mailto:info@dogadanpack.com" className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-white shadow-cta">info@dogadanpack.com</a>
        <span className="text-xs text-[#5a6350]">Sivas, Türkiye · WhatsApp Hattı</span>
        <div className="mt-3 font-display text-sm italic text-green-soft">Bitkiden gelir, doğaya döner.</div>
      </div>
    );
  }
  // kategori sayfasi
  return (
    <div className="flex h-full flex-col bg-cream">
      {p.img ? (
        <img src={p.img} alt={p.t} className="h-[46%] w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-[46%] items-center justify-center bg-fiber">
          <div className="flex h-24 w-24 items-center justify-center bg-cream" style={{ borderRadius: "24px 30px 22px 32px" }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#1F3B13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{CAT_ICONS[p.icon]}</svg>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center gap-2.5 p-8">
        <h3 className="font-display text-[1.6rem] font-medium text-green">{p.t}</h3>
        <p className="text-sm leading-relaxed text-[#4a5342]">{p.d}</p>
        <span className="text-xs font-bold uppercase tracking-wider text-leaf">{p.v}</span>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [[page, dir], setPage] = useState([0, 0]);
  const reduce = useReducedMotion();
  const playFlip = useFlipSound();

  const go = useCallback((d) => {
    setPage(([p]) => {
      const next = p + d;
      if (next < 0 || next >= PAGES.length) return [p, d];
      playFlip();
      return [next, d];
    });
  }, [playFlip]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const variants = useMemo(() => ({
    enter: (d) => reduce
      ? { opacity: 0 }
      : { rotateY: d > 0 ? 75 : -75, opacity: 0.3, transformOrigin: d > 0 ? "left center" : "right center" },
    center: { rotateY: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => reduce
      ? { opacity: 0 }
      : { rotateY: d > 0 ? -75 : 75, opacity: 0.2, transformOrigin: d > 0 ? "right center" : "left center", transition: { duration: 0.45, ease: [0.55, 0, 0.55, 0.2] } },
  }), [reduce]);

  return (
    <section id="katalog" className="rounded-t-[64px] bg-fiber px-6 py-24 max-md:rounded-t-[40px]">
      <div className="mx-auto max-w-wrap">
        <motion.div
          className="mb-12 max-w-2xl"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
        >
          <motion.span variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            E-Katalog
          </motion.span>
          <motion.h2 variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }} className="mb-3.5 font-display text-h2 font-medium text-green">
            Kataloğu çevirin, ürünleri keşfedin
          </motion.h2>
          <motion.p variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }} className="text-[#4a5342]">
            Okları kullanın veya sayfayı sürükleyin — klavye okları da çalışır.
          </motion.p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* sol ok */}
          <button
            onClick={() => go(-1)} disabled={page === 0} aria-label="Önceki sayfa"
            className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center rounded-full border-2 border-green bg-cream text-green transition enabled:hover:bg-green enabled:hover:text-white disabled:cursor-default disabled:opacity-30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* kitap */}
          <div className="relative w-full max-w-md" style={{ perspective: 1800 }}>
            <div className="relative aspect-[3/4] overflow-hidden shadow-[0_30px_70px_rgba(31,59,19,.18)]" style={{ borderRadius: "18px 22px 16px 24px", transformStyle: "preserve-3d" }}>
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={page} custom={dir} variants={variants}
                  initial="enter" animate="center" exit="exit"
                  drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
                  onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Page p={PAGES[page]} />
                  {/* cilt golgesi */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* sayfa sayaci */}
            <div className="absolute -top-4 left-4 rounded-full border border-line bg-cream px-3.5 py-1 text-xs font-bold text-green shadow-sm">
              {page + 1} / {PAGES.length}
            </div>
          </div>

          {/* sag ok */}
          <button
            onClick={() => go(1)} disabled={page === PAGES.length - 1} aria-label="Sonraki sayfa"
            className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center rounded-full border-2 border-green bg-cream text-green transition enabled:hover:bg-green enabled:hover:text-white disabled:cursor-default disabled:opacity-30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
