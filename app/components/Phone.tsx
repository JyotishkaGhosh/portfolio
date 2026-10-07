"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Cube } from "./Cube";
import { Monogram } from "./apps";
import { arrowStep } from "./Icons";
import { setSfx, useClock, useSfx, useTheme } from "./hooks";
import { apps, desktopIcons, me, phoneDock, ui, type AppId } from "../content";

// phone home screen: status bar, intro card, 3-column grid of blocks, 4-slot dock
export default function Phone({ onOpen, activeId }: { onOpen: (id: AppId) => void; activeId: string | null }) {
  const clock = useClock();
  const { theme, toggle } = useTheme();
  const sfx = useSfx();
  const [card, setCard] = useState(true);
  const [cursor, setCursor] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent, i: number) {
    const next = arrowStep(e.key, i, desktopIcons.length, 3);
    if (next === null) return;
    e.preventDefault();
    setCursor(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="relative min-h-dvh px-[18px] pb-[230px] min-[700px]:hidden">
      {/* status bar */}
      <div className="flex h-[38px] items-center justify-between font-px text-[13px] text-ink">
        <span suppressHydrationWarning>{clock}</span>
        <span className="flex items-center gap-3">
          <button type="button" onClick={toggle} aria-label={`${ui.themeLabel}: ${theme === "dark" ? ui.themeNight : ui.themeDay}`} className="px-1">
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <button type="button" onClick={() => setSfx(!sfx)} aria-pressed={sfx} aria-label={sfx ? ui.sfxOn : ui.sfxOff} className="px-1">
            {sfx ? "🔊" : "🔈"}
          </button>
          <span aria-hidden="true">▮▮▮ ▰</span>
        </span>
      </div>

      {/* jyotishka.exe intro card */}
      {card && (
        <section aria-labelledby="phone-card" className="win mt-4">
          <header className="win-bar flex h-[34px] items-center gap-2 px-3">
            <h2 id="phone-card" className="font-pixel text-base font-bold">
              ✦ {apps.welcome.title}
            </h2>
            <button type="button" onClick={() => setCard(false)} className="win-btn ml-auto" aria-label={ui.win.close}>
              ×
            </button>
          </header>
          <div className="flex items-center gap-3.5 px-4 pt-3.5">
            <Monogram size={70} />
            <div className="min-w-0">
              <p className="font-px text-[10px] text-hot-deep">{me.player}</p>
              <p className="font-pixel text-2xl font-bold leading-none text-ink">{me.name}</p>
              <p className="mt-1.5 inline-block bg-night px-2 py-0.5 font-pixel text-[15px] font-bold text-candy">{me.headline}</p>
            </div>
          </div>
          <p className="px-4 pb-3.5 pt-2.5 font-vt text-[19px] leading-none text-ink-soft">{me.introShort}</p>
        </section>
      )}

      {/* the blocks */}
      <ul className="mt-6 grid grid-cols-3 gap-y-4" aria-label={ui.desktopLabel}>
        {desktopIcons.map((id, i) => (
          <li key={id} className="flex justify-center">
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              tabIndex={cursor === i ? 0 : -1}
              onClick={() => onOpen(id)}
              onKeyDown={(e) => onKey(e, i)}
              onFocus={() => setCursor(i)}
              className="vx-icon flex w-[110px] flex-col items-center"
            >
              <span className="vx-art block">
                <Cube id={id} size={76} />
              </span>
              <span className="icon-label mt-0.5 text-[13px]">{apps[id].label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center font-px text-[10px] text-ink opacity-70">{ui.phoneHint}</p>

      {/* footer line, just above the dock */}
      <p className="fixed inset-x-0 bottom-[96px] z-[40] text-center font-px text-[9px] leading-none">
        <span className="bg-night/75 px-2 py-1 text-snow">
          {ui.footer.made} · {ui.footer.rights}
        </span>
      </p>

      {/* dock */}
      <nav aria-label={ui.hotbarLabel} className="hotbar fixed inset-x-[18px] bottom-[18px] z-[40] flex justify-between gap-1.5 p-1.5">
        {phoneDock.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onOpen(id)}
            aria-label={apps[id].label}
            aria-current={activeId === id ? "true" : undefined}
            className={`hot-slot grid h-[58px] flex-1 place-items-center ${activeId === id ? "active" : ""}`}
          >
            <Cube id={id} size={40} />
          </button>
        ))}
      </nav>
    </div>
  );
}
