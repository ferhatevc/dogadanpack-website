"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import AnimatedTextCycle from "./ui/AnimatedTextCycle.jsx";
import InteractiveHoverButton from "./ui/InteractiveHoverButton.jsx";
import CountUp from "./ui/CountUp.jsx";

/* ---------- Logo: O icinde catal-kasik-bicak ---------- */
export function LogoO({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#1F3B13" />
      <g fill="#F7F5EE" transform="translate(24,22)">
        <rect x="4.5" y="16" width="4" height="42" rx="2" />
        <rect x="0" y="0" width="2.6" height="18" rx="1.3" />
        <rect x="5.2" y="0" width="2.6" height="18" rx="1.3" />
        <rect x="10.4" y="0" width="2.6" height="18" rx="1.3" />
        <path d="M0 14 h13 v5 h-13 z" />
      </g>
      <g fill="#F7F5EE" transform="translate(44,20)">
        <ellipse cx="6" cy="10" rx="6.5" ry="10" />
        <rect x="4" y="18" width="4" height="42" rx="2" />
      </g>
      <g fill="#F7F5EE" transform="translate(63,20)">
        <path d="M2 0 C8 4 9 16 7.5 26 L3.5 26 C2.5 16 0.5 6 2 0 Z" />
        <rect x="3.5" y="24" width="4" height="38" rx="2" />
      </g>
    </svg>
  );
}

const NAV = [
  ["#urunler", "Ürünlerimiz"],
  ["#neden", "Neden Doğadan?"],
  ["#referanslar", "Referanslar"],
  ["#fiyat", "Fiyatlandırma"],
  ["#sss", "SSS"],
];

/* ================= STICKY NAVBAR ================= */
export function Navbar() {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(31,59,19,0)", "0 8px 30px rgba(31,59,19,.08)"]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md"
      style={{ boxShadow: shadow }}
      initial={reduce ? false : { y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-wrap items-center justify-between px-6 py-3.5">
        <a href="#" className="flex items-center gap-3" aria-label="DoğadanPack ana sayfa">
          <LogoO />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-lg font-extrabold tracking-wide text-green">DOĞADAN</span>
            <span className="text-lg font-extrabold tracking-[0.35em] text-green">PACK</span>
          </span>
        </a>
        <nav className="hidden gap-8 text-sm font-semibold lg:flex" aria-label="Ana menü">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="group relative py-1 text-ink transition-colors hover:text-green">
              {label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-leaf transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <InteractiveHoverButton href="#iletisim" variant="primary" className="!px-5 !py-2.5 !text-sm max-sm:hidden">
            Teklif Al
          </InteractiveHoverButton>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-fiber focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-leaf lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F3B13" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mobil menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobil menü"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-fiber hover:text-green"
                >
                  {label}
                </a>
              ))}
              <a
                href="#iletisim"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-green px-6 py-3 text-sm font-semibold text-white shadow-cta"
              >
                Teklif Al
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ================= HERO ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-20">
      {/* organik bloblar */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-40 -top-44 h-[560px] w-[560px] bg-fiber"
        style={{ borderRadius: "47% 53% 58% 42%/45% 48% 52% 55%" }}
        animate={reduce ? {} : { rotate: [0, 6, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-56 -left-36 h-[460px] w-[460px] bg-moss/15"
        style={{ borderRadius: "55% 45% 42% 58%/52% 55% 45% 48%" }}
        animate={reduce ? {} : { rotate: [0, -8, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto grid max-w-wrap items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span
            variants={fadeUp}
            className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf"
          >
            Doğal &amp; Organik Gıda Ambalajları
          </motion.span>
          <motion.h1 variants={fadeUp} className="mb-5 font-display text-display font-medium text-green">
            <AnimatedTextCycle
              words={["Kaseler", "Tabaklar", "Bardaklar", "Pipetler", "Servis setleri"]}
              interval={2600}
              className="italic text-leaf"
            />{" "}
            bitkiden gelir,
            <br />
            <em className="italic text-leaf">doğaya döner.</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="mb-8 max-w-lg text-lead text-[#3d4636]">
            Mısır nişastası, şeker kamışı ve palmiye yaprağından üretilen; doğada tamamen çözünen
            tek kullanımlık servis ürünleri. Plastik değildir — bitki bazlıdır.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <InteractiveHoverButton href="#urunler" variant="primary">Ürünleri Keşfet</InteractiveHoverButton>
            <InteractiveHoverButton href="#fiyat" variant="ghost">Fiyatları Gör</InteractiveHoverButton>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-12 flex flex-wrap gap-10">
            {[
              [<CountUp key="a" to={100} prefix="%" duration={1.4} />, "Kompostlanabilir"],
              [<CountUp key="b" to={10} suffix="+" duration={1.4} />, "Ürün Kategorisi"],
              ["0", "Plastik"],
            ].map(([num, label]) => (
              <motion.div key={label} variants={fadeUp}>
                <b className="block font-display text-3xl font-medium text-green">{num}</b>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5a6350]">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* logo sahnesi */}
        <motion.div
          className="flex justify-center"
          initial={reduce ? false : { opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-full max-w-md rounded-[36px] border border-line bg-cream p-10 shadow-[0_24px_60px_rgba(31,59,19,.10)] md:p-12"
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <svg viewBox="0 0 400 300" width="100%" role="img" aria-label="DoğadanPack logosu — Yeşil Bir Gelecek İçin">
              <g transform="translate(118,18) scale(0.9)">
                <path d="M0 22 C10 4 34 -2 52 1 C50 18 36 32 16 32 C10 32 4 28 0 22 Z" fill="#4C8A2E" />
                <path d="M4 24 C18 16 34 9 48 4" stroke="#DFF0D0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              </g>
              <text x="200" y="118" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="56" fill="#1F3B13" letterSpacing="2">
                D<tspan dx="62">ĞADAN</tspan>
              </text>
              <g transform="translate(74,70) scale(0.56)">
                <circle cx="50" cy="50" r="50" fill="#1F3B13" />
                <g fill="#F7F5EE" transform="translate(24,22)">
                  <rect x="4.5" y="16" width="4" height="42" rx="2" />
                  <rect x="0" y="0" width="2.6" height="18" rx="1.3" />
                  <rect x="5.2" y="0" width="2.6" height="18" rx="1.3" />
                  <rect x="10.4" y="0" width="2.6" height="18" rx="1.3" />
                  <path d="M0 14 h13 v5 h-13 z" />
                </g>
                <g fill="#F7F5EE" transform="translate(44,20)">
                  <ellipse cx="6" cy="10" rx="6.5" ry="10" />
                  <rect x="4" y="18" width="4" height="42" rx="2" />
                </g>
                <g fill="#F7F5EE" transform="translate(63,20)">
                  <path d="M2 0 C8 4 9 16 7.5 26 L3.5 26 C2.5 16 0.5 6 2 0 Z" />
                  <rect x="3.5" y="24" width="4" height="38" rx="2" />
                </g>
              </g>
              <text x="200" y="192" textAnchor="middle" fontFamily="Montserrat" fontWeight="800" fontSize="62" fill="#1F3B13" letterSpacing="14">PACK</text>
              <text x="200" y="248" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="24" fill="#2E5220">“Yeşil Bir Gelecek İçin”</text>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= BOLUM 2: OZELLIKLER ================= */
const viewport = { once: true, amount: 0.25 };
const staggerV = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const FEATURES = [
  {
    title: "Sağlam & Kullanışlı",
    desc: "Bagasse ve palmiye yaprağı ürünler sıcak, soğuk ve yağlı gıdalara dayanır — bükülmez, sızdırmaz, mikrodalgaya girer.",
    icon: (
      <>
        <path d="M20 7 9 18l-5-5" />
        <path d="M22 12A10 10 0 1 1 12 2" />
      </>
    ),
  },
  {
    title: "180 Günde Doğaya Döner",
    desc: "Mısır nişastası ve doğal elyaf hammadde, endüstriyel kompostta 180 günde tamamen çözünür. Geriye mikroplastik değil, toprak kalır.",
    icon: <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-10 0 3 1 5 3 7s3 4 3 6a7 7 0 0 1-7 4Z" />,
  },
  {
    title: "Kesintisiz Toptan Tedarik",
    desc: "Catering firmaları ve zincir işletmeler için stoklu çalışır, siparişinizi zamanında sevk ederiz. Özel baskı seçeneği mevcuttur.",
    icon: (
      <>
        <rect x="2" y="7" width="14" height="10" rx="2" />
        <path d="M16 10h3l3 3v4h-6M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
  },
];

export function Features() {
  const reduce = useReducedMotion();
  return (
    <section id="neden" className="px-6 py-24">
      <div className="mx-auto max-w-wrap">
        <motion.div className="mb-12 max-w-2xl" variants={staggerV} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Neden DoğadanPack?
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-3.5 font-display text-h2 font-medium text-green">
            Plastik değildir. Bitki bazlıdır.
          </motion.h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerV}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {FEATURES.map((f) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              whileHover={reduce ? {} : { y: -8, boxShadow: "0 18px 40px rgba(31,59,19,.12)" }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="cursor-default rounded-card border border-line bg-cream p-8 transition-colors hover:border-moss"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-organic bg-fiber">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3B13" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-green">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#5a6350]">{f.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ================= BOLUM 3: SOCIAL PROOF ================= */
import TestimonialsMarquee from "./ui/TestimonialsMarquee.jsx";

const TESTIMONIALS = [
  { quote: "Bagasse kaseler sıcak çorbada bile formunu koruyor. Müşterilerimiz doğal dokuya bayıldı.", name: "Örnek Catering", role: "Toplu Yemek Hizmeti" },
  { quote: "Kağıt pipetlerin özel baskısı marka görünürlüğümüzü ciddi artırdı. Teslimat hep zamanında.", name: "Örnek Kafe Zinciri", role: "Kahve & İçecek" },
  { quote: "Palmiye yaprağı tabaklar davetlerimizin yıldızı oldu. Plastik hissi yok, premium sunum var.", name: "Örnek Organizasyon", role: "Davet & Etkinlik" },
  { quote: "Tabldot geçişimizde stok ve sevkiyat sorunsuz ilerledi. Gerçek bir tedarik ortağı.", name: "Örnek Restoran Grubu", role: "Zincir İşletme" },
  { quote: "Doğada çözünür ürünlere geçmek sürdürülebilirlik raporumuzun en somut adımı oldu.", name: "Örnek Otel", role: "Konaklama" },
];

const SECTORS = ["Catering", "Restoran Zincirleri", "Kafeler", "Oteller", "Organizasyon Firmaları", "Toptancılar"];

export function SocialProof() {
  return (
    <section id="referanslar" className="overflow-hidden py-24">
      <div className="mx-auto max-w-wrap px-6">
        <motion.div className="mb-12 max-w-2xl" variants={staggerV} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Referanslar
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display text-h2 font-medium text-green">
            İşletmeler DoğadanPack ile büyüyor
          </motion.h2>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport} transition={{ duration: 0.7 }}>
        <TestimonialsMarquee items={TESTIMONIALS} speed={40} />
      </motion.div>

      {/* sektor seridi */}
      <motion.div
        className="mx-auto mt-16 flex max-w-wrap flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6"
        variants={staggerV}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.span variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a6350]">
          Hizmet verdiğimiz sektörler:
        </motion.span>
        {SECTORS.map((s) => (
          <motion.span key={s} variants={fadeUp} className="text-sm font-semibold text-moss">
            {s}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}

/* ================= BOLUM 4: FIYATLANDIRMA (teklif paketleri) ================= */
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C8A2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PLANS = [
  {
    name: "Başlangıç",
    ideal: "Kafeler ve butik işletmeler",
    featured: false,
    items: [
      "Koli bazlı minimum sipariş",
      "Standart ürün gamından seçim",
      "Türkiye geneli kargo",
      "WhatsApp üzerinden sipariş takibi",
    ],
    cta: "Teklif Al",
  },
  {
    name: "İşletme",
    ideal: "Catering firmaları ve restoran zincirleri",
    featured: true,
    badge: "En çok tercih edilen",
    items: [
      "Palet bazlı toptan fiyatlandırma",
      "Tüm ürün gamına erişim",
      "Kağıt pipette özel logo baskısı",
      "Aylık düzenli sevkiyat planı",
      "Öncelikli müşteri temsilcisi",
    ],
    cta: "Teklif Al",
  },
  {
    name: "Kurumsal",
    ideal: "Oteller, zincirler ve toptancılar",
    featured: false,
    items: [
      "Sözleşmeli yıllık tedarik",
      "Tüm ürünlerde özel baskı & ambalaj",
      "Stok rezervasyonu garantisi",
      "Sürdürülebilirlik raporu desteği",
    ],
    cta: "Görüşme Planla",
  },
];

export function Pricing() {
  const reduce = useReducedMotion();
  return (
    <section id="fiyat" className="rounded-t-[64px] bg-fiber px-6 py-24 max-md:rounded-t-[40px]">
      <div className="mx-auto max-w-wrap">
        <motion.div className="mb-12 max-w-2xl" variants={staggerV} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Fiyatlandırma
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-3.5 font-display text-h2 font-medium text-green">
            İşletmenize uygun teklif paketi
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#4a5342]">
            Toptan fiyatlar sipariş hacmine göre belirlenir. Paketinizi seçin, aynı gün size özel teklifle dönelim.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid items-stretch gap-6 lg:grid-cols-3"
          variants={staggerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {PLANS.map((p) => (
            <motion.article
              key={p.name}
              variants={fadeUp}
              whileHover={reduce ? {} : { y: -8, boxShadow: "0 18px 40px rgba(31,59,19,.14)" }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={
                p.featured
                  ? "relative flex flex-col rounded-card border-2 border-green bg-green p-8 text-ongreen lg:-my-4 lg:py-12"
                  : "relative flex flex-col rounded-card border border-line bg-cream p-8"
              }
            >
              {p.badge && (
                <span className="absolute -top-3.5 left-8 rounded-full bg-leaf px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {p.badge}
                </span>
              )}
              <h3 className={`font-display text-2xl font-medium ${p.featured ? "text-ongreen" : "text-green"}`}>{p.name}</h3>
              <p className={`mb-6 mt-1 text-sm ${p.featured ? "text-ongreen-muted" : "text-[#5a6350]"}`}>{p.ideal}</p>
              <ul className="mb-8 flex flex-col gap-3">
                {p.items.map((it) => (
                  <li key={it} className={`flex items-start gap-2.5 text-sm ${p.featured ? "text-ongreen" : "text-ink"}`}>
                    <CheckIcon />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {p.featured ? (
                  <motion.a
                    href="#iletisim"
                    whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex w-full items-center justify-center rounded-full bg-bone px-7 py-3.5 text-[0.95rem] font-semibold text-green focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-leaf"
                  >
                    {p.cta}
                  </motion.a>
                ) : (
                  <InteractiveHoverButton href="#iletisim" variant="ghost" className="w-full">
                    {p.cta}
                  </InteractiveHoverButton>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm text-[#5a6350]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Tüm paketlerde ürünler %100 bitki bazlıdır ve gıda ile temasa uygunluk belgeleri sipariş ile birlikte iletilir.
        </motion.p>
      </div>
    </section>
  );
}

/* ================= BOLUM 5: SSS ================= */
import FaqAccordion from "./ui/FaqAccordion.jsx";

const FAQS = [
  {
    q: "Ürünler gerçekten doğada çözünüyor mu, ne kadar sürede?",
    a: "Evet. Mısır nişastası, şeker kamışı bagasse ve palmiye yaprağı hammaddeler endüstriyel kompost koşullarında yaklaşık 180 günde tamamen çözünür. Geriye mikroplastik kalmaz; ürünler bitkiden gelir, doğaya döner.",
  },
  {
    q: "Sıcak yemek ve mikrodalga ile kullanılabilir mi?",
    a: "Bagasse ve palmiye yaprağı ürünlerimiz sıcak, soğuk ve yağlı gıdalara dayanıklıdır; bükülmez ve sızdırmaz. Bagasse ürünler mikrodalgada kısa süreli ısıtmaya uygundur. Ürün bazında detaylar teknik föyde belirtilir.",
  },
  {
    q: "Minimum sipariş miktarı nedir?",
    a: "Başlangıç paketinde koli bazlı, İşletme paketinde palet bazlı çalışıyoruz. Ürün grubuna göre koli içi adetler değişir; teklif talebinizde ihtiyacınızı belirtin, size en uygun miktarı birlikte planlayalım.",
  },
  {
    q: "Kağıt pipetlere kendi logomuzu bastırabilir miyiz?",
    a: "Evet. İşletme ve Kurumsal paketlerde kağıt pipetlere özel logo baskısı yapıyoruz. Baskı dosyanızı iletin; renk ayrımı ve ön izleme onayınızdan sonra üretime geçilir.",
  },
  {
    q: "Gıda güvenliği belgeleri mevcut mu?",
    a: "Tüm ürünlerimiz gıda ile temasa uygundur ve ilgili uygunluk belgeleri her siparişle birlikte tarafınıza iletilir. Kurumsal pakette denetim ve raporlama süreçleriniz için ek dokümantasyon desteği de sağlıyoruz.",
  },
  {
    q: "Sevkiyat ne kadar sürer, Türkiye geneline gönderim var mı?",
    a: "Stoklu çalıştığımız ürünlerde siparişler hızla hazırlanır ve Türkiye'nin her yerine gönderilir. Düzenli tedarik ihtiyacında aylık sevkiyat planı oluşturarak stok sürekliliği garanti ediyoruz.",
  },
];

export function Faq() {
  return (
    <section id="sss" className="px-6 py-24">
      <div className="mx-auto grid max-w-wrap gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div variants={staggerV} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Sık Sorulan Sorular
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-3.5 font-display text-h2 font-medium text-green">
            Merak ettikleriniz
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#4a5342]">
            Cevabını bulamadığınız sorular için bize yazın — aynı gün dönüş yapıyoruz.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <FaqAccordion items={FAQS} />
        </motion.div>
      </div>
    </section>
  );
}

/* ================= BOLUM 6: CTA ================= */
function LeafShape(props) {
  return (
    <svg viewBox="0 0 52 34" {...props} aria-hidden="true">
      <path d="M0 22 C10 4 34 -2 52 1 C50 18 36 32 16 32 C10 32 4 28 0 22 Z" fill="#4C8A2E" />
      <path d="M4 24 C18 16 34 9 48 4" stroke="#DFF0D0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Cta() {
  const reduce = useReducedMotion();
  return (
    <section id="iletisim" className="relative overflow-hidden px-6 py-28 text-center">
      <motion.div
        className="pointer-events-none absolute left-[6%] top-5 opacity-[0.07]"
        animate={reduce ? {} : { y: [0, 14, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <LeafShape width="140" height="100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-8 right-[8%] rotate-[160deg] opacity-[0.07]"
        animate={reduce ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <LeafShape width="180" height="120" />
      </motion.div>

      <motion.div className="relative z-10 mx-auto max-w-wrap" variants={staggerV} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.span variants={fadeUp} className="mb-3.5 inline-block text-xs font-bold uppercase tracking-[0.14em] text-leaf">
          Teklif &amp; İletişim
        </motion.span>
        <motion.h2 variants={fadeUp} className="mb-4 font-display text-h2 font-medium text-green">
          Yeşil bir gelecek, sofranızdan başlar
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mb-9 max-w-lg text-[#4a5342]">
          Paketinizi seçtiniz mi? İhtiyacınızı yazın, aynı gün işletmenize özel toptan teklifle dönelim.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <InteractiveHoverButton href="mailto:info@dogadanpack.com" variant="primary">Teklif İste</InteractiveHoverButton>
          <InteractiveHoverButton href="#" variant="ghost">E-Katalog (PDF)</InteractiveHoverButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================= BOLUM 7: FOOTER ================= */
export function Footer() {
  return (
    <footer className="bg-green px-6 pb-8 pt-16 text-[#D8DCC9]">
      <div className="mx-auto max-w-wrap">
        <motion.div
          className="mb-12 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]"
          variants={staggerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center gap-3">
              <LogoO size={46} />
              <div>
                <div className="text-lg font-extrabold tracking-wide text-ongreen">DOĞADANPACK</div>
                <div className="font-display text-sm italic text-ongreen-muted">“Yeşil Bir Gelecek İçin”</div>
              </div>
            </div>
            <p className="max-w-xs text-sm opacity-80">
              Sivas'tan Türkiye'ye — doğal ve organik tek kullanımlık gıda servis ürünleri.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-ongreen-muted">Sayfa</h4>
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="mb-2.5 block text-sm opacity-85 transition-opacity hover:opacity-100">
                {label}
              </a>
            ))}
          </motion.div>
          <motion.div variants={fadeUp}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-ongreen-muted">İletişim</h4>
            <a href="mailto:info@dogadanpack.com" className="mb-2.5 block text-sm opacity-85 transition-opacity hover:opacity-100">info@dogadanpack.com</a>
            <a href="#" className="mb-2.5 block text-sm opacity-85 transition-opacity hover:opacity-100">WhatsApp Hattı</a>
            <span className="block text-sm opacity-85">Sivas, Türkiye</span>
          </motion.div>
        </motion.div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-xs opacity-70">
          <span>© 2026 DoğadanPack. Tüm hakları saklıdır.</span>
          <span>Bitkiden gelir, doğaya döner.</span>
        </div>
      </div>
    </footer>
  );
}
