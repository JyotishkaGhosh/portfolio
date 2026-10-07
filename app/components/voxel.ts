// ✦ Voxel blocks: palettes, 8×8 pixel sprites and the per-face colour grids.
// Grids are seeded by block id, so the server and the browser draw the same pixels.

export type Sprite = keyof typeof SPRITES;

// "#" = dark mark, "o" = light mark, "." = block texture
export const SPRITES = {
  heart: ["........", ".##..##.", "#oo##oo#", "#oooooo#", "#oooooo#", ".#oooo#.", "..#oo#..", "...##..."],
  chart: ["........", "......#.", ".....##.", "..#..##.", ".##.###.", ".##.###.", ".######.", "########"],
  search: ["..####..", ".#oooo#.", "#oo..oo#", "#o....o#", "#oo..oo#", ".#oooo##", "..####.#", "......##"],
  plane: ["...##...", "...##...", "..####..", "########", "###oo###", "...##...", "..####..", ".##..##."],
  star: ["...##...", "...##...", "#######.", ".#####..", "..####..", ".##..##.", "##....##", "........"],
  trophy: ["########", "#oooooo#", ".#oooo#.", "..#oo#..", "...##...", "...##...", "..####..", ".######."],
  scroll: [".######.", "#oooooo#", ".#.##.#.", ".#oooo#.", ".#.##.#.", ".#oooo#.", "#oooooo#", ".######."],
  mail: ["........", "########", "##oooo##", "#o#oo#o#", "#oo##oo#", "#oooooo#", "########", "........"],
  brief: ["..####..", "..#..#..", "########", "#oooooo#", "########", "#oo##oo#", "#oooooo#", "########"],
  folder: ["........", "###.....", "#oo#####", "#oooooo#", "########", "#oooooo#", "#oooooo#", "########"],
  grad: ["........", "...##...", ".######.", "########", ".######.", "..#oo#..", "..#oo#.#", ".......#"],
  spark: ["...#....", "...#....", "..###...", "#######.", "..###...", "...#....", "...#....", "........"],
} as const;

export type BlockId =
  | "welcome" | "about" | "projects" | "experience" | "achievements" | "education" | "resume" | "sayhi"
  | "kairo" | "signalstack" | "safar" | "matilda";

export const BLOCKS: Record<BlockId, { top: string; side: string; sprite: Sprite }> = {
  welcome: { top: "#ffd1e6", side: "#ff4fa3", sprite: "spark" },
  about: { top: "#ff9fcf", side: "#ff7ab8", sprite: "heart" },
  projects: { top: "#ffe58f", side: "#ff8cc6", sprite: "folder" },
  experience: { top: "#ffb3c7", side: "#c94f7c", sprite: "brief" },
  achievements: { top: "#ffe58f", side: "#f0a3c2", sprite: "trophy" },
  education: { top: "#e3c7ff", side: "#9b6ad8", sprite: "grad" },
  resume: { top: "#fff0f6", side: "#f3b0cc", sprite: "scroll" },
  sayhi: { top: "#ff8cc6", side: "#ff4fa3", sprite: "mail" },
  kairo: { top: "#ffd1e6", side: "#e85a9c", sprite: "chart" },
  signalstack: { top: "#f6b7ff", side: "#b65ad6", sprite: "search" },
  safar: { top: "#ffc7d9", side: "#f0789c", sprite: "plane" },
  matilda: { top: "#ffe2b8", side: "#f4a3b8", sprite: "star" },
};

export const BLOCK_IDS = Object.keys(BLOCKS) as BlockId[];

const MARK = "#3a0d2b";
const MARK_LIGHT = "#fff6fa";

export function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rng(key: string) {
  let s = 7;
  for (let i = 0; i < key.length; i++) s = (s * 31 + key.charCodeAt(i)) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export type Face = "top" | "front" | "side";

// 8×8 grid of colours for one face. `lit` bakes in the isometric light (SVG);
// the 3D block passes lit=false and lets the scene light do the shading.
export function faceGrid(id: BlockId, face: Face, lit = true, salt = ""): string[][] {
  const b = BLOCKS[id];
  const r = rng(id + face + salt);
  const sp = SPRITES[b.sprite];
  const grid: string[][] = [];
  for (let j = 0; j < 8; j++) {
    const row: string[] = [];
    for (let i = 0; i < 8; i++) {
      const noise = 0.9 + r() * 0.2;
      if (face === "top") row.push(shade(b.top, (lit ? 1.06 : 1) * noise));
      else if (face === "front" && sp[j][i] === "#") row.push(MARK);
      else if (face === "front" && sp[j][i] === "o") row.push(MARK_LIGHT);
      else row.push(shade(b.side, (lit ? (face === "front" ? 0.86 : 0.66) : 0.92) * noise));
    }
    grid.push(row);
  }
  return grid;
}
