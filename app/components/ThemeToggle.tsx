"use client";
import { useLayoutEffect, useSyncExternalStore } from "react";

// light ↔ dark pill. The inline script in layout.tsx sets data-theme before first paint;
// this keeps <html> in sync, remembers the visitor's pick, and follows the system until they pick.
type Theme = "light" | "dark";
const KEY = "theme";
const query = "(prefers-color-scheme: dark)";

const apply = (t: Theme) => document.documentElement.setAttribute("data-theme", t);
const system = (): Theme => (window.matchMedia(query).matches ? "dark" : "light");
function saved(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const current = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, current, () => "light" as Theme);

  useLayoutEffect(() => {
    // React's dev remount clears attributes on <html> — put the theme back before paint
    apply(saved() ?? system());
    const mq = window.matchMedia(query);
    const follow = () => {
      if (!saved()) apply(system());
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  const flip = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className="relative flex h-10 w-[4.5rem] shrink-0 items-center justify-between rounded-full bg-blush px-2.5 ring-1 ring-petal transition-colors hover:bg-petal"
    >
      {/* knob position is pure CSS, so it is right before React hydrates */}
      <span className="absolute left-1 top-1 h-8 w-8 rounded-full bg-pearl shadow-[0_2px_8px_-2px_var(--pin-shadow)] transition-transform duration-300 dark:translate-x-[2rem]" />
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="relative text-berry dark:text-wine/50">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <path
          d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" className="relative text-wine/50 dark:text-berry">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
