import { BLOCK_IDS, faceGrid, type BlockId, type Face } from "./voxel";

// face → affine map from the 8×8 unit grid onto the isometric cube (viewBox 0..100)
const FACES: { face: Face; m: string }[] = [
  { face: "top", m: "matrix(6.25 3.125 -6.25 3.125 50 0)" },
  { face: "front", m: "matrix(6.25 3.125 0 6.25 0 25)" },
  { face: "side", m: "matrix(6.25 -3.125 0 6.25 50 50)" },
];

function CubeSymbol({ id }: { id: BlockId }) {
  return (
    <symbol id={`vx-${id}`} viewBox="-3 -3 106 106">
      {FACES.map(({ face, m }) => (
        <g key={face} transform={m}>
          {faceGrid(id, face).map((row, j) =>
            row.map((c, i) => <rect key={`${i}-${j}`} x={i} y={j} width={1.06} height={1.06} fill={c} />),
          )}
        </g>
      ))}
      <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="#3a0d2b" strokeWidth={3.5} strokeLinejoin="miter" />
      <polyline points="0,25 50,50 100,25" fill="none" stroke="#3a0d2b" strokeOpacity={0.35} strokeWidth={2} />
      <line x1={50} y1={50} x2={50} y2={100} stroke="#3a0d2b" strokeOpacity={0.35} strokeWidth={2} />
    </symbol>
  );
}

// rendered once per page; every <Cube> points at these symbols
export function CubeDefs() {
  return (
    <svg width={0} height={0} aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        {BLOCK_IDS.map((id) => (
          <CubeSymbol key={id} id={id} />
        ))}
      </defs>
    </svg>
  );
}

export function Cube({ id, size, className }: { id: BlockId; size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className} focusable="false">
      <use href={`#vx-${id}`} width={100} height={100} />
    </svg>
  );
}

// flat 10×10 pixel sprites for the achievements grid
const PAL: Record<string, string> = {
  "#": "#3a0d2b",
  g: "#ffc94d",
  y: "#fff1b0",
  d: "#e0a020",
  p: "#ff6fb5",
  w: "#fff6fa",
};

export const BADGES = {
  trophy: [
    "..######..",
    "##yggggd##",
    "#.#yggd#.#",
    "#.#gggd#.#",
    ".##gggd##.",
    "...#gd#...",
    "....##....",
    "...#gd#...",
    "..#ggggd#.",
    "..#######.",
  ],
  medal: [
    "pp......pp",
    ".pp....pp.",
    "..pp..pp..",
    "...####...",
    "..#yygg#..",
    ".#yggggd#.",
    ".#ggyggd#.",
    ".#gggggd#.",
    "..#gddd#..",
    "...####...",
  ],
  star: [
    "....##....",
    "...#yg#...",
    "####yg####",
    "#yyggggdd#",
    ".#gggggd#.",
    "..#ggggd#.",
    ".#ggd#gd#.",
    "#gd#..#gd#",
    "###....###",
    "..........",
  ],
  scroll: [
    ".########.",
    "#wwwwwwww#",
    "#w#####ww#",
    "#wwwwwwww#",
    "#w######w#",
    "#wwwwwwww#",
    "#w####wpp#",
    "#wwwwwwpp#",
    ".#######p.",
    "........p.",
  ],
  gem: [
    "..######..",
    ".#ywpppp#.",
    "#ywpppppp#",
    "##########",
    ".#wppppp#.",
    "..#pppp#..",
    "...#pp#...",
    "....##....",
    "..........",
    "..........",
  ],
} as const;

export function Badge({ name, size }: { name: keyof typeof BADGES; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden="true">
      {BADGES[name].map((row, j) =>
        [...row].map((ch, i) => (ch === "." ? null : <rect key={`${i}-${j}`} x={i} y={j} width={1} height={1} fill={PAL[ch]} />)),
      )}
    </svg>
  );
}
