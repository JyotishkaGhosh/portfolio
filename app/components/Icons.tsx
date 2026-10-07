"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { Cube } from "./Cube";
import { apps, desktopIcons, ui, type AppId } from "../content";
import { play } from "./hooks";

// arrow keys move through a grid of `cols` columns; returns the new index or null
export function arrowStep(key: string, i: number, n: number, cols: number) {
  const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[key];
  if (step === undefined) return null;
  return Math.min(n - 1, Math.max(0, i + step));
}

// every icon (block + label) is one W×H rectangle
const W = 120;
const H = 102;
const PAD = 16;
const ROW_GAP = 6;
const COL_GAP = 24;
const SPACE = 4; // icons keep at least this much air between them

type Pos = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };

const hits = (a: Rect, b: Rect) => a.x < b.x + b.w + SPACE && a.x + a.w + SPACE > b.x && a.y < b.y + b.h + SPACE && a.y + a.h + SPACE > b.y;
const dist = (a: Pos, b: Pos) => Math.hypot(a.x - b.x, a.y - b.y);

type Props = { onOpen: (id: AppId) => void; surfaceRef: RefObject<HTMLUListElement | null> };

// free-form desktop: drop an icon anywhere; it only gets nudged if it would overlap another one
export default function DesktopIcons({ onOpen, surfaceRef }: Props) {
  // null = the default tidy column (CSS grid); the first drag pins every icon to pixels
  const [pos, setPos] = useState<Pos[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [cursor, setCursor] = useState(0);
  const [drag, setDrag] = useState<{ i: number; p: Pos; blocked: boolean } | null>(null);
  const [box, setBox] = useState<Rect | null>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ i: number; sx: number; sy: number; start: Pos; moved: boolean; touch: boolean; ctrl: boolean } | null>(null);
  const marquee = useRef<{ sx: number; sy: number; origin: DOMRect } | null>(null);

  const domPositions = (): Pos[] => items.current.map((el) => ({ x: el?.offsetLeft ?? 0, y: el?.offsetTop ?? 0 }));

  // the desktop's bounds plus everything an icon may not cover: other icons, the girl + kitty, the tree
  function world(skip: number, placed: Pos[]) {
    const s = surfaceRef.current;
    const bw = s?.clientWidth ?? 1000;
    const bh = s?.clientHeight ?? 700;
    const sr = s?.getBoundingClientRect();
    const solid: Rect[] = placed.filter((_, k) => k !== skip).map((p) => ({ ...p, w: W, h: H }));
    if (sr)
      document.querySelectorAll<HTMLElement>("[data-blocker]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0) solid.push({ x: r.left - sr.left - SPACE, y: r.top - sr.top - SPACE, w: r.width, h: r.height });
      });
    const clamp = (p: Pos): Pos => ({ x: Math.round(Math.min(bw - W, Math.max(0, p.x))), y: Math.round(Math.min(bh - H, Math.max(0, p.y))) });
    const free = (p: Pos) => !solid.some((r) => hits({ ...p, w: W, h: H }, r));
    return { solid, clamp, free };
  }

  // drop: keep the exact spot if it's free; otherwise push out the shortest way back toward where it came from
  function settle(i: number, want: Pos, start: Pos, placed: Pos[]): Pos {
    const { solid, clamp, free } = world(i, placed);
    const p = clamp(want);
    if (free(p)) return p;
    const len = dist(p, start);
    const dir = len > 0 ? { x: (p.x - start.x) / len, y: (p.y - start.y) / len } : { x: 0, y: -1 };
    const cands: Pos[] = [];
    // along the path back toward the start (the start itself was free, so this always finds a spot)
    for (let t = 1; t <= len; t += 1) {
      const q = clamp({ x: p.x - dir.x * t, y: p.y - dir.y * t });
      if (free(q)) {
        cands.push(q);
        break;
      }
    }
    // straight push out of each overlapped rectangle, when that also points back the way it came
    for (const r of solid) {
      if (!hits({ ...p, w: W, h: H }, r)) continue;
      for (const q of [
        { x: r.x - W - SPACE, y: p.y },
        { x: r.x + r.w + SPACE, y: p.y },
        { x: p.x, y: r.y - H - SPACE },
        { x: p.x, y: r.y + r.h + SPACE },
      ].map(clamp)) {
        const back = (q.x - p.x) * -dir.x + (q.y - p.y) * -dir.y;
        if (free(q) && back >= 0) cands.push(q);
      }
    }
    if (!cands.length) return clamp(start);
    return cands.reduce((a, b) => (dist(b, p) < dist(a, p) ? b : a));
  }

  // nearest free spot around p (used after a resize), searching outward in small rings
  function nearestFree(i: number, p: Pos, placed: Pos[]): Pos {
    const { clamp, free } = world(i, placed);
    const c = clamp(p);
    if (free(c)) return c;
    for (let d = 8; d < 3000; d += 8)
      for (let a = 0; a < 16; a++) {
        const q = clamp({ x: c.x + Math.cos((a / 16) * Math.PI * 2) * d, y: c.y + Math.sin((a / 16) * Math.PI * 2) * d });
        if (free(q)) return q;
      }
    return c;
  }

  // window resized: pull icons back inside and untangle any overlaps (earlier icons keep their spot)
  const onResize = useEffectEvent(() => {
    if (!pos) return; // the default column reflows on its own
    const placed: Pos[] = [];
    let changed = false;
    const fixed = pos.map((p, i) => {
      const q = nearestFree(i, p, placed);
      if (q.x !== p.x || q.y !== p.y) changed = true;
      placed.push(q);
      return q;
    });
    if (changed) setPos(fixed);
  });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, i: number) {
    if (e.button !== 0) return;
    e.stopPropagation();
    const li = items.current[i];
    gesture.current = {
      i,
      sx: e.clientX,
      sy: e.clientY,
      start: { x: li?.offsetLeft ?? 0, y: li?.offsetTop ?? 0 },
      moved: false,
      touch: e.pointerType !== "mouse",
      ctrl: e.ctrlKey || e.metaKey,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) < 6) return;
    const placed = pos ?? domPositions();
    if (!g.moved) {
      g.moved = true;
      setSelected(new Set([g.i]));
      if (!pos) setPos(placed);
    }
    const { clamp, free } = world(g.i, placed);
    const p = clamp({ x: g.start.x + dx, y: g.start.y + dy });
    setDrag({ i: g.i, p, blocked: !free(p) });
  }
  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (g.moved) {
      const placed = pos ?? domPositions();
      const p = settle(g.i, { x: g.start.x + e.clientX - g.sx, y: g.start.y + e.clientY - g.sy }, g.start, placed);
      setPos(placed.map((q, k) => (k === g.i ? p : q)));
      setDrag(null);
      return;
    }
    if (g.touch) {
      onOpen(desktopIcons[g.i]);
      return;
    }
    play("click");
    setSelected((s) => {
      if (!g.ctrl) return new Set([g.i]);
      const n = new Set(s);
      if (n.has(g.i)) n.delete(g.i);
      else n.add(g.i);
      return n;
    });
  }

  // empty desktop: a click clears the selection, click-and-drag draws a selection box
  function onSurfaceDown(e: React.PointerEvent<HTMLUListElement>) {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setSelected(new Set());
    const origin = e.currentTarget.getBoundingClientRect();
    marquee.current = { sx: e.clientX, sy: e.clientY, origin };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onSurfaceMove(e: React.PointerEvent<HTMLUListElement>) {
    const m = marquee.current;
    if (!m) return;
    const r = { x: Math.min(m.sx, e.clientX), y: Math.min(m.sy, e.clientY), w: Math.abs(e.clientX - m.sx), h: Math.abs(e.clientY - m.sy) };
    if (r.w < 3 && r.h < 3) return;
    setBox({ x: r.x - m.origin.left, y: r.y - m.origin.top, w: r.w, h: r.h });
    const hit = new Set<number>();
    buttons.current.forEach((b, k) => {
      const br = b?.getBoundingClientRect();
      if (br && r.x < br.right && r.x + r.w > br.left && r.y < br.bottom && r.y + r.h > br.top) hit.add(k);
    });
    setSelected(hit);
  }
  function onSurfaceUp() {
    marquee.current = null;
    setBox(null);
  }

  // arrow keys jump to the nearest icon in that direction
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(desktopIcons[i]);
      return;
    }
    const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
    if (!dir) return;
    e.preventDefault();
    const from = buttons.current[i]?.getBoundingClientRect();
    if (!from) return;
    let best = -1;
    let bestD = Infinity;
    buttons.current.forEach((b, k) => {
      if (!b || k === i) return;
      const r = b.getBoundingClientRect();
      const vx = r.left - from.left;
      const vy = r.top - from.top;
      const along = vx * dir[0] + vy * dir[1];
      if (along <= 4) return;
      const d = along + Math.abs(vx * dir[1] + vy * dir[0]) * 3;
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    });
    if (best >= 0) {
      setCursor(best);
      setSelected(new Set([best]));
      buttons.current[best]?.focus();
    }
  }

  const gridStyle: CSSProperties = pos
    ? {}
    : {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateRows: `repeat(auto-fill, ${H}px)`,
        gridAutoColumns: `${W}px`,
        rowGap: ROW_GAP,
        columnGap: COL_GAP,
        padding: PAD,
        alignContent: "start",
      };

  return (
    <ul
      ref={surfaceRef}
      aria-label={ui.desktopLabel}
      onPointerDown={onSurfaceDown}
      onPointerMove={onSurfaceMove}
      onPointerUp={onSurfaceUp}
      onPointerCancel={onSurfaceUp}
      className="absolute inset-0 touch-none select-none"
      style={gridStyle}
    >
      {desktopIcons.map((id, i) => {
        const dragging = drag?.i === i;
        const p = dragging ? drag.p : pos?.[i];
        const style: CSSProperties = p
          ? { position: "absolute", left: p.x, top: p.y, width: W, height: H, zIndex: dragging ? 10 : undefined }
          : { width: W, height: H };
        return (
          <li
            key={id}
            ref={(el) => {
              items.current[i] = el;
            }}
            style={style}
          >
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              aria-pressed={selected.has(i)}
              tabIndex={cursor === i ? 0 : -1}
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                gesture.current = null;
                setDrag(null);
              }}
              onDoubleClick={() => onOpen(id)}
              onClick={(e) => e.detail === 0 && onOpen(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onFocus={() => setCursor(i)}
              className={`vx-icon desk-icon flex size-full flex-col items-center justify-start pt-1 ${dragging ? `dragging cursor-grabbing ${drag.blocked ? "blocked" : ""}` : ""}`}
            >
              <span className="vx-art block">
                <Cube id={id} size={64} />
              </span>
              <span className="icon-label mt-1">{apps[id].label}</span>
            </button>
          </li>
        );
      })}
      {box && <li aria-hidden="true" className="marquee pointer-events-none absolute" style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />}
    </ul>
  );
}
