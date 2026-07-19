"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";

/**
 * "Yaprağın Yolculuğu" — scroll'a bağlı 3D anlatı.
 * 400vh'lik bölüm; sticky sahnede scroll ilerledikçe 4 sahne:
 *  1) Bitkiden Gelir   — dev yaprak süzülür
 *  2) Doğal Üretim     — yaprak küçülür, kase şekillenir
 *  3) Sofranıza Ulaşır — tam servis seti kurulur
 *  4) Doğaya Döner     — ürünler toprağa karışır, yapraklar dağılır
 */

const FIBER = "#EDE9DC";
const BONE = "#F7F5EE";
const GREEN = "#1F3B13";
const LEAF = "#4C8A2E";
const MOSS = "#7BA05B";
const SOIL = "#5C4A32";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const range = (v, a, b) => clamp01((v - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t); // smoothstep

/* ---- geometriler ---- */
function useGeos() {
  return useMemo(() => {
    const bowlPts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      bowlPts.push(new THREE.Vector2(Math.sin(t * Math.PI * 0.5) * 1.05, t * 0.72 - 0.05));
    }
    const bowl = new THREE.LatheGeometry(bowlPts, 48);
    const plate = new THREE.LatheGeometry(
      [new THREE.Vector2(0.001, 0), new THREE.Vector2(0.85, 0), new THREE.Vector2(1.1, 0.14), new THREE.Vector2(1.18, 0.16)], 48);
    const cup = new THREE.LatheGeometry(
      [new THREE.Vector2(0.001, 0), new THREE.Vector2(0.4, 0), new THREE.Vector2(0.52, 0.9)], 40);
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.35, 0.35, 0, 0.8);
    leafShape.quadraticCurveTo(-0.35, 0.35, 0, 0);
    const leaf = new THREE.ShapeGeometry(leafShape);
    return { bowl, plate, cup, leaf };
  }, []);
}

function JourneyScene({ progress, reduce }) {
  const geo = useGeos();
  const heroLeaf = useRef();
  const bowl = useRef();
  const plate = useRef();
  const cup = useRef();
  const straw = useRef();
  const scatter = useRef([]);
  const cam = useRef();
  const soil = useRef();
  const backdrop = useRef();
  const stageColors = useMemo(() => ({
    a: new THREE.Color("#A9C79A"), b: new THREE.Color("#E6DFC8"),
    c: new THREE.Color("#D8C29A"), d: new THREE.Color("#8A7458"), tmp: new THREE.Color(),
  }), []);

  const scatterData = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      radius: 1.6 + (i % 4) * 0.5,
      speed: 0.6 + (i % 5) * 0.18,
      scale: 0.22 + (i % 3) * 0.12,
    })), []);

  useFrame(({ clock, camera }) => {
    const p = reduce ? 0.6 : progress.get(); // reduced: sabit "sofra" sahnesi
    const t = clock.elapsedTime;

    // sahne asamalari
    const s1 = ease(range(p, 0.0, 0.22));   // yaprak sahnede
    const s2 = ease(range(p, 0.22, 0.48));  // kase sekillenir
    const s3 = ease(range(p, 0.48, 0.72));  // set kurulur
    const s4 = ease(range(p, 0.74, 1.0));   // dogaya donus

    // kamera: yukaridan yaklasip, sonda topraga eguilir
    camera.position.y = 1.6 - s2 * 0.5 - s4 * 0.6;
    camera.position.z = 6.4 - s2 * 0.9 - s3 * 0.4;
    camera.position.x = Math.sin(p * Math.PI * 2) * 0.4;
    camera.lookAt(0, -0.4 - s4 * 0.5, 0);

    // 1) dev yaprak
    if (heroLeaf.current) {
      const l = heroLeaf.current;
      l.visible = s1 > 0.01 && s2 < 0.99;
      const sc = (0.001 + s1 * 2.2) * (1 - s2 * 0.85);
      l.scale.setScalar(Math.max(0.001, sc));
      l.position.set(0, 0.4 - s2 * 1.1 + Math.sin(t * 0.8) * 0.15 * (1 - s2), 0);
      l.rotation.y = t * 0.5;
      l.rotation.z = Math.sin(t * 0.6) * 0.3 * (1 - s2);
    }

    // 2) kase
    if (bowl.current) {
      const b = bowl.current;
      const sc = s2 * (1 - s4 * 0.6);
      b.visible = sc > 0.01;
      b.scale.setScalar(Math.max(0.001, sc));
      b.position.set(0, -0.82 - s4 * 0.9, 0);
      b.rotation.y = (1 - s2) * 2.5;
      b.material.color.lerpColors(new THREE.Color(LEAF), new THREE.Color(FIBER), s2);
      if (s4 > 0) b.material.color.lerp(new THREE.Color(SOIL), s4 * 0.7);
    }

    // 3) set: tabak, bardak, pipet
    if (plate.current) {
      const sc = s3 * (1 - s4 * 0.6);
      plate.current.visible = sc > 0.01;
      plate.current.scale.setScalar(Math.max(0.001, sc));
      plate.current.position.set(0, -0.9 - s4 * 0.9, 0);
      plate.current.material.color.set(FIBER).lerp(new THREE.Color(SOIL), s4 * 0.7);
    }
    if (cup.current) {
      const sc = s3 * (1 - s4 * 0.6);
      cup.current.visible = sc > 0.01;
      cup.current.scale.setScalar(Math.max(0.001, sc));
      cup.current.position.set(1.7 - (1 - s3) * 1.2, -0.9 - s4 * 0.9, 0.3);
      cup.current.material.color.set(BONE).lerp(new THREE.Color(SOIL), s4 * 0.7);
    }
    if (straw.current) {
      const sc = s3 * (1 - s4);
      straw.current.visible = sc > 0.01;
      straw.current.scale.setScalar(Math.max(0.001, sc));
      straw.current.position.set(1.62, 0.05 - (1 - s3) * 0.8 - s4 * 1.4, 0.32);
    }

    // fon dairesi: sahneye gore renk degistirir
    if (backdrop.current) {
      const { a, b, c, d, tmp } = stageColors;
      tmp.copy(a);
      if (s2 > 0) tmp.lerp(b, s2);
      if (s3 > 0) tmp.lerp(c, s3);
      if (s4 > 0) tmp.lerp(d, s4);
      backdrop.current.material.color.copy(tmp);
      backdrop.current.scale.setScalar(2.1 + s3 * 0.5 - s4 * 0.4);
      backdrop.current.position.y = 0.2 - s4 * 0.8;
    }

    // toprak diski
    if (soil.current) {
      soil.current.material.opacity = s4 * 0.9;
      soil.current.scale.setScalar(0.001 + s4 * 3.2);
    }

    // 4) dagilan yapraklar (hem giris hem cikista)
    scatter.current.forEach((m, i) => {
      if (!m) return;
      const d = scatterData[i];
      const amb = s1 * (1 - s2) * 0.6 + s4; // baslangicta hafif, sonda yogun
      m.visible = amb > 0.02;
      const a = d.angle + t * d.speed * 0.3;
      const r = d.radius * (0.4 + amb);
      m.position.set(Math.cos(a) * r, -0.4 + Math.sin(t * d.speed + i) * 0.4 + s4 * (Math.sin(i) * 0.6 - 0.6), Math.sin(a) * r * 0.6);
      m.scale.setScalar(d.scale * amb);
      m.rotation.z = t * d.speed;
      m.rotation.y = a;
    });
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#FFF8E8" />
      <directionalLight position={[-5, 3, -3]} intensity={0.35} color="#DFF0D0" />

      <mesh ref={backdrop} position={[0, 0.2, -3]}>
        <circleGeometry args={[1, 72]} />
        <meshStandardMaterial color="#A9C79A" roughness={1} transparent opacity={0.55} />
      </mesh>

      <mesh ref={heroLeaf} geometry={geo.leaf}>
        <meshStandardMaterial color={LEAF} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={bowl} geometry={geo.bowl}>
        <meshStandardMaterial color={FIBER} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={plate} geometry={geo.plate}>
        <meshStandardMaterial color={FIBER} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={cup} geometry={geo.cup}>
        <meshStandardMaterial color={BONE} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={straw}>
        <cylinderGeometry args={[0.045, 0.045, 1.6, 16]} />
        <meshStandardMaterial color={GREEN} roughness={0.6} />
      </mesh>
      <mesh ref={soil} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]}>
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial color={SOIL} roughness={1} transparent opacity={0} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} ref={(el) => (scatter.current[i] = el)} geometry={geo.leaf}>
          <meshStandardMaterial color={i % 3 === 0 ? MOSS : LEAF} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

const CAPTIONS = [
  { n: "1", t: "Bitkiden Gelir", d: "Mısır nişastası, şeker kamışı ve palmiye yaprağı — hammaddemiz doğanın kendisi." },
  { n: "2", t: "Doğal Üretim", d: "Elyaf, kimyasal katkı olmadan yüksek basınç ve ısıyla şekillenir." },
  { n: "3", t: "Sofranıza Ulaşır", d: "Sağlam, sızdırmaz, premium sunum — plastik değildir, bitki bazlıdır." },
  { n: "4", t: "Doğaya Döner", d: "Kullanım sonrası 180 günde komposta karışır. Geriye mikroplastik değil, toprak kalır." },
];

export default function ScrollJourney() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // caption gecisleri
  const ranges = [[0.02, 0.08, 0.18, 0.24], [0.24, 0.3, 0.42, 0.48], [0.48, 0.54, 0.66, 0.72], [0.74, 0.8, 0.94, 1]];
  const opacities = ranges.map((r) => useTransform(scrollYProgress, r, [0, 1, 1, 0]));
  const ys = ranges.map((r) => useTransform(scrollYProgress, r, [24, 0, 0, -24]));
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative bg-bone" style={{ height: reduce ? "auto" : "400vh" }} aria-label="Yaprağın Yolculuğu — üretimden komposta">
      <div className={reduce ? "relative h-[70vh]" : "sticky top-0 h-screen overflow-hidden"}>
        <Canvas camera={{ position: [0, 1.6, 6.4], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
          <JourneyScene progress={scrollYProgress} reduce={reduce} />
        </Canvas>

        {/* basliklar */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-wrap px-6">
            <div className="relative h-56 max-w-md">
              {CAPTIONS.map((c, i) => (
                <motion.div key={c.n} style={reduce ? (i === 2 ? {} : { opacity: 0 }) : { opacity: opacities[i], y: ys[i] }} className="absolute inset-0">
                  <div className="rounded-[24px] border border-line bg-cream/90 p-7 shadow-[0_18px_40px_rgba(31,59,19,.10)] backdrop-blur-sm" style={{ borderRadius: "26px 30px 24px 32px" }}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center bg-green font-display text-sm italic text-ongreen" style={{ borderRadius: "12px 15px 11px 16px" }}>{c.n}</span>
                      <span className="flex gap-1.5" aria-hidden="true">
                        {CAPTIONS.map((_, j) => (
                          <span key={j} className={`h-1.5 rounded-full transition-all ${j === i ? "w-6 bg-leaf" : "w-1.5 bg-line"}`} />
                        ))}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-[1.7rem] font-medium leading-tight text-green">{c.t}</h3>
                    <p className="text-sm leading-relaxed text-[#4a5342]">{c.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ilerleme cubugu */}
        {!reduce && (
          <div className="absolute bottom-8 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full origin-left bg-leaf" style={{ scaleX: barScale }} />
          </div>
        )}
      </div>
    </section>
  );
}
