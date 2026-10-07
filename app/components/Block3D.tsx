"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { usePageVisible, useReducedMotion } from "./hooks";
import { faceGrid, type BlockId } from "./voxel";

const TILT = 0.5;

// drag-to-spin with a little inertia; eases back to the resting tilt
class Spin {
  rx = TILT;
  ry = -0.7;
  vx = 0;
  vy = 0;
  active = false;
  lx = 0;
  ly = 0;
  down(x: number, y: number) {
    this.active = true;
    this.lx = x;
    this.ly = y;
  }
  move(x: number, y: number) {
    if (!this.active) return;
    this.vy = (x - this.lx) * 0.012;
    this.vx = (y - this.ly) * 0.012;
    this.ry += this.vy;
    this.rx = Math.max(-1.2, Math.min(1.2, this.rx + this.vx));
    this.lx = x;
    this.ly = y;
  }
  up() {
    this.active = false;
  }
  step(dt: number, idle: boolean) {
    if (this.active) return;
    this.vy *= 0.94;
    this.vx *= 0.9;
    this.ry += this.vy + (idle ? dt * 0.35 : 0);
    this.rx += this.vx + (TILT - this.rx) * 0.03;
  }
}

function texture(grid: string[][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 8;
  const g = c.getContext("2d")!;
  grid.forEach((row, j) =>
    row.forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(i, j, 1, 1);
    }),
  );
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Block({ id, spin, idle }: { id: BlockId; spin: Spin; idle: boolean }) {
  const ref = useRef<THREE.Group>(null);

  // box faces in three.js order: +x, -x, +y, -y, +z, -z
  const materials = useMemo(() => {
    const grids = [
      faceGrid(id, "side", false, "a"),
      faceGrid(id, "side", false, "b"),
      faceGrid(id, "top", false),
      faceGrid(id, "side", false, "c"),
      faceGrid(id, "front", false),
      faceGrid(id, "front", false, "back"),
    ];
    return grids.map((g) => new THREE.MeshLambertMaterial({ map: texture(g) }));
  }, [id]);

  useEffect(
    () => () =>
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      }),
    [materials],
  );

  useFrame((_, dt) => {
    spin.step(dt, idle);
    ref.current?.rotation.set(spin.rx, spin.ry, 0);
  });

  return (
    <group ref={ref}>
      <mesh material={materials}>
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      {/* inverted hull = chunky pixel outline */}
      <mesh scale={1.04}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#3a0d2b" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// big block in a project window: idles slowly, drag to spin it
export default function Block3D({ id, label }: { id: BlockId; label: string }) {
  const [spin] = useState(() => new Spin());
  const visible = usePageVisible();
  const reduced = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={label}
      className="size-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={(e) => {
        spin.down(e.clientX, e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => spin.move(e.clientX, e.clientY)}
      onPointerUp={() => spin.up()}
      onPointerCancel={() => spin.up()}
    >
      <Canvas
        dpr={[1, 2]}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 58 }}
        gl={{ antialias: false, alpha: true }}
        frameloop={visible ? "always" : "never"}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[1.5, 3, 4]} intensity={1.3} />
        <Block id={id} spin={spin} idle={!reduced} />
      </Canvas>
    </div>
  );
}
