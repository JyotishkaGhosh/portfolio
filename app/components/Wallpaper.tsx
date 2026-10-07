import type { CSSProperties } from "react";

// ---------- ground: one row of grass blocks with cherry-blossom block trees, drawn once ----------
const B = 40; // block size
const P = 4; // texture pixel: every block is a 10×10 pixel texture
const COLS = 80;
const TREE_H = 8 * 32 + 16; // room above the grass for the background trees and tufts
const H = TREE_H + B;
const VARIANTS = 4;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

// our own grass texture: green top with darker pixels, green drips, brown soil with a few pebbles
function grassTexture(v: number) {
  const r = rng(101 + v * 977);
  const px: { x: number; y: number; c: string }[] = [];
  const drip = Array.from({ length: 10 }, () => (r() < 0.55 ? 1 : 0) + (r() < 0.18 ? 1 : 0));
  for (let j = 0; j < 10; j++)
    for (let i = 0; i < 10; i++) {
      const n = r();
      let c: string;
      if (j < 2 || (j === 2 && drip[i] > 0) || (j === 3 && drip[i] > 1)) c = n < 0.18 ? "g2" : n < 0.3 ? "g3" : n < 0.55 ? "g1" : "g0";
      else c = n < 0.05 ? "pb" : n < 0.22 ? "s2" : n < 0.4 ? "s3" : n < 0.65 ? "s1" : "s0";
      if (i === 9 || j === 9) c = c.startsWith("g") ? "g2" : "s2"; // soft edge between blocks
      px.push({ x: i * P, y: j * P, c });
    }
  return px;
}

type R = { x: number; y: number; w: number; h: number; c: string };

// ---------- background cherry trees: grown from a seed, so no two look alike ----------
const TB = 32; // tree blocks are a little smaller than the grass: they stand further back
const BARK = ["#7a3b55", "#653047"];
const WHITE = "#fff2f8";

type TreeSpec = {
  x: number; // left edge of the trunk, px
  seed: number;
  trunk: number; // trunk height in blocks
  shape: "round" | "windswept";
  pinks: string[];
  whites: boolean;
  branch: boolean; // one side branch block on the trunk
  petalDelay: number;
};

// two different trees, unevenly spaced: a medium round light-pink one and a short wind-swept deep-pink one
const BG_TREES: TreeSpec[] = [
  { x: 296, seed: 11, trunk: 4, shape: "round", pinks: ["#f5a3c7", "#f7b8d4", "#f5a3c7"], whites: true, branch: false, petalDelay: 0 },
  { x: 712, seed: 29, trunk: 2, shape: "windswept", pinks: ["#c2407a", "#d65a92", "#e0679f"], whites: false, branch: true, petalDelay: 3.7 },
];

// canopy rows from the bottom up, as [first, last] block offsets from the trunk
const SHAPES = {
  round: [[-1, 1], [-2, 2], [-2, 2], [-1, 1]], // 3 tiers, widest in the middle
  windswept: [[-1, 2], [-1, 3], [0, 3], [1, 2]], // blown over to the right
} as const;

function growTree(t: TreeSpec) {
  const r = rng(t.seed * 7919);
  const blocks: { x: number; y: number; fill: string }[] = [];
  for (let k = 1; k <= t.trunk; k++) blocks.push({ x: t.x, y: TREE_H - k * TB, fill: BARK[k % 2] });
  if (t.branch) blocks.push({ x: t.x - TB, y: TREE_H - t.trunk * TB, fill: BARK[1] });
  const rows = SHAPES[t.shape];
  let missing = 0;
  rows.forEach(([a, b], i) => {
    const y = TREE_H - (t.trunk + 1 + i) * TB;
    for (let c = a; c <= b; c++) {
      const edge = c === a || c === b;
      // knock out a couple of edge blocks so the outline looks natural
      if (edge && missing < 2 && i !== 1 && r() < 0.45) {
        missing++;
        continue;
      }
      const hi = t.whites && i >= 2 && c <= 0 && r() < 0.3;
      blocks.push({ x: t.x + c * TB, y, fill: hi ? WHITE : t.pinks[Math.floor(r() * t.pinks.length)] });
    }
  });
  const canopyBottom = TREE_H - t.trunk * TB;
  const [a, b] = rows[0];
  const petals = [0, 1, 2].map((k) => ({
    x: t.x + (a + r() * (b - a + 1)) * TB,
    y: canopyBottom - 6,
    fall: t.trunk * TB + 6,
    delay: t.petalDelay + k * 2.9 + r() * 1.5,
    dur: 7 + r() * 3,
    color: t.pinks[k % t.pinks.length],
  }));
  return { blocks, petals };
}

const BG = BG_TREES.map(growTree);

function buildGround() {
  const tiles: { x: number; v: number }[] = [];
  const bits: R[] = []; // tufts and petals
  const trees: R[] = [];
  const r = rng(4242);
  for (let col = 0; col < COLS; col++) {
    const x = col * B;
    tiles.push({ x, v: Math.floor(r() * VARIANTS) });
    // grass tufts poking up
    const tufts = r() < 0.55 ? 1 + Math.floor(r() * 2) : 0;
    for (let k = 0; k < tufts; k++) {
      const tx = x + 4 + Math.floor(r() * 8) * P;
      const th = r() < 0.5 ? 2 : 3;
      bits.push({ x: tx, y: TREE_H - th * P, w: P, h: th * P, c: "g1" });
      bits.push({ x: tx - P, y: TREE_H - P, w: P, h: P, c: "g0" });
      if (r() < 0.5) bits.push({ x: tx + P, y: TREE_H - 2 * P, w: P, h: 2 * P, c: "g2" });
    }
    // a few fallen petals
    if (r() < 0.45) bits.push({ x: x + Math.floor(r() * 9) * P, y: TREE_H + Math.floor(r() * 2) * P, w: P, h: P, c: r() < 0.5 ? "pt0" : "pt1" });
    if (r() < 0.15) bits.push({ x: x + Math.floor(r() * 9) * P, y: TREE_H - P, w: P, h: P, c: "pt1" });
  }
  for (const t of BG) for (const k of t.blocks) trees.push({ x: k.x, y: k.y, w: TB, h: TB, c: k.fill });
  let dark = "";
  let light = "";
  for (const t of trees) {
    dark += `M${t.x + TB - 3} ${t.y}h3v${TB}h-3zM${t.x} ${t.y + TB - 3}h${TB - 3}v3h-${TB - 3}z`;
    light += `M${t.x} ${t.y}h${TB - 3}v3h-${TB - 3}zM${t.x} ${t.y + 3}h3v${TB - 6}h-3z`;
  }
  return { tiles, bits, trees, dark, light };
}

const GROUND = buildGround();

function Ground() {
  return (
    <svg width={COLS * B} height={H} viewBox={`0 0 ${COLS * B} ${H}`} shapeRendering="crispEdges" aria-hidden="true" className="absolute bottom-0 left-0 max-w-none">
      <defs>
        {Array.from({ length: VARIANTS }, (_, v) => (
          <pattern key={v} id={`grass-${v}`} patternUnits="userSpaceOnUse" width={B} height={B} y={TREE_H}>
            {grassTexture(v).map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={P} height={P} className={p.c} />
            ))}
          </pattern>
        ))}
      </defs>
      <g className="bg-trees">
        {GROUND.trees.map((t, i) => (
          <rect key={`t${i}`} x={t.x} y={t.y} width={t.w} height={t.h} fill={t.c} />
        ))}
        <path d={GROUND.dark} className="bv-d" />
        <path d={GROUND.light} className="bv-l" />
      </g>
      {GROUND.tiles.map((t) => (
        <rect key={t.x} x={t.x} y={TREE_H} width={B} height={B} fill={`url(#grass-${t.v})`} />
      ))}
      {GROUND.bits.map((b, i) => (
        <rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} className={b.c} />
      ))}
    </svg>
  );
}

// ---------- clouds ----------
const CLOUDS = [
  { top: 60, scale: 1, start: 0.04, dur: 160 },
  { top: 110, scale: 0.8, start: 0.42, dur: 210 },
  { top: 40, scale: 1.1, start: 0.68, dur: 180 },
  { top: 170, scale: 0.7, start: 0.86, dur: 240 },
  { top: 190, scale: 0.6, start: 0.25, dur: 260 },
];

function Cloud({ top, scale, start, dur }: (typeof CLOUDS)[number]) {
  const u = 16 * scale;
  const style = {
    top,
    "--dur": `${dur}s`,
    "--delay": `${-start * dur}s`,
    "--rest": `${start * 100}vw`,
  } as CSSProperties;
  return (
    <div className="cloud absolute left-0" style={style}>
      <div className="cloud-a absolute" style={{ left: u * 2, top: 0, width: u * 5, height: u * 2 }} />
      <div className="cloud-a absolute" style={{ left: 0, top: u * 2, width: u * 10, height: u * 2 }} />
      <div className="cloud-b absolute" style={{ left: u, top: u * 4, width: u * 8, height: u }} />
    </div>
  );
}

const STARS = [
  [8, 6], [17, 22], [29, 9], [38, 30], [47, 14], [56, 4], [63, 26], [72, 12], [81, 33], [90, 7], [95, 24], [12, 38], [52, 40],
];

export default function Wallpaper() {
  return (
    <div className="sky fixed inset-0 overflow-hidden pixelated" aria-hidden="true">
      {STARS.map(([x, y], i) => (
        <div key={i} className="star absolute" style={{ left: `${x}%`, top: `${y}%`, width: 4, height: 4, animationDelay: `${i * 0.37}s` }} />
      ))}
      {/* phones: a small sun/moon in the status bar (desktop draws SkyBody above everything instead) */}
      <div className="sun min-[700px]:hidden" />
      {CLOUDS.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
      <div className="absolute inset-x-0 bottom-0 min-[700px]:bottom-24" style={{ height: H }}>
        <Ground />
        {/* a few petals drift down from each background tree, at different times */}
        {BG.flatMap((t, i) =>
          t.petals.map((p, k) => (
            <span
              key={`${i}-${k}`}
              className="bg-petal absolute size-1"
              style={{ left: p.x, top: p.y, background: p.color, "--fall": `${p.fall}px`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` } as CSSProperties}
            />
          )),
        )}
      </div>
    </div>
  );
}
