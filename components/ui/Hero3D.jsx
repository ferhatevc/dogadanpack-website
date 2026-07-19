"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero 3D v2 — "Stüdyo canlanıyor": studio-01 çekiminin 3D sahnelenmesi.
 * Bone duvar + yeşil daire spot + mermer kaide; kraft kapaklı kase,
 * yaslanmış tabldot ve tabak, bardak+pipet, ahşap çatal, süzülen yapraklar.
 */

const WALL = "#F3EFE2";
const FLOOR = "#EFEADB";
const CIRCLE = "#8FB07E";
const MARBLE = "#EDE7D6";
const FIBER = "#E9E2CF";
const BONE = "#F4EFE3";
const KRAFT = "#C9A97D";
const WOOD = "#C8A268";
const GREEN = "#1F3B13";
const LEAF = "#4C8A2E";

const DS = THREE.DoubleSide;

/* yumusak golge dokusu */
function useShadowTex() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, "rgba(40,32,18,0.35)");
    grad.addColorStop(1, "rgba(40,32,18,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);
}

function Shadow({ position, scale = 1, opacity = 1 }) {
  const tex = useShadowTex();
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale * 0.7, 1]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function useBowlGeo() {
  return useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 22; i++) {
      const t = i / 22;
      pts.push(new THREE.Vector2(Math.sin(t * Math.PI * 0.52) * 0.85, t * 0.6));
    }
    return new THREE.LatheGeometry(pts, 56);
  }, []);
}
function usePlateGeo() {
  return useMemo(() => new THREE.LatheGeometry(
    [new THREE.Vector2(0.02, 0), new THREE.Vector2(0.72, 0.02), new THREE.Vector2(0.98, 0.13), new THREE.Vector2(1.04, 0.15)], 56), []);
}
function useCupGeo() {
  return useMemo(() => new THREE.LatheGeometry(
    [new THREE.Vector2(0.02, 0), new THREE.Vector2(0.34, 0), new THREE.Vector2(0.44, 0.8)], 44), []);
}

function Leaf({ position, scale = 1, speed = 1, phase = 0 }) {
  const ref = useRef();
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.35, 0.35, 0, 0.8);
    s.quadraticCurveTo(-0.35, 0.35, 0, 0);
    return s;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.45;
    ref.current.rotation.y = t * 0.35;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={LEAF} roughness={0.8} side={DS} />
    </mesh>
  );
}

/* 3 bolmeli tabldot: govde + bolme cizgileri */
function Tray(props) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[1.5, 1.15, 0.14]} />
        <meshStandardMaterial color={FIBER} roughness={0.95} />
      </mesh>
      {/* kenar cercevesi */}
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[1.38, 1.03, 0.02]} />
        <meshStandardMaterial color={BONE} roughness={0.95} />
      </mesh>
      {/* bolmeler */}
      <mesh position={[0, 0.18, 0.085]}>
        <boxGeometry args={[1.3, 0.045, 0.02]} />
        <meshStandardMaterial color={FIBER} roughness={0.95} />
      </mesh>
      <mesh position={[0.02, 0.45, 0.085]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.5, 0.045, 0.02]} />
        <meshStandardMaterial color={FIBER} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ahsap catal */
function Fork(props) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[0.09, 0.62, 0.03]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {[-0.028, 0, 0.028].map((x) => (
        <mesh key={x} position={[x, 0.38, 0]}>
          <boxGeometry args={[0.022, 0.16, 0.03]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ reduce }) {
  const bowl = useBowlGeo();
  const plate = usePlateGeo();
  const cup = useCupGeo();
  const group = useRef();

  useFrame(({ pointer, clock }) => {
    if (!group.current || reduce) return;
    // parallax: sahne farenin tersine hafif kayar (kamera cevresinde gezinme hissi)
    group.current.rotation.y += (pointer.x * 0.16 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-pointer.y * 0.06 - group.current.rotation.x) * 0.04;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <group ref={group}>
      {/* duvar + zemin + yesil daire spot */}
      <mesh position={[0, 0.4, -2.4]}>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[0.55, 0.75, -2.35]}>
        <circleGeometry args={[1.9, 64]} />
        <meshStandardMaterial color={CIRCLE} roughness={1} />
      </mesh>
      <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={FLOOR} roughness={1} />
      </mesh>

      {/* mermer kaideler */}
      <mesh position={[0.1, -1.36, 0.1]}>
        <boxGeometry args={[4.2, 0.52, 2.2]} />
        <meshStandardMaterial color={MARBLE} roughness={0.9} />
      </mesh>
      <mesh position={[-1.05, -0.88, -0.15]}>
        <boxGeometry args={[1.7, 0.44, 1.5]} />
        <meshStandardMaterial color={MARBLE} roughness={0.9} />
      </mesh>
      <Shadow position={[0.1, -1.09, 0.62]} scale={2.6} opacity={0.5} />

      {/* kase + kraft kapak (yuksek kaidede) */}
      <group position={[-1.05, -0.66, -0.1]}>
        <Shadow position={[0, 0.005, 0]} scale={1.25} />
        <mesh geometry={bowl}>
          <meshStandardMaterial color={BONE} roughness={0.92} side={DS} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.9, 0.86, 0.1, 56]} />
          <meshStandardMaterial color={KRAFT} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.035, 56]} />
          <meshStandardMaterial color={"#BE9C6F"} roughness={0.85} />
        </mesh>
      </group>

      {/* yaslanmis tabldot + tabak (arka sag) */}
      <Tray position={[1.35, -0.5, -0.75]} rotation={[-0.16, -0.28, 0.02]} />
      <mesh geometry={plate} position={[0.25, -1.06, -0.85]} rotation={[Math.PI / 2 - 0.22, 0, -0.15]} scale={0.9}>
        <meshStandardMaterial color={BONE} roughness={0.92} side={DS} />
      </mesh>

      {/* bardak + pipet (on sag) */}
      <group position={[1.5, -1.1, 0.55]}>
        <Shadow position={[0, 0.006, 0]} scale={0.8} />
        <mesh geometry={cup}>
          <meshStandardMaterial color={BONE} roughness={0.88} side={DS} />
        </mesh>
        <mesh position={[-0.07, 0.62, 0.02]} rotation={[0, 0, 0.24]}>
          <cylinderGeometry args={[0.035, 0.035, 1.15, 14]} />
          <meshStandardMaterial color={GREEN} roughness={0.6} />
        </mesh>
      </group>

      {/* sos kabi + catal (on) */}
      <mesh geometry={cup} position={[0.35, -1.1, 0.75]} scale={0.45}>
        <meshStandardMaterial color={FIBER} roughness={0.9} side={DS} />
      </mesh>
      <Fork position={[-0.35, -1.078, 0.85]} rotation={[-Math.PI / 2, 0, 0.5]} />
      <Shadow position={[-0.35, -1.09, 0.85]} scale={0.55} opacity={0.6} />

      {/* yapraklar */}
      <Leaf position={[-2, 0.9, -1.2]} scale={0.4} speed={0.8} phase={0} />
      <Leaf position={[2.2, 1.3, -1.6]} scale={0.3} speed={1.1} phase={2} />
      <Leaf position={[0.4, 1.7, -1]} scale={0.26} speed={0.65} phase={4} />
    </group>
  );
}

export default function Hero3D({ reduce = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 5.4], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      aria-label="3B stüdyo sahnesi: mermer kaidede kraft kapaklı kase, tabldot, bardak ve ahşap çatal"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 3]} intensity={1.25} color="#FFF6E4" />
      <directionalLight position={[-6, 2, 2]} intensity={0.4} color="#EAF2E0" />
      <Scene reduce={reduce} />
    </Canvas>
  );
}
