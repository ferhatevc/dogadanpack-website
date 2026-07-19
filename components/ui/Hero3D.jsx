"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Yaprağın Yolculuğu" — DoğadanPack 3D hero sahnesi.
 * Bagasse dokulu kase, tabak, bardak ve kağıt pipet; etrafında süzülen yapraklar.
 * Fare hareketiyle parallax, yavaş kendiliğinden dönüş.
 */

const FIBER = "#EDE9DC";
const BONE = "#F7F5EE";
const GREEN = "#1F3B13";
const LEAF = "#4C8A2E";
const MOSS = "#7BA05B";

/* ---- urun geometrileri (lathe) ---- */
function useBowlGeo() {
  return useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(Math.sin(t * Math.PI * 0.5) * 1.05, t * 0.72 - 0.05));
    }
    return new THREE.LatheGeometry(pts, 48);
  }, []);
}
function usePlateGeo() {
  return useMemo(() => {
    const pts = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.85, 0),
      new THREE.Vector2(1.1, 0.14),
      new THREE.Vector2(1.18, 0.16),
    ];
    return new THREE.LatheGeometry(pts, 48);
  }, []);
}
function useCupGeo() {
  return useMemo(() => {
    const pts = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.4, 0),
      new THREE.Vector2(0.52, 0.9),
    ];
    return new THREE.LatheGeometry(pts, 40);
  }, []);
}

const fiberMat = { color: FIBER, roughness: 0.92, metalness: 0 };

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
    ref.current.position.y = position[1] + Math.sin(t) * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.5;
    ref.current.rotation.y = t * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={LEAF} roughness={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Products({ reduce }) {
  const group = useRef();
  const bowl = useBowlGeo();
  const plate = usePlateGeo();
  const cup = useCupGeo();
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    target.current.x = pointer.x * 0.35;
    target.current.y = pointer.y * 0.2;
    const g = group.current;
    if (!reduce) {
      g.rotation.y += ((clock.elapsedTime * 0.12 + target.current.x) - g.rotation.y) * 0.05;
      g.rotation.x += ((-target.current.y) - g.rotation.x) * 0.05;
      g.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* tabak — zemin */}
      <mesh geometry={plate} position={[0, -0.9, 0]}>
        <meshStandardMaterial {...fiberMat} />
      </mesh>
      {/* kase — tabagin ustunde */}
      <mesh geometry={bowl} position={[0, -0.82, 0]}>
        <meshStandardMaterial {...fiberMat} />
      </mesh>
      {/* bardak — sagda */}
      <mesh geometry={cup} position={[1.7, -0.9, 0.3]}>
        <meshStandardMaterial color={BONE} roughness={0.85} />
      </mesh>
      {/* pipet — bardagin icinde */}
      <mesh position={[1.62, 0.05, 0.32]} rotation={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.045, 0.045, 1.6, 16]} />
        <meshStandardMaterial color={GREEN} roughness={0.6} />
      </mesh>
      {/* kucuk kase — solda */}
      <mesh geometry={bowl} position={[-1.8, -0.95, 0.2]} scale={0.55}>
        <meshStandardMaterial color={MOSS} roughness={0.9} />
      </mesh>
      {/* yapraklar */}
      <Leaf position={[-1.1, 0.9, -0.4]} scale={0.5} speed={0.9} phase={0} />
      <Leaf position={[1.2, 1.2, -0.6]} scale={0.4} speed={1.2} phase={2} />
      <Leaf position={[0.2, 1.5, 0.4]} scale={0.35} speed={0.7} phase={4} />
      <Leaf position={[-2, 0.4, 0.5]} scale={0.3} speed={1.1} phase={1} />
      <Leaf position={[2.2, 0.5, -0.2]} scale={0.45} speed={0.8} phase={3} />
    </group>
  );
}

export default function Hero3D({ reduce = false }) {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 5.6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      aria-label="3B ürün sahnesi: bagasse kase, tabak, bardak ve kağıt pipet"
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#FFF8E8" />
      <directionalLight position={[-5, 3, -3]} intensity={0.35} color="#DFF0D0" />
      <Products reduce={reduce} />
    </Canvas>
  );
}
