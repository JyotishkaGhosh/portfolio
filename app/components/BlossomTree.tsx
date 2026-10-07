"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "./hooks";
import { ui } from "../content";

// ✦ A medium cherry-blossom block tree that stands on the grass at the right of the desktop.
// Pixel art on a 13×14 block grid: a curved, forked plum-brown trunk and a 3-tier canopy.

const U = 10; // one block in viewBox units
const COLS = 13;
const ROWS = 14;

const PINK = { deep: "#c2407a", mid: "#e0679f", light: "#f5a3c7", white: "#fff2f8" };
const BARK = { dark: "#4f2236", mid: "#66304a", light: "#7e3d5a" };

// canopy tiers: [row, firstCol, lastCol]; wider in the middle
const CANOPY: [number, number, number][] = [
  [1, 5, 7],
  [2, 4, 8], // top tier
  [3, 2, 10],
  [4, 1, 11],
  [5, 1, 11], // middle tier (widest)
  [6, 2, 10],
  [7, 3, 9], // bottom tier
];
const TIER_END = new Set([2, 5, 7]); // last row of each tier gets the deep shade → layered look
const HIGHLIGHTS = new Set(["5,1", "4,2", "3,3", "2,4", "4,3", "6,3"]); // white blocks, upper-left of each tier

// curved, forked trunk: [row, col, shade]
const TRUNK: [number, number, keyof typeof BARK][] = [
  [13, 4, "dark"], [13, 5, "mid"], [13, 6, "mid"], [13, 7, "dark"],
  [12, 5, "mid"], [12, 6, "light"],
  [11, 6, "mid"], [11, 7, "light"],
  [10, 6, "mid"], [10, 7, "dark"],
  [9, 6, "light"], [9, 5, "mid"], [9, 8, "dark"],
  [8, 4, "mid"], [8, 5, "light"], [8, 8, "mid"], [8, 9, "dark"],
];

function canopyColor(row: number, col: number) {
  if (HIGHLIGHTS.has(`${col},${row}`)) return PINK.white;
  if (TIER_END.has(row)) return (col + row) % 3 === 0 ? PINK.mid : PINK.deep;
  const n = (col * 7 + row * 3) % 5;
  // lighter toward the upper left, deeper toward the lower right
  const light = col < 6 && row < 5;
  return n === 0 ? PINK.deep : light || n === 1 ? PINK.light : PINK.mid;
}

// little flowers dotted over the canopy (white and hot pink), and a few fallen on the grass
const FLOWERS = CANOPY.flatMap(([r, a, b]) => {
  const out: { x: number; y: number; c: string }[] = [];
  for (let c = a; c <= b; c++) {
    const h = (c * 37 + r * 91) % 11;
    if (h < 4) out.push({ x: c * U + 2 + (h % 2) * 4, y: r * U + 2 + ((h >> 1) % 2) * 4, c: h % 3 === 0 ? "#ff4fa3" : PINK.white });
  }
  return out;
});
const GRASS_BLOSSOMS = [
  [18, "#ff4fa3"], [31, PINK.white], [44, PINK.light], [79, "#ff4fa3"], [92, PINK.white], [104, PINK.mid], [113, PINK.light],
] as const;

function Block({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <>
      <rect x={x} y={y} width={U} height={U} fill={c} />
      <rect x={x} y={y} width={U} height={1.5} fill="#fff" opacity={0.22} />
      <rect x={x + U - 1.5} y={y} width={1.5} height={U} fill="#3a0d2b" opacity={0.16} />
      <rect x={x} y={y + U - 1.5} width={U} height={1.5} fill="#3a0d2b" opacity={0.18} />
    </>
  );
}

// a handful of petals that keep falling and drifting left across the grass
const FALLING = [
  { x: 22, delay: 0, dur: 9 },
  { x: 48, delay: 2.4, dur: 11 },
  { x: 70, delay: 4.1, dur: 10 },
  { x: 35, delay: 6.3, dur: 12 },
  { x: 82, delay: 7.7, dur: 9.5 },
  { x: 58, delay: 9.2, dur: 11.5 },
];

type Burst = { id: number; petals: { dx: number; dy: number; c: string; d: number }[] };

export default function BlossomTree({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const last = useRef(0);

  // hover: a small burst of petals (at most one per second)
  function burst() {
    if (reduced) return;
    const now = performance.now();
    if (now - last.current < 1000) return;
    last.current = now;
    const id = now;
    const colors = [PINK.deep, PINK.mid, PINK.light, PINK.white];
    const petals = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const r = 40 + Math.random() * 50;
      return { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.7 + 30, c: colors[i % colors.length], d: 0.9 + Math.random() * 0.5 };
    });
    setBursts((b) => [...b, { id, petals }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1600);
  }

  return (
    <div data-blocker role="img" aria-label={ui.tree.label} className={`blossom-tree relative shrink-0 ${className}`} onPointerEnter={burst} onPointerDown={(e) => e.pointerType !== "mouse" && burst()}>
      <svg viewBox={`0 0 ${COLS * U} ${ROWS * U}`} className="block h-full w-auto overflow-visible" shapeRendering="crispEdges" aria-hidden="true">
        {TRUNK.map(([r, c, s]) => (
          <Block key={`t${r}-${c}`} x={c * U} y={r * U} c={BARK[s]} />
        ))}
        {/* canopy sways very slightly around the fork */}
        <g className={reduced ? "" : "tree-sway"} style={{ transformOrigin: `${6.5 * U}px ${9 * U}px`, transformBox: "view-box" }}>
          {CANOPY.flatMap(([r, a, b]) => {
            const out = [];
            for (let c = a; c <= b; c++) out.push(<Block key={`c${r}-${c}`} x={c * U} y={r * U} c={canopyColor(r, c)} />);
            return out;
          })}
          {FLOWERS.map((f, i) => (
            <g key={`f${i}`}>
              <rect x={f.x} y={f.y} width={3} height={3} fill={f.c} />
              <rect x={f.x + 1} y={f.y + 1} width={1} height={1} fill="#ffe58f" />
            </g>
          ))}
        </g>
        {/* blossoms fallen on the grass under the tree */}
        {GRASS_BLOSSOMS.map(([x, c], i) => (
          <rect key={`g${i}`} x={x} y={ROWS * U + 1 + (i % 2) * 2} width={2.5} height={2.5} fill={c} />
        ))}
      </svg>

      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {FALLING.map((p, i) => (
            <span
              key={i}
              className="petal-fall absolute size-1"
              style={{ left: `${p.x}%`, top: "45%", background: i % 2 ? PINK.light : PINK.mid, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` } as CSSProperties}
            />
          ))}
        </div>
      )}

      {bursts.map((b) => (
        <div key={b.id} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[35%]">
          {b.petals.map((p, i) => (
            <span
              key={i}
              className="petal-burst absolute size-1.5"
              style={{ background: p.c, "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, animationDuration: `${p.d}s` } as CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
