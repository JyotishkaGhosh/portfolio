"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { Cube } from "./Cube";
import { setSfx, useClock, useSfx, useTheme } from "./hooks";
import type { BlockId } from "./voxel";
import { ui } from "../content";

export type Slot = { id: string; icon: BlockId; label: string; open: boolean };
export type MenuAction = "about" | "projects" | "resume" | "contact" | "theme";

type Props = {
  slots: Slot[];
  activeId: string | null;
  onSlot: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onMenu: (a: MenuAction) => void;
};

function StartMenu({ onMenu, close }: { onMenu: (a: MenuAction) => void; close: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const onAway = useEffectEvent((e: PointerEvent) => {
    if (!ref.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-start]")) close();
  });

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    document.addEventListener("pointerdown", onAway);
    return () => document.removeEventListener("pointerdown", onAway);
  }, []);

  const items: { a: MenuAction; icon: BlockId; label: string }[] = [
    { a: "about", icon: "about", label: ui.startMenu.about },
    { a: "projects", icon: "projects", label: ui.startMenu.projects },
    { a: "resume", icon: "resume", label: ui.startMenu.resume },
    { a: "contact", icon: "sayhi", label: ui.startMenu.contact },
  ];

  return (
    <nav ref={ref} id="start-menu" aria-label={ui.startMenuTitle} className="win menu-in absolute bottom-[calc(100%+18px)] left-0 w-[230px]">
      <p className="win-bar px-3 py-2 font-px text-xs">{ui.startMenuTitle}</p>
      <div className="flex flex-col p-2">
        {items.map((it) => (
          <button
            key={it.a}
            type="button"
            onClick={() => onMenu(it.a)}
            className="flex items-center gap-3 px-2 py-1.5 text-left font-pixel text-lg font-bold text-ink hover:bg-petal focus-visible:bg-petal"
          >
            <Cube id={it.icon} size={28} />
            {it.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onMenu("theme")}
          className="mt-1 flex items-center gap-3 border-t-4 border-line px-2 pb-1.5 pt-2.5 text-left font-pixel text-lg font-bold text-ink hover:bg-petal focus-visible:bg-petal"
        >
          <span className="grid size-7 place-items-center text-xl" aria-hidden="true">
            {theme === "dark" ? "☾" : "☀"}
          </span>
          {ui.startMenu.theme}: {theme === "dark" ? ui.themeNight : ui.themeDay}
        </button>
      </div>
    </nav>
  );
}

export default function Taskbar({ slots, activeId, onSlot, menuOpen, setMenuOpen, onMenu }: Props) {
  const { theme, toggle } = useTheme();
  const sfx = useSfx();
  const clock = useClock();

  return (
    <footer className="taskbar absolute inset-x-0 bottom-0 z-[50] flex h-24 items-center justify-between gap-4 px-6 font-px max-[699px]:hidden">
      <div className="flex shrink-0 flex-col items-start gap-1 text-[13px] min-[1000px]:w-32">
        <button type="button" onClick={toggle} aria-label={`${ui.themeLabel}: ${theme === "dark" ? ui.themeNight : ui.themeDay}`} className="hover:text-snow">
          {theme === "dark" ? "☾" : "☀"} <span className="max-[999px]:sr-only">{theme === "dark" ? ui.themeNight : ui.themeDay}</span>
        </button>
        <button type="button" onClick={() => setSfx(!sfx)} aria-pressed={sfx} className="opacity-80 hover:text-snow hover:opacity-100">
          {sfx ? "🔊" : "🔈"} <span className="max-[999px]:sr-only">{sfx ? ui.sfxOn : ui.sfxOff}</span>
        </button>
      </div>

      <div className="relative flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          data-start
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? "start-menu" : undefined}
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-btn h-14 shrink-0 px-4 text-[22px]"
        >
          {ui.startLabel}
        </button>
        {menuOpen && <StartMenu onMenu={onMenu} close={() => setMenuOpen(false)} />}
        <nav aria-label={ui.hotbarLabel} className="hotbar flex min-w-0 gap-1.5 p-1.5">
          {slots.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSlot(s.id)}
                aria-label={s.label}
                aria-current={activeId === s.id ? "true" : undefined}
                title={s.label}
                className={`hot-slot relative grid size-[clamp(36px,4.6vw,56px)] place-items-center ${activeId === s.id ? "active" : ""}`}
              >
                <Cube id={s.icon} size={40} className="size-[70%]" />
                {s.open && <span className="absolute bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 bg-hot shadow-[0_0_0_1px_var(--color-night)]" />}
              </button>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <p className="text-right text-[10px] leading-snug opacity-75">
          {ui.footer.made}
          <span className="max-[1279px]:hidden"> · </span>
          <span className="max-[1279px]:block">{ui.footer.rights}</span>
        </p>
        <div className="text-right">
          <p className="text-lg leading-tight" suppressHydrationWarning>
            {clock}
          </p>
          <p className="text-xs whitespace-nowrap opacity-70">{ui.clockPlace}</p>
        </div>
      </div>
    </footer>
  );
}
