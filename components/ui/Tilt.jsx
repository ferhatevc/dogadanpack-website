"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/** 3D tilt kart — fareyi takip eden perspektif eğimi */
export function TiltCard({ children, className = "", ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 260, damping: 22 });
  const rY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 260, damping: 22 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Client-only mount — 3D Canvas'i SSR'dan korur */
export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : fallback;
}
