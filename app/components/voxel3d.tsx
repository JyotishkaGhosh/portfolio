"use client";

import { Html } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import type * as THREE from "three";
import { play } from "./hooks";

// ✦ Shared building blocks for the blocky 3D characters (all original, all plain boxes)

export type V3 = [number, number, number];

export const PAL = {
  skin: "#f2c4a2",
  hair: "#2b1620",
  eye: "#2a0f22",
  blush: "#ff8fb8",
  mouth: "#a8325f",
  white: "#ffffff",
  shadow: "#3a0d2b",
};

export const damp = (cur: number, target: number, k: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-k * dt));

export function B({ p, s, c, r }: { p: V3; s: V3; c: string; r?: V3 }) {
  return (
    <mesh position={p} rotation={r}>
      <boxGeometry args={s} />
      <meshLambertMaterial color={c} />
    </mesh>
  );
}

// pixel speech bubble. Put it inside the speaker's head group: `at` is a point just above the head,
// projected through this canvas's camera every frame, so it follows the head wherever the canvas is.
// It renders into this canvas's own container (not the event source), so it lines up with the 3D view.
export function Bubble({ at, children }: { at: V3; children: ReactNode }) {
  const gl = useThree((s) => s.gl);
  const portal = useMemo(() => ({ current: gl.domElement.parentElement as HTMLElement }), [gl]);
  return (
    <Html position={at} portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
      <span className="speech">
        <span className="pop">{children}</span>
      </span>
    </Html>
  );
}

// big chibi head with a dot-eye face; hair goes in as children
export function Head({ eyes, children }: { eyes: Ref<THREE.Group>; children: ReactNode }) {
  return (
    <>
      <B p={[0, 0.29, 0]} s={[0.62, 0.54, 0.54]} c={PAL.skin} />
      <group ref={eyes} position={[0, 0.26, 0.275]}>
        <B p={[-0.13, 0, 0]} s={[0.07, 0.1, 0.02]} c={PAL.eye} />
        <B p={[0.13, 0, 0]} s={[0.07, 0.1, 0.02]} c={PAL.eye} />
        <B p={[-0.145, 0.025, 0.006]} s={[0.025, 0.025, 0.02]} c={PAL.white} />
        <B p={[0.115, 0.025, 0.006]} s={[0.025, 0.025, 0.02]} c={PAL.white} />
      </group>
      <B p={[-0.21, 0.17, 0.275]} s={[0.1, 0.05, 0.02]} c={PAL.blush} />
      <B p={[0.21, 0.17, 0.275]} s={[0.1, 0.05, 0.02]} c={PAL.blush} />
      <B p={[0, 0.15, 0.275]} s={[0.07, 0.03, 0.02]} c={PAL.mouth} />
      {children}
    </>
  );
}

// invisible hit box: hover with a mouse, tap on touch
export function Hit({
  p,
  s,
  onEnter,
  onLeave,
  onTap,
}: {
  p: V3;
  s: V3;
  onEnter: () => void;
  onLeave: () => void;
  onTap: (e: ThreeEvent<PointerEvent>) => void;
}) {
  return (
    <mesh
      position={p}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (e.pointerType === "mouse") onEnter();
      }}
      onPointerOut={(e) => e.pointerType === "mouse" && onLeave()}
      onPointerDown={onTap}
    >
      <boxGeometry args={s} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// hover (mouse) or a ~2s tap (touch, or anyone who prefers reduced motion) turns a gesture on
export function useGestures<W extends string>(names: readonly W[], reduced: boolean, sound: (w: W) => "hi" | "click") {
  const none = Object.fromEntries(names.map((n) => [n, false])) as Record<W, boolean>;
  const [hover, setHover] = useState(none);
  const [tapped, setTapped] = useState(none);
  const timers = useRef<Partial<Record<W, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values<ReturnType<typeof setTimeout> | undefined>(t).forEach((x) => clearTimeout(x));
  }, []);

  const on = Object.fromEntries(names.map((n) => [n, hover[n] || tapped[n]])) as Record<W, boolean>;

  return {
    on,
    busy: names.some((n) => on[n]),
    enter(w: W) {
      if (reduced) return;
      setHover((h) => ({ ...h, [w]: true }));
      play(sound(w));
    },
    leave(w: W) {
      setHover((h) => ({ ...h, [w]: false }));
    },
    tap(w: W, e: ThreeEvent<PointerEvent>) {
      if (e.pointerType === "mouse" && !reduced) return;
      clearTimeout(timers.current[w]);
      setTapped((x) => ({ ...x, [w]: true }));
      play(sound(w));
      timers.current[w] = setTimeout(() => setTapped((x) => ({ ...x, [w]: false })), 2000);
    },
  };
}
