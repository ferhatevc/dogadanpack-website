"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

/**
 * "Yaprağın Yolculuğu" v2 — sinematik açılış.
 * awwwards-3d prensipleri: ACESFilmic, her değer lerp'li, atmosfer > geometri.
 * Katmanlar:
 *  1) Akan organik gradyan zemin (simplex noise shader, fare ile akar)
 *  2) 700 gerçek 3D yaprak — rüzgâr girdabında süzülür, ışık alır, kameraya derinlikli
 *  3) Keskin gerçek logo + slogan (DOM) — blur'dan sahneye iner
 *  Scroll: kamera yaprakların ARASINDAN dalar, sahne siteye açılır.
 */

const BG_FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main(){
  vec2 uv = vUv;
  float t = uTime * 0.06;
  vec2 m = uMouse * 0.15;
  float n1 = snoise(uv * 1.6 + vec2(t, -t * 0.7) + m);
  float n2 = snoise(uv * 3.2 - vec2(t * 0.5, t) - m);
  float n = n1 * 0.65 + n2 * 0.35;

  vec3 deep  = vec3(0.055, 0.11, 0.038);
  vec3 mid   = vec3(0.10, 0.20, 0.075);
  vec3 glow  = vec3(0.22, 0.38, 0.16);
  vec3 col = mix(deep, mid, smoothstep(-0.6, 0.6, n));
  col = mix(col, glow, smoothstep(0.45, 0.95, n) * 0.5);

  float beam = smoothstep(1.0, 0.2, distance(uv, vec2(0.5 + m.x, 1.1))) * 0.22;
  col += glow * beam;
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
  col *= 0.55 + 0.45 * vig;
  gl_FragColor = vec4(col, 1.0);
}
`;

function makeLeafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(0.42, -0.28, 0.42, 0.28, 0, 0.5);
  s.bezierCurveTo(-0.42, 0.28, -0.42, -0.28, 0, -0.5);
  const g = new THREE.ShapeGeometry(s, 10);
  g.rotateX(Math.PI * 0.08);
  return g;
}

export default function IntroExperience() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const scrollFade = useRef(null);

  useEffect(() => {
    let raf, renderer, disposed = false;
    const st = { mouse: new THREE.Vector2(), mouseT: new THREE.Vector2(), scroll: 0, dive: 0 };

    try {
      const canvas = canvasRef.current;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog("#152A0D", 4, 11);
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 30);
      camera.position.set(0, 0, 6);

      // ---- katman 1: akan zemin ----
      const bgMat = new THREE.ShaderMaterial({
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }",
        fragmentShader: BG_FRAG,
        uniforms: { uTime: { value: 0 }, uMouse: { value: st.mouse } },
        depthWrite: false,
        depthTest: false,
      });
      const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
      bg.frustumCulled = false;
      bg.renderOrder = -1;
      scene.add(bg);

      // ---- katman 2: 700 gercek yaprak ----
      const COUNT = 700;
      const leafGeo = makeLeafGeometry();
      const leafMat = new THREE.MeshStandardMaterial({
        color: "#FFFFFF",
        roughness: 0.65,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const leaves = new THREE.InstancedMesh(leafGeo, leafMat, COUNT);
      leaves.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const palette = ["#4C8A2E", "#7BA05B", "#9DC183", "#3B6B22", "#C9E8B0"].map((c) => new THREE.Color(c));
      const data = [];
      const dummy = new THREE.Object3D();
      for (let i = 0; i < COUNT; i++) {
        data.push({
          radius: 1.2 + Math.random() * 4.2,
          angle: Math.random() * Math.PI * 2,
          y: (Math.random() - 0.5) * 6,
          z: -Math.random() * 14,
          speed: 0.08 + Math.random() * 0.25,
          spin: (Math.random() - 0.5) * 2.2,
          flutter: Math.random() * Math.PI * 2,
          scale: 0.12 + Math.random() * 0.28,
        });
        leaves.setColorAt(i, palette[i % palette.length]);
      }
      leaves.instanceColor.needsUpdate = true;
      scene.add(leaves);

      // ---- isik ----
      scene.add(new THREE.AmbientLight("#B8CFA0", 0.5));
      const key = new THREE.DirectionalLight("#FFF3D8", 1.6);
      key.position.set(3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight("#6FA84E", 0.7);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      const resize = () => {
        const w = wrapRef.current.clientWidth, h = wrapRef.current.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);
      const onMouse = (e) => st.mouseT.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      window.addEventListener("pointermove", onMouse);

      const clock = new THREE.Clock();
      const lerp = (a, b, f) => a + (b - a) * f;

      const tick = () => {
        if (disposed) return;
        const t = clock.getElapsedTime();
        st.mouse.lerp(st.mouseT, 0.05);
        const sT = Math.min(window.scrollY / (innerHeight * 0.9), 1);
        st.scroll = lerp(st.scroll, sT, 0.07);
        st.dive = st.scroll * st.scroll;

        bgMat.uniforms.uTime.value = t;

        for (let i = 0; i < COUNT; i++) {
          const d = data[i];
          const ang = d.angle + t * d.speed * (0.4 + st.dive * 2.5);
          let z = d.z + ((t * d.speed * 1.2 + st.dive * 10) % 14);
          if (z > 7) z -= 14;
          const wob = Math.sin(t * 1.4 + d.flutter) * 0.25;
          dummy.position.set(
            Math.cos(ang) * d.radius + st.mouse.x * 0.4,
            d.y + wob + st.mouse.y * 0.25,
            z
          );
          dummy.rotation.set(
            t * d.spin * 0.5 + d.flutter,
            t * d.spin,
            Math.sin(t * 0.9 + d.flutter) * 0.6
          );
          const sc = d.scale * (1 + st.dive * 0.4);
          dummy.scale.set(sc, sc, sc);
          dummy.updateMatrix();
          leaves.setMatrixAt(i, dummy.matrix);
        }
        leaves.instanceMatrix.needsUpdate = true;

        camera.position.x = lerp(camera.position.x, st.mouse.x * 0.5, 0.05);
        camera.position.y = lerp(camera.position.y, st.mouse.y * 0.3, 0.05);
        camera.position.z = 6 - st.dive * 4.5;
        camera.fov = 50 + st.dive * 22;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, -2);

        if (scrollFade.current) {
          scrollFade.current.style.opacity = String(Math.max(0, 1 - st.scroll * 1.6));
          scrollFade.current.style.transform = `translateY(${st.scroll * -60}px) scale(${1 - st.scroll * 0.08})`;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
    } catch (err) {
      console.error("Intro 3D hata:", err);
      setFailed(true);
    }

    return () => { disposed = true; cancelAnimationFrame(raf); renderer?.dispose(); };
  }, []);

  if (failed) {
    return (
      <section className="relative flex h-screen flex-col items-center justify-center gap-8" style={{ background: "#152A0D" }}>
        <img src="/logo.png" alt="DoğadanPack" className="w-72 md:w-96" style={{ filter: "brightness(0) invert(0.96) sepia(0.15)" }} />
        <p className="font-display text-xl italic text-[#DCE8CE]">Bitkiden gelir, doğaya döner.</p>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden" aria-label="DoğadanPack — Yaprağın Yolculuğu açılışı" style={{ background: "#152A0D" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* keskin logo + slogan — parcacik degil, gercek logo */}
      <div ref={scrollFade} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.img
          src="/logo.png"
          alt="DoğadanPack — Yeşil Bir Gelecek İçin"
          className="w-64 md:w-[26rem]"
          style={{ filter: "brightness(0) invert(0.97) sepia(0.12) drop-shadow(0 12px 60px rgba(0,0,0,0.45))" }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.7, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-xl italic text-[#DCE8CE] md:text-2xl"
        >
          Bitkiden gelir, doğaya döner.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 2.6, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-2.5"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#AEC49A]">Keşfetmek için kaydır</span>
          <motion.svg width="20" height="30" viewBox="0 0 24 36" fill="none" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true">
            <rect x="1" y="1" width="22" height="34" rx="11" stroke="#AEC49A" strokeWidth="2" />
            <motion.circle cx="12" cy="10" r="3" fill="#AEC49A" animate={{ cy: [10, 22, 10] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
