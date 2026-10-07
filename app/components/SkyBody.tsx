// ✦ The sun (pink day) and the moon (plum night), high in the sky at ~65% from the left.
// It's drawn above icons, windows and clouds (pointer-events off) so nothing can ever cover it,
// and it crossfades when the theme switches. Phones use the small status-bar sun in Wallpaper.

const G = 24; // 24×24 pixel grid, 4px per pixel → 96px including the glow ring
const C = 11.5;

function disc(test: (d: number, x: number, y: number) => string | null) {
  const px: { x: number; y: number; c: string }[] = [];
  for (let y = 0; y < G; y++)
    for (let x = 0; x < G; x++) {
      const c = test(Math.hypot(x - C, y - C), x, y);
      if (c) px.push({ x, y, c });
    }
  return px;
}

// warm cream-yellow sun with a lighter middle and a two-step glow ring
const SUN = disc((d, x, y) => {
  if (d <= 5) return x + y < 22 ? "#fffbe6" : "#fff3c4";
  if (d <= 8) return d > 7.2 ? "#ffe39a" : "#fff3c4";
  if (d <= 9.6) return "rgba(255, 238, 170, .55)";
  if (d <= 11.4 && (x + y) % 2 === 0) return "rgba(255, 238, 170, .3)";
  return null;
});

// pale pink-white full moon with three craters and a soft pixel glow
const CRATERS = new Set(["8,8", "9,8", "8,9", "9,9", "14,12", "15,12", "14,13", "11,15", "12,15"]);
const MOON = disc((d, x, y) => {
  if (d <= 8) return CRATERS.has(`${x},${y}`) ? "#e3b3cc" : d > 7.2 ? "#f7dcea" : "#fff4fa";
  if (d <= 9.6) return "rgba(255, 214, 236, .35)";
  if (d <= 11.4 && (x + y) % 2 === 0) return "rgba(255, 214, 236, .16)";
  return null;
});

// twinkling stars around the moon (night only), in px relative to the 96px box
const STARS = [
  [-38, 10],
  [-22, 70],
  [118, 4],
  [132, 58],
  [104, 96],
  [-8, -14],
];

function Pixels({ px }: { px: { x: number; y: number; c: string }[] }) {
  return (
    <svg viewBox={`0 0 ${G} ${G}`} width={96} height={96} shapeRendering="crispEdges" className="absolute inset-0">
      {px.map((p) => (
        <rect key={`${p.x},${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={p.c} />
      ))}
    </svg>
  );
}

export default function SkyBody() {
  return (
    <div data-blocker aria-hidden="true" className="pointer-events-none fixed left-[calc(65%-48px)] top-[10vh] z-[65] size-24 max-[699px]:hidden">
      <div className="sky-sun absolute inset-0">
        <Pixels px={SUN} />
      </div>
      <div className="sky-moon absolute inset-0">
        <Pixels px={MOON} />
        {STARS.map(([x, y], i) => (
          <span key={i} className="sky-twinkle absolute size-1 bg-candy-hi" style={{ left: x, top: y, animationDelay: `${i * 0.43}s` }} />
        ))}
      </div>
    </div>
  );
}
