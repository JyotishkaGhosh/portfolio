"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import BlossomTree from "./BlossomTree";
import SkyBody from "./SkyBody";
import { CubeDefs } from "./Cube";
import DesktopIcons from "./Icons";
import Taskbar, { type MenuAction, type Slot } from "./Taskbar";
import Toast from "./Toast";
import Wallpaper from "./Wallpaper";
import Phone from "./Phone";
import ProjectWindow from "./ProjectWindow";
import ProjectsFolder from "./ProjectsFolder";
import Window, { type Pos, type WinState } from "./Window";
import { About, Achievements, Education, Experience, SayHi, Welcome } from "./apps";
import { play, usePhone, useTheme } from "./hooks";
import type { BlockId } from "./voxel";
import { apps, desktopIcons, me, projects, ui, type AppId } from "../content";

// three.js companions only ever load in the browser
const Companions = dynamic(() => import("./Companions"), { ssr: false });

// ---------- window manager ----------
type WinId = Exclude<AppId, "resume">;

type State = { wins: WinState[]; top: number };
type Action =
  | { type: "open"; id: string; pos: Pos | null; focus: boolean }
  | { type: "close" | "focus" | "min" | "max"; id: string }
  | { type: "move"; id: string; pos: Pos };

function reducer(s: State, a: Action): State {
  const top = s.top + 1;
  const patch = (id: string, p: Partial<WinState>) => s.wins.map((w) => (w.id === id ? { ...w, ...p } : w));
  switch (a.type) {
    case "open":
      if (s.wins.some((w) => w.id === a.id)) return { top, wins: patch(a.id, { min: false, z: top }) };
      return { top, wins: [...s.wins, { id: a.id, z: top, min: false, max: false, pos: a.pos, focusOnOpen: a.focus }] };
    case "close":
      return { ...s, wins: s.wins.filter((w) => w.id !== a.id) };
    case "focus":
      return { top, wins: patch(a.id, { z: top, min: false }) };
    case "min":
      return { ...s, wins: patch(a.id, { min: true }) };
    case "max":
      return { top, wins: s.wins.map((w) => (w.id === a.id ? { ...w, max: !w.max, z: top } : w)) };
    case "move":
      return { ...s, wins: patch(a.id, { pos: a.pos }) };
  }
}

const initial: State = { top: 1, wins: [{ id: "welcome", z: 1, min: false, max: false, pos: null, focusOnOpen: false }] };

type WinDef = { title: string; icon: BlockId; width: number; tall?: boolean };

const WINDOWS: Record<WinId, WinDef> = {
  welcome: { title: apps.welcome.title, icon: "welcome", width: 620 },
  about: { title: apps.about.title, icon: "about", width: 620 },
  projects: { title: apps.projects.title, icon: "projects", width: 920, tall: true },
  experience: { title: apps.experience.title, icon: "experience", width: 680, tall: true },
  achievements: { title: apps.achievements.title, icon: "achievements", width: 660 },
  education: { title: apps.education.title, icon: "education", width: 560 },
  sayhi: { title: apps.sayhi.title, icon: "sayhi", width: 540 },
};

const projectOf = (id: string) => (id.startsWith("project:") ? projects.find((p) => `project:${p.slug}` === id) : undefined);

function winDef(id: string): WinDef | null {
  const p = projectOf(id);
  if (p) return { title: `${ui.project.titlePrefix}${p.file} — ${p.kind}`, icon: p.slug, width: 1000, tall: true };
  return WINDOWS[id as WinId] ?? null;
}

// windows open below the sun/moon (it sits at ~10% from the top, 64px tall)
const skyTop = () => Math.round(Math.max(136, window.innerHeight * 0.1 + 100));

// cascade new windows inside the free area right of the icons
function spawnPos(def: WinDef, k: number): Pos {
  const lw = window.innerWidth;
  const lh = window.innerHeight - 96;
  const w = Math.min(def.width, lw - 24);
  const x = Math.round(Math.max(12, Math.min(lw - w - 12, (lw + 280 - w) / 2 + (k % 5) * 28 - 56)));
  const top = skyTop();
  const y = Math.round(Math.max(top, Math.min(lh * 0.45, top + (k % 5) * 24)));
  return { x, y };
}

export default function Desktop() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [menuOpen, setMenuOpen] = useState(false);
  const surfaceRef = useRef<HTMLUListElement>(null);
  const phone = usePhone();
  const { toggle: toggleTheme } = useTheme();

  const visible = state.wins.filter((w) => !w.min);
  // stacking order as 1..n (keeps every window under the sun/moon layer, however often they're focused)
  const rank = new Map([...state.wins].sort((a, b) => a.z - b.z).map((w, i) => [w.id, i + 1]));
  const activeId = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).id : null;

  const open = useCallback(
    (id: string) => {
      if (id === "resume") {
        window.open(me.resume, "_blank", "noopener");
        return;
      }
      const def = winDef(id);
      if (!def) return;
      play("open");
      const exists = state.wins.some((w) => w.id === id);
      dispatch({ type: "open", id, pos: exists ? null : spawnPos(def, state.wins.length), focus: true });
    },
    [state.wins],
  );

  const close = useCallback((id: string) => {
    play("close");
    dispatch({ type: "close", id });
  }, []);

  // Esc closes the top window (or the start menu first)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      if (activeId) close(activeId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, activeId, close]);

  function onMenu(a: MenuAction) {
    setMenuOpen(false);
    if (a === "theme") toggleTheme();
    else open(a === "contact" ? "sayhi" : a);
  }

  // hotbar: the seven main blocks, then any other open windows (welcome, project files)
  const extra = state.wins.filter((w) => !desktopIcons.includes(w.id as AppId)).slice(-2);
  const slots: Slot[] = [
    ...desktopIcons.map((id) => ({ id, icon: id as BlockId, label: apps[id].label, open: state.wins.some((w) => w.id === id) })),
    ...extra.map((w) => ({ id: w.id, icon: winDef(w.id)!.icon, label: winDef(w.id)!.title, open: true })),
  ];

  function onSlot(id: string) {
    const w = state.wins.find((x) => x.id === id);
    if (w && id === activeId) dispatch({ type: "min", id });
    else if (w) dispatch({ type: "focus", id });
    else open(id);
  }

  function content(id: string): ReactNode {
    switch (id) {
      case "welcome":
        return <Welcome onExplore={() => open("projects")} />;
      case "about":
        return <About />;
      case "experience":
        return <Experience />;
      case "achievements":
        return <Achievements />;
      case "education":
        return <Education />;
      case "sayhi":
        return <SayHi />;
      case "projects":
        return <ProjectsFolder onOpen={(slug) => open(`project:${slug}`)} />;
    }
    const p = projectOf(id);
    if (p)
      return (
        <ProjectWindow
          project={p}
          onBack={() => {
            dispatch({ type: "close", id });
            open("projects");
          }}
        />
      );
    return null;
  }

  return (
    <div className="relative min-h-dvh min-[700px]:h-dvh min-[700px]:overflow-hidden">
      <CubeDefs />
      <Wallpaper />

      <main className="relative min-[700px]:absolute min-[700px]:inset-x-0 min-[700px]:top-0 min-[700px]:bottom-24">
        <h1 className="sr-only">
          {me.name} — {me.headline}
        </h1>
        <div className="absolute inset-0 max-[699px]:hidden">
          <DesktopIcons onOpen={open} surfaceRef={surfaceRef} />
        </div>
        <Phone onOpen={open} activeId={activeId} />

        <div className="pointer-events-none absolute inset-0 *:pointer-events-auto">
          {state.wins.map((w) => {
            const def = winDef(w.id);
            if (!def) return null;
            return (
              <Window
                key={w.id}
                win={{ ...w, z: rank.get(w.id) ?? 1 }}
                title={def.title}
                icon={def.icon}
                width={def.width}
                active={w.id === activeId}
                phone={phone}
                className={w.id === "welcome" ? "max-[699px]:!hidden" : ""}
                onFocus={() => dispatch({ type: "focus", id: w.id })}
                onClose={() => close(w.id)}
                onMin={() => dispatch({ type: "min", id: w.id })}
                onMax={() => dispatch({ type: "max", id: w.id })}
                onMove={(pos) => dispatch({ type: "move", id: w.id, pos })}
                after={
                  w.id === "welcome" ? (
                    <p className="absolute left-0 top-full mt-1 bg-paper/90 px-3 py-2 font-px text-[13px] text-ink shadow-[0_0_0_3px_var(--color-line)] max-[699px]:hidden">
                      {ui.hint}
                    </p>
                  ) : null
                }
              >
                {content(w.id)}
              </Window>
            );
          })}
        </div>
      </main>

      {/* bottom-right, standing on the grass: the girl + kitty, then the cherry tree */}
      <div className="max-[699px]:contents min-[700px]:fixed min-[700px]:bottom-[136px] min-[700px]:right-6 min-[700px]:z-[15] min-[700px]:flex min-[700px]:items-end min-[700px]:gap-6">
        <Companions />
        <BlossomTree className="max-[699px]:hidden" />
      </div>
      <SkyBody />
      <Toast />
      <Taskbar slots={slots} activeId={activeId} onSlot={onSlot} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onMenu={onMenu} />
    </div>
  );
}
