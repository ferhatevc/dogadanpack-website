"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";

/**
 * "Yaprağın Yolculuğu" — açılış deneyimi.
 * awwwards-3d skill prensipleriyle: ACESFilmic tone mapping, her değer lerp'li,
 * particle field arketipi. 7000 parçacık rüzgârda savrulan yapraklar gibi gelir,
 * DoğadanPack logosunu oluşturur; scroll'la dağılıp siteyi açar.
 */

const VERT = `
uniform float uTime;
uniform float uMorph;      // 0: dagimik -> 1: logo
uniform float uScroll;     // 0: sahnede -> 1: dagildi
uniform vec2  uMouse;      // -1..1
uniform float uDpr;
attribute vec3 aTarget;
attribute vec4 aRand;      // x: hiz, y: faz, z: boyut, w: renk secimi
varying float vAlpha;
varying float vColorMix;

void main() {
  float t = uTime;
  // baslangic -> logo morfu (her parcacik kendi gecikmesiyle)
  float m = clamp(uMorph * 1.35 - aRand.y * 0.35, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m); // smoothstep
  vec3 pos = mix(position, aTarget, m);

  // ruzgar dalgasi (morf tamamlaninca sakinlesir)
  float wind = (1.0 - m) * 0.6 + 0.035;
  pos.x += sin(t * aRand.x + aRand.y * 6.283) * wind;
  pos.y += cos(t * aRand.x * 0.8 + aRand.y * 4.0) * wind * 0.7;
  pos.z += sin(t * 0.5 + aRand.y * 6.283) * wind * 0.5;

  // fare itmesi (yapraklara dokunma hissi)
  vec2 mp = uMouse * vec2(1.4, 1.0);
  vec2 d = pos.xy - mp;
  float dist = length(d);
  float push = smoothstep(0.5, 0.0, dist) * 0.22;
  pos.xy += normalize(d + 0.0001) * push;

  // scroll ile dagilma: yukari ve disari savrulur
  float s = uScroll;
  pos.x += (aRand.y - 0.5) * 4.0 * s * s;
  pos.y += (0.6 + aRand.x * 0.2) * 3.5 * s;
  pos.z += (aRand.w - 0.5) * 2.0 * s;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (aRand.z * 4.0 + 2.0) * uDpr * (3.2 / -mv.z);

  vAlpha = (0.55 + 0.45 * sin(t * 1.5 + aRand.y * 20.0)) * (1.0 - s);
  vColorMix = aRand.w;
}
`;

const FRAG = `
varying float vAlpha;
varying float vColorMix;
uniform vec3 uColA; // krem
uniform vec3 uColB; // yaprak yesili
uniform vec3 uColC; // acik yesil

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float circle = smoothstep(0.5, 0.12, d);
  if (circle < 0.01) discard;
  vec3 col = mix(uColA, uColB, step(0.55, vColorMix));
  col = mix(col, uColC, step(0.85, vColorMix));
  gl_FragColor = vec4(col, circle * vAlpha);
}
`;

export default function IntroExperience() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduce) { setReady(true); return; }
    let raf, renderer, disposed = false;
    const state = { morph: 0, morphT: 0, scroll: 0, mouse: new THREE.Vector2(0, 0), mouseT: new THREE.Vector2(0, 0) };

    (async () => {
      try {
      const res = await fetch("/logo-points.json");
      const flat = await res.json();
      if (disposed) return;
      const count = flat.length / 2;

      const canvas = canvasRef.current;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor("#152A0D", 1);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog("#152A0D", 3.2, 6.5);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
      camera.position.set(0, 0, 3.2);

      // geometri
      const geo = new THREE.BufferGeometry();
      const starts = new Float32Array(count * 3);
      const targets = new Float32Array(count * 3);
      const rands = new Float32Array(count * 4);
      const SCALE = 1.15;
      for (let i = 0; i < count; i++) {
        // hedef: logo noktasi
        targets[i * 3] = flat[i * 2] * SCALE;
        targets[i * 3 + 1] = flat[i * 2 + 1] * SCALE;
        targets[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
        // baslangic: sol ust ruzgar bulutu
        const a = Math.random() * Math.PI * 2, r = 1.5 + Math.random() * 3.5;
        starts[i * 3] = Math.cos(a) * r - 3.5;
        starts[i * 3 + 1] = Math.sin(a) * r * 0.7 + 1.6;
        starts[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
        rands[i * 4] = 0.4 + Math.random() * 1.2;
        rands[i * 4 + 1] = Math.random();
        rands[i * 4 + 2] = Math.random();
        rands[i * 4 + 3] = Math.random();
      }
      geo.setAttribute("position", new THREE.BufferAttribute(starts, 3));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10);
      geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rands, 4));

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: state.mouse },
          uColA: { value: new THREE.Color("#F7F5EE") },
          uColB: { value: new THREE.Color("#7BC24E") },
          uColC: { value: new THREE.Color("#C9E8B0") },
          uDpr: { value: Math.min(window.devicePixelRatio, 2) },
        },
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const resize = () => {
        const w = wrapRef.current.clientWidth, h = wrapRef.current.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const onMouse = (e) => {
        state.mouseT.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      };
      window.addEventListener("pointermove", onMouse);

      const clock = new THREE.Clock();
      const lerp = (a, b, f) => a + (b - a) * f;
      const tick = () => {
        const t = clock.getElapsedTime();
        // her sey lerp'li (skill kurali)
        state.morphT = t > 0.7 ? 1 : 0;
        state.morph = lerp(state.morph, state.morphT, 0.022);
        const sTarget = Math.min(window.scrollY / (window.innerHeight * 0.85), 1);
        state.scroll = lerp(state.scroll, sTarget, 0.08);
        state.mouse.lerp(state.mouseT, 0.06);

        mat.uniforms.uTime.value = t;
        mat.uniforms.uMorph.value = state.morph;
        mat.uniforms.uScroll.value = state.scroll;
        camera.position.x = lerp(camera.position.x, state.mouse.x * 0.12, 0.06);
        camera.position.y = lerp(camera.position.y, state.mouse.y * 0.08, 0.06);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
      } catch (err) {
        console.error("Intro 3D hata:", err);
        setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      renderer?.dispose();
    };
  }, [reduce]);

  // hareket azaltilmis veya hata: sik statik acilis (krem logo + slogan)
  if (reduce || failed) {
    return (
      <section className="relative flex h-screen flex-col items-center justify-center gap-8 overflow-hidden" style={{ background: "#152A0D" }}>
        <img
          src="/logo.png"
          alt="DoğadanPack — Yeşil Bir Gelecek İçin"
          className="w-72 md:w-96"
          style={{ filter: "brightness(0) invert(0.96) sepia(0.15)" }}
        />
        <p className="font-display text-xl italic text-[#DCE8CE] md:text-2xl">Bitkiden gelir, doğaya döner.</p>
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AEC49A]">Keşfetmek için kaydır ↓</span>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden" aria-label="DoğadanPack — Yaprağın Yolculuğu açılışı">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* metin katmani */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-xl italic text-[#DCE8CE] md:text-2xl"
        >
          Bitkiden gelir, doğaya döner.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 3.4, duration: 1 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AEC49A]">Keşfetmek için kaydır</span>
          <motion.svg
            width="20" height="30" viewBox="0 0 24 36" fill="none"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="#AEC49A" strokeWidth="2" />
            <circle cx="12" cy="10" r="3" fill="#AEC49A" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
