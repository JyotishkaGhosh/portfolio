"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

// ---------- media queries ----------
export function useMedia(query: string, serverValue = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => serverValue);
}

export const PHONE_QUERY = "(max-width: 699px)";
export const usePhone = () => useMedia(PHONE_QUERY);
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useTouch = () => useMedia("(hover: none)");

// ---------- tab visibility (pauses the 3D canvases when the tab is hidden) ----------
function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
}

// ---------- theme (data-theme is set before first paint by the script in layout.tsx) ----------
export type Theme = "light" | "dark";

function subscribeTheme(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const readTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

function savedTheme(): string | null {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "light" as Theme);

  // no saved choice yet → keep following the system setting
  useEffect(() => {
    const m = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (savedTheme() == null) document.documentElement.setAttribute("data-theme", m.matches ? "dark" : "light");
    };
    m.addEventListener("change", follow);
    return () => m.removeEventListener("change", follow);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked — the choice just lasts for this visit */
    }
  }, []);

  return { theme, toggle };
}

// ---------- clock (Kolkata time, ticks every few seconds; never read during server render) ----------
const clockFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 5000);
  return () => clearInterval(id);
}
export function useClock() {
  return useSyncExternalStore(subscribeClock, () => clockFmt.format(Date.now()), () => "--:--");
}

// ---------- sound effects: tiny synthesised blips, off by default ----------
let sfxOn = false;
let ctx: AudioContext | null = null;
const sfxListeners = new Set<() => void>();

export function setSfx(on: boolean) {
  sfxOn = on;
  sfxListeners.forEach((l) => l());
}
export function useSfx() {
  return useSyncExternalStore(
    (cb) => {
      sfxListeners.add(cb);
      return () => sfxListeners.delete(cb);
    },
    () => sfxOn,
    () => false,
  );
}

const TUNES = {
  open: [523, 784],
  close: [659, 392],
  click: [880],
  chime: [523, 659, 784, 1047],
  hi: [988, 1319],
} as const;

export function play(name: keyof typeof TUNES) {
  if (!sfxOn) return;
  try {
    ctx ??= new AudioContext();
    const t0 = ctx.currentTime;
    TUNES[name].forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = "square";
      o.frequency.value = f;
      const t = t0 + i * 0.07;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(ctx!.destination);
      o.start(t);
      o.stop(t + 0.1);
    });
  } catch {
    /* audio not available */
  }
}
