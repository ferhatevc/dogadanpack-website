"use client";
import React, { useRef, useEffect, useState } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * 21st.dev "Stats & KPIs" pattern'inin DoğadanPack uyarlaması.
 * Görünüme girince spring fiziğiyle hedef değere sayar.
 * Türkçe binlik ayracı (100.000), prefix/suffix desteği,
 * reduced-motion'da doğrudan son değeri gösterir.
 */
export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  decimals = 0,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [text, setText] = useState("0");

  const fmt = (v) =>
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setText(fmt(v)));
    return unsub;
  }, [spring, decimals]);

  if (reduce) {
    return <span ref={ref} className={className}>{prefix}{fmt(to)}{suffix}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{text}{suffix}
    </span>
  );
}
