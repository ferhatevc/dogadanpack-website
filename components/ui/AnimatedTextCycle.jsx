"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * 21st.dev "Animated Text Cycle" pattern'inin DoğadanPack uyarlaması.
 * Kelime listesini yumuşak geçişlerle döndürür; genişlik animasyonu ile
 * çevresindeki metin zıplamaz.
 */
export default function AnimatedTextCycle({ words, interval = 2800, className = "" }) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (measureRef.current) {
      const el = measureRef.current.children[index];
      if (el) setWidth(`${el.getBoundingClientRect().width}px`);
    }
  }, [index]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  if (reduce) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <>
      {/* olcum icin gizli kopyalar */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", whiteSpace: "nowrap" }}
      >
        {words.map((w) => (
          <span key={w} className={className} style={{ display: "inline-block" }}>{w}</span>
        ))}
      </div>

      <motion.span
        style={{ display: "inline-block", whiteSpace: "nowrap", overflow: "visible", verticalAlign: "bottom" }}
        animate={{ width }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            className={className}
            style={{ display: "inline-block" }}
            initial={{ y: 18, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -18, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
