"use client";
// "✦ decorate": visitors pick a sticker and click anywhere to drop it. Client-only, nothing is saved.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bow, Heart, Sparkle } from "./Decor";

type Kind = "sparkle" | "bow" | "heart";
type Sticker = { id: number; kind: Kind; x: number; y: number; rot: number; size: number; tint: string };

const MAX = 60;
const kinds: { id: Kind; label: string }[] = [
  { id: "sparkle", label: "Sparkle" },
  { id: "bow", label: "Bow" },
  { id: "heart", label: "Heart" },
];
const baseSize: Record<Kind, number> = { sparkle: 26, bow: 58, heart: 24 };
const tints = ["text-berry", "text-rose", "text-wine"];

function Art({ kind, size, className = "" }: { kind: Kind; size: number; className?: string }) {
  if (kind === "bow") return <Bow size={size} className={className} />;
  if (kind === "heart") return <Heart size={size} className={className} />;
  return <Sparkle size={size} className={className} />;
}

export default function Decorate() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const nextId = useRef(0);
  const reduce = useReducedMotion();

  // while a sticker is picked, every click on the page (pins and links included) drops it instead
  useEffect(() => {
    if (!open || !kind) return;
    const root = document.documentElement;
    root.classList.add("decorating");
    const place = (e: MouseEvent) => {
      if (e.button !== 0 || (e.target as Element | null)?.closest("[data-decor-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const s: Sticker = {
        id: nextId.current++,
        kind,
        x: e.pageX,
        y: e.pageY,
        rot: Math.random() * 50 - 25,
        size: Math.round(baseSize[kind] * (0.75 + Math.random() * 0.6)),
        tint: tints[Math.floor(Math.random() * tints.length)],
      };
      setStickers((list) => [...list, s].slice(-MAX));
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setKind(null);
    document.addEventListener("click", place, true);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", place, true);
      window.removeEventListener("keydown", esc);
      root.classList.remove("decorating");
    };
  }, [open, kind]);

  return (
    <>
      {/* stickers live in page coordinates, so they scroll with the board */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-[45]">
        {stickers.map((s) => (
          <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: s.x, top: s.y }}>
            <motion.div
              initial={reduce ? false : { scale: 0, rotate: s.rot - 40, opacity: 0 }}
              animate={{ scale: 1, rotate: s.rot, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 14 }}
              className="drop-shadow-[0_3px_4px_var(--pin-shadow)]"
            >
              <Art kind={s.kind} size={s.size} className={s.tint} />
            </motion.div>
          </div>
        ))}
      </div>

      <div data-decor-ui className="fixed bottom-4 right-4 z-[55] flex flex-col items-end gap-2 md:bottom-6 md:right-6">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-64 rounded-[1.4rem] bg-pearl p-4 shadow-[0_18px_40px_-14px_var(--pin-shadow)] ring-1 ring-petal"
            >
              <p className="font-script text-3xl leading-none text-berry">decorate my board</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {kinds.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    aria-pressed={kind === k.id}
                    onClick={() => setKind(kind === k.id ? null : k.id)}
                    className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition ${
                      kind === k.id ? "bg-ink text-pearl" : "bg-blush text-ink hover:bg-petal"
                    }`}
                  >
                    <Art kind={k.id} size={k.id === "bow" ? 34 : 20} className={kind === k.id ? "text-rose" : "text-berry"} />
                    {k.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-wine/80">
                {kind ? "Click anywhere to drop it ✦ Esc to stop" : "Pick one, then click anywhere on the page."}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStickers((l) => l.slice(0, -1))}
                  disabled={stickers.length === 0}
                  className="rounded-full bg-blush px-3.5 py-2 text-xs font-bold text-ink transition hover:bg-petal disabled:opacity-40"
                >
                  ↶ Undo
                </button>
                <button
                  type="button"
                  onClick={() => setStickers([])}
                  disabled={stickers.length === 0}
                  className="rounded-full bg-blush px-3.5 py-2 text-xs font-bold text-ink transition hover:bg-petal disabled:opacity-40"
                >
                  Clear all
                </button>
                <span className="ml-auto text-[11px] font-semibold text-wine/70">
                  {stickers.length}/{MAX}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            if (open) setKind(null);
            setOpen(!open);
          }}
          className="rounded-full bg-berry px-5 py-3 text-sm font-bold text-snow shadow-[0_10px_24px_-10px_var(--pin-shadow)] transition hover:bg-wine dark:hover:bg-rose dark:hover:text-paper"
        >
          {open ? "✓ done" : "✦ decorate"}
        </button>
      </div>
    </>
  );
}
