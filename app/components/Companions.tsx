"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { usePageVisible, useReducedMotion } from "./hooks";
import { B, Bubble, damp, Head, Hit, useGestures, type V3 } from "./voxel3d";
import { ui } from "../content";

// ✦ Two original blocky friends: Jyotishka and her kitty.
// Everything is plain boxes; all motion is a few sines, damped toward targets.


const C = {
  skin: "#f2c4a2",
  hair: "#2b1620",
  eye: "#2a0f22",
  blush: "#ff8fb8",
  mouth: "#a8325f",
  pink: "#ff7ab8",
  pinkDeep: "#e0559c",
  pinkLight: "#ffd1e6",
  bow: "#ff4fa3",
  cream: "#fff1e0",
  creamShade: "#f2dac2",
  white: "#ffffff",
  catPink: "#ff9ec7",
  shadow: "#3a0d2b",
};

const GIRL_X = -0.34;
const KITTY_X = 0.4;


// every so often (while nobody is hovered) she reaches over and pets the kitty
class PetClock {
  next = 5;
  until = -1;
  last = 0;
  tick(t: number, allowed: boolean) {
    // the canvas clock restarts at 0 when the tab comes back, so restart the schedule too
    if (t < this.last) {
      this.next = t + 5;
      this.until = -1;
    }
    this.last = t;
    if (!allowed) {
      this.until = -1;
      this.next = Math.max(this.next, t + 3);
      return;
    }
    if (t > this.next && t > this.until) {
      this.until = t + 2.8;
      this.next = t + 8 + Math.random() * 4;
    }
  }
  on(t: number) {
    return t < this.until;
  }
}

// ---------- the girl ----------
function Girl({ waving, kittyBusy, still, pet }: { waving: boolean; kittyBusy: boolean; still: boolean; pet: PetClock }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const st = useRef({ l: -0.12, r: 0.12, rx: 0, wx: 0, lean: 0, tilt: 0, sway: still ? 0 : 1, waveT: 0, was: false, blinkAt: 2.2, last: 0 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const s = st.current;
    if (t < s.last) s.blinkAt = s.waveT = 0; // clock restarted after the tab was hidden
    s.last = t;
    if (waving && !s.was) s.waveT = t;
    s.was = waving;

    pet.tick(t, !waving && !kittyBusy && !still);
    const petting = pet.on(t);

    // left (outer) arm waves; right arm reaches over to the kitty's head
    s.l = damp(s.l, waving ? -2.25 : -0.12, 9, dt);
    s.wx = damp(s.wx, waving ? 0.45 : 0, 9, dt);
    s.r = damp(s.r, petting ? 2.0 : 0.12, 6, dt);
    s.rx = damp(s.rx, petting ? 0.4 : 0, 6, dt); // hand comes forward, onto the top of the kitty's head
    s.lean = damp(s.lean, petting ? -0.17 : 0, 5, dt);
    s.tilt = damp(s.tilt, petting ? -0.12 : waving ? 0.1 : 0, 6, dt);
    s.sway = damp(s.sway, still || petting ? 0 : 1, 3, dt);

    const ph = (t - s.waveT) % 2.2;
    const osc = waving && ph < 1.35 ? Math.sin((ph / 1.35) * Math.PI * 6) * 0.32 : 0;
    const stroke = petting ? Math.sin(t * 7) * 0.09 : 0;

    armL.current?.rotation.set(s.wx, 0, s.l + osc);
    armR.current?.rotation.set(s.rx, 0, s.r + stroke);
    head.current?.rotation.set(0, 0, s.tilt + (waving && !still ? Math.sin(t * 7) * 0.04 : 0));
    root.current?.rotation.set(0, 0, s.lean + Math.sin(t * 0.9) * 0.04 * s.sway);
    root.current?.position.set(GIRL_X, ((1 - Math.cos(t * 1.8)) / 2) * 0.03 * s.sway, 0);

    if (!still && t > s.blinkAt + 0.13) s.blinkAt = t + 2.5 + Math.random() * 3;
    eyes.current?.scale.set(1, !still && t > s.blinkAt ? 0.15 : 1, 1);
  });

  return (
    <group ref={root} position={[GIRL_X, 0, 0]}>
      {/* legs + shoes */}
      <B p={[-0.09, 0.15, 0]} s={[0.15, 0.24, 0.16]} c={C.skin} />
      <B p={[0.09, 0.15, 0]} s={[0.15, 0.24, 0.16]} c={C.skin} />
      <B p={[-0.09, 0.03, 0.01]} s={[0.17, 0.06, 0.19]} c={C.pinkDeep} />
      <B p={[0.09, 0.03, 0.01]} s={[0.17, 0.06, 0.19]} c={C.pinkDeep} />

      {/* pink outfit */}
      <B p={[0, 0.49, 0]} s={[0.38, 0.2, 0.24]} c={C.pink} />
      <B p={[0, 0.33, 0]} s={[0.48, 0.16, 0.3]} c={C.pinkDeep} />
      <B p={[0, 0.41, 0.125]} s={[0.4, 0.04, 0.01]} c={C.pinkLight} />

      {/* arms pivot at the shoulders */}
      <group ref={armL} position={[-0.25, 0.57, 0]}>
        <B p={[0, -0.13, 0]} s={[0.11, 0.28, 0.12]} c={C.pink} />
        <B p={[0, -0.3, 0]} s={[0.1, 0.07, 0.11]} c={C.skin} />
      </group>
      <group ref={armR} position={[0.25, 0.57, 0]}>
        <B p={[0, -0.13, 0]} s={[0.11, 0.28, 0.12]} c={C.pink} />
        <B p={[0, -0.3, 0]} s={[0.1, 0.07, 0.11]} c={C.skin} />
      </group>

      {/* head */}
      <group ref={head} position={[0, 0.6, 0]}>
        <Head eyes={eyes}>
        {/* long dark hair */}
        <B p={[0, 0.6, 0]} s={[0.66, 0.12, 0.58]} c={C.hair} />
        <B p={[-0.12, 0.5, 0.275]} s={[0.42, 0.12, 0.05]} c={C.hair} />
        <B p={[0.22, 0.52, 0.275]} s={[0.2, 0.08, 0.05]} c={C.hair} />
        <B p={[-0.325, 0.33, 0]} s={[0.07, 0.56, 0.58]} c={C.hair} />
        <B p={[0.325, 0.33, 0]} s={[0.07, 0.56, 0.58]} c={C.hair} />
        <B p={[0, 0.17, -0.3]} s={[0.66, 0.88, 0.1]} c={C.hair} />
        <B p={[-0.3, 0.02, -0.12]} s={[0.1, 0.3, 0.3]} c={C.hair} />
        <B p={[0.3, 0.02, -0.12]} s={[0.1, 0.3, 0.3]} c={C.hair} />
        {/* little pink bow */}
        <group position={[0.2, 0.69, 0.08]}>
          <B p={[0, 0, 0]} s={[0.08, 0.08, 0.08]} c={C.bow} />
          <B p={[-0.1, 0.01, 0]} s={[0.13, 0.12, 0.07]} c={C.bow} r={[0, 0, 0.3]} />
          <B p={[0.1, 0.01, 0]} s={[0.13, 0.12, 0.07]} c={C.bow} r={[0, 0, -0.3]} />
          <B p={[-0.11, 0.03, 0.036]} s={[0.05, 0.04, 0.01]} c={C.pinkLight} />
        </group>
          {waving && <Bubble at={[0.16, 0.74, 0.1]}>{ui.companions.hi}</Bubble>}
        </Head>
      </group>
    </group>
  );
}

// ---------- the kitty ----------
const TAIL = 7;

function Kitty({ licking, still, pet }: { licking: boolean; still: boolean; pet: PetClock }) {
  const head = useRef<THREE.Group>(null);
  const paw = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tongue = useRef<THREE.Mesh>(null);
  const eyes = useRef<THREE.Group>(null);
  const tail = useRef<(THREE.Group | null)[]>([]);
  const st = useRef({ hx: 0, hy: 0, hz: 0, bz: 0, px: 0, blinkAt: 4.4, last: 0 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const s = st.current;
    if (t < s.last) s.blinkAt = 0; // clock restarted after the tab was hidden
    s.last = t;
    const petted = !licking && pet.on(t);
    // licking: head down to a raised paw · petted: leans up into her hand
    s.hx = damp(s.hx, licking ? 0.5 : petted ? -0.15 : 0, 7, dt);
    s.hy = damp(s.hy, licking ? 0.45 : 0, 7, dt);
    s.hz = damp(s.hz, licking ? -0.2 : petted ? 0.22 : 0, 7, dt);
    s.bz = damp(s.bz, petted ? 0.07 : 0, 5, dt);
    s.px = damp(s.px, licking ? -2.2 : 0, 8, dt);
    const lick = licking ? Math.sin(t * 9) : 0;
    const nuzzle = petted ? Math.sin(t * 7) * 0.05 : 0;
    head.current?.rotation.set(s.hx + lick * 0.07, s.hy, s.hz + nuzzle);
    paw.current?.rotation.set(s.px + lick * 0.08, 0, 0);
    if (tongue.current) tongue.current.visible = licking && lick > 0.1;
    body.current?.rotation.set(0, 0, s.bz);
    body.current?.scale.set(1, still ? 1 : 1 + Math.sin(t * 2) * 0.015, 1);

    tail.current.forEach((seg, i) => {
      if (!seg) return;
      const swish = still ? 0 : Math.sin(t * 2.3 - i * 0.55) * (0.22 + i * 0.03);
      seg.rotation.set(0, swish, 0.27);
    });

    if (!still && t > s.blinkAt + 0.13) s.blinkAt = t + 3 + Math.random() * 3;
    const blink = !still && t > s.blinkAt;
    eyes.current?.scale.set(1, licking || petted ? 0.35 : blink ? 0.15 : 1, 1);
  });

  // tail: a chain of nested segments, each bending a little more
  let chain: ReactNode = null;
  for (let i = TAIL - 1; i >= 0; i--) {
    const idx = i;
    chain = (
      <group
        ref={(el) => {
          tail.current[idx] = el;
        }}
        position={[i === 0 ? 0 : 0.1, 0, 0]}
      >
        <B p={[0.05, 0, 0]} s={[0.11, 0.075, 0.075]} c={i === TAIL - 1 ? C.creamShade : C.cream} />
        {chain}
      </group>
    );
  }

  return (
    <group position={[KITTY_X, 0, 0.05]} rotation={[0, -0.35, 0]}>
      <group ref={body}>
        <B p={[0, 0.2, -0.04]} s={[0.36, 0.34, 0.4]} c={C.cream} />
        <B p={[0, 0.22, 0.165]} s={[0.22, 0.22, 0.01]} c={C.white} />
        <B p={[-0.19, 0.08, -0.06]} s={[0.1, 0.16, 0.28]} c={C.creamShade} />
        <B p={[0.19, 0.08, -0.06]} s={[0.1, 0.16, 0.28]} c={C.creamShade} />
      </group>
      {/* paws: the right one lifts for a lick */}
      <B p={[-0.09, 0.08, 0.15]} s={[0.09, 0.16, 0.09]} c={C.cream} />
      <group ref={paw} position={[0.09, 0.17, 0.15]}>
        <B p={[0, -0.09, 0]} s={[0.09, 0.17, 0.09]} c={C.cream} />
        <B p={[0, -0.175, 0.03]} s={[0.07, 0.03, 0.04]} c={C.catPink} />
      </group>
      {/* tail */}
      <group position={[0.1, 0.06, -0.22]} rotation={[0, 0.7, 0]}>
        {chain}
      </group>
      {/* head */}
      <group ref={head} position={[0, 0.36, 0.05]}>
        <B p={[0, 0.16, 0.03]} s={[0.42, 0.33, 0.34]} c={C.cream} />
        <B p={[-0.13, 0.37, 0.03]} s={[0.1, 0.12, 0.08]} c={C.cream} />
        <B p={[0.13, 0.37, 0.03]} s={[0.1, 0.12, 0.08]} c={C.cream} />
        <B p={[-0.13, 0.36, 0.075]} s={[0.05, 0.07, 0.01]} c={C.catPink} />
        <B p={[0.13, 0.36, 0.075]} s={[0.05, 0.07, 0.01]} c={C.catPink} />
        <group ref={eyes} position={[0, 0.19, 0.205]}>
          <B p={[-0.09, 0, 0]} s={[0.05, 0.07, 0.02]} c={C.eye} />
          <B p={[0.09, 0, 0]} s={[0.05, 0.07, 0.02]} c={C.eye} />
        </group>
        <B p={[0, 0.12, 0.205]} s={[0.06, 0.04, 0.02]} c={C.catPink} />
        <B p={[-0.15, 0.11, 0.205]} s={[0.07, 0.035, 0.02]} c={C.blush} />
        <B p={[0.15, 0.11, 0.205]} s={[0.07, 0.035, 0.02]} c={C.blush} />
        <mesh ref={tongue} position={[0, 0.07, 0.215]} visible={false}>
          <boxGeometry args={[0.05, 0.05, 0.04]} />
          <meshLambertMaterial color={C.catPink} />
        </mesh>
        {licking && <Bubble at={[0.1, 0.46, 0.05]}>{ui.companions.kitty}</Bubble>}
      </group>
    </group>
  );
}

function Shadows() {
  return (
    <group position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[
        [GIRL_X, 0, 0.62, 0.42],
        [KITTY_X + 0.02, -0.05, 0.5, 0.5],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color={C.shadow} transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// centre of the pair (girl's left edge → tip of the kitty's tail)
const LOOK: V3 = [0.2, 0.8, 0];

function Camera() {
  const width = useThree((s) => s.size.width);
  return (
    <OrthographicCamera
      makeDefault
      position={[LOOK[0] + 1.2, LOOK[1] + 1.7, 9]}
      zoom={width / 2.35}
      onUpdate={(c) => c.lookAt(...LOOK)}
    />
  );
}

const WHO = ["girl", "kitty"] as const;

export default function Companions() {
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const [pet] = useState(() => new PetClock());
  const g = useGestures(WHO, reduced, (w) => (w === "kitty" ? "click" : "hi"));
  const on = g.on;
  const busy = g.busy;

  // reduced motion: draw on demand, but keep animating while a gesture plays out
  const frameloop = !visible ? "never" : reduced && !busy ? "demand" : "always";

  return (
    <div
      data-blocker
      role="img"
      aria-label={ui.companions.label}
      className={`fixed bottom-[120px] right-2 z-[15] h-[115px] w-[120px] min-[700px]:static min-[700px]:-mb-[30px] min-[700px]:h-[220px] min-[700px]:w-[230px] ${busy ? "cursor-pointer" : ""}`}
    >
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} frameloop={frameloop}>
        <Camera />
        <ambientLight intensity={1.7} />
        <directionalLight position={[2, 4, 5]} intensity={1.1} />
        <Girl waving={on.girl} kittyBusy={on.kitty} still={reduced} pet={pet} />
        <Kitty licking={on.kitty} still={reduced} pet={pet} />
        <Shadows />
        <Hit p={[GIRL_X, 0.75, 0]} s={[0.64, 1.5, 0.7]} onEnter={() => g.enter("girl")} onLeave={() => g.leave("girl")} onTap={(e) => g.tap("girl", e)} />
        <Hit p={[KITTY_X + 0.08, 0.4, 0]} s={[0.5, 0.85, 0.7]} onEnter={() => g.enter("kitty")} onLeave={() => g.leave("kitty")} onTap={(e) => g.tap("kitty", e)} />
      </Canvas>
    </div>
  );
}
