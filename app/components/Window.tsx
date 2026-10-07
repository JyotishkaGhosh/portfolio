"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Cube } from "./Cube";
import type { BlockId } from "./voxel";
import { ui } from "../content";

export type Pos = { x: number; y: number };

export type WinState = {
  id: string;
  z: number;
  min: boolean;
  max: boolean;
  pos: Pos | null; // null = default spot (centred in the free desktop area)
  focusOnOpen: boolean;
};

// free area to the right of the desktop icons
const ICON_COLUMN = 280;

type Props = {
  win: WinState;
  title: string;
  icon: BlockId;
  width: number;
  active: boolean;
  phone: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  onMove: (p: Pos) => void;
  after?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function Window({ win, title, icon, width, active, phone, onFocus, onClose, onMin, onMax, onMove, after, className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number; layer: DOMRect } | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (win.focusOnOpen) ref.current?.focus({ preventScroll: true });
  }, [win.focusOnOpen]);

  const w = `min(${width}px, calc(100% - 24px))`;
  let style: CSSProperties;
  if (win.max) style = { left: 0, top: 0, width: "100%", height: "100%" };
  else if (win.pos) style = { left: win.pos.x, top: win.pos.y, width: w, maxHeight: `calc(100% - ${win.pos.y}px - 12px)` };
  else
    style = {
      left: `max(12px, calc((100% + ${ICON_COLUMN}px - ${w}) / 2))`,
      top: "max(136px, calc(10vh + 100px))",
      width: w,
      maxHeight: "calc(100% - max(136px, calc(10vh + 100px)) - 46px)",
    };

  function startDrag(e: React.PointerEvent) {
    if (phone || win.max || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    const layer = el?.offsetParent?.getBoundingClientRect();
    if (!el || !layer) return;
    const r = el.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, layer };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function moveDrag(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const x = Math.round(Math.min(d.layer.width - 80, Math.max(80 - (ref.current?.offsetWidth ?? 0), e.clientX - d.layer.left - d.dx)));
    const y = Math.round(Math.min(d.layer.height - 44, Math.max(0, e.clientY - d.layer.top - d.dy)));
    onMove({ x, y });
  }
  function endDrag() {
    drag.current = null;
  }

  return (
    <section
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onPointerDownCapture={() => !active && onFocus()}
      onFocusCapture={() => !active && onFocus()}
      className={`win as-window pop absolute flex flex-col outline-none ${win.min ? "hidden" : ""} ${className}`}
      style={{ ...style, zIndex: 20 + win.z }}
    >
      <header
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) => !phone && !(e.target as HTMLElement).closest("button") && onMax()}
        className={`win-bar flex h-10 shrink-0 items-center gap-2.5 px-3 select-none touch-none ${phone || win.max ? "" : "cursor-grab active:cursor-grabbing"} ${active ? "" : "saturate-[.55]"}`}
      >
        <button type="button" onClick={onClose} className="px-btn alt sm min-[700px]:hidden" aria-label={ui.win.back}>
          ◀
        </button>
        <Cube id={icon} size={26} className="shrink-0" />
        <h2 id={titleId} className="truncate font-pixel text-lg font-bold sm:text-xl">
          {title}
        </h2>
        <div className="ml-auto flex gap-2 pr-0.5 max-[699px]:hidden">
          <button type="button" className="win-btn" onClick={onMin} aria-label={ui.win.minimise}>
            _
          </button>
          <button type="button" className="win-btn" onClick={onMax} aria-label={win.max ? ui.win.restore : ui.win.maximise}>
            {win.max ? "❐" : "□"}
          </button>
          <button type="button" className="win-btn" onClick={onClose} aria-label={ui.win.close}>
            ×
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      {after}
    </section>
  );
}
