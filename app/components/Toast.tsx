"use client";

import { useEffect, useState } from "react";
import { Cube } from "./Cube";
import { play } from "./hooks";
import { toast, ui } from "../content";

type Phase = "waiting" | "in" | "out" | "gone";

// "Achievement unlocked!" — slides in a second after load, leaves on its own after ~6s
export default function Toast() {
  const [phase, setPhase] = useState<Phase>("waiting");

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("in");
      play("chime");
    }, 1000);
    const t2 = setTimeout(() => setPhase((p) => (p === "in" ? "out" : p)), 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const t = setTimeout(() => setPhase("gone"), 400);
    return () => clearTimeout(t);
  }, [phase]);

  const visible = phase === "in" || phase === "out";

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-[18px] bottom-[96px] z-[70] min-[700px]:inset-x-auto min-[700px]:right-9 min-[700px]:top-5 min-[700px]:bottom-auto">
      {visible && (
        <div
          className={`pointer-events-auto flex items-center gap-3.5 bg-night px-4 py-3 text-snow shadow-[0_0_0_4px_var(--color-glow),8px_8px_0_4px_var(--drop)] min-[700px]:w-[410px] ${phase === "in" ? "toast-in" : "toast-out"}`}
        >
          <div className="hot-slot grid size-[60px] shrink-0 place-items-center max-[699px]:size-11">
            <Cube id="achievements" size={44} className="max-[699px]:size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-pixel text-lg font-bold text-gold max-[699px]:text-sm">{toast.title}</p>
            <p className="font-vt text-2xl leading-none max-[699px]:text-[19px]">{toast.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setPhase("out")}
            aria-label={ui.dismiss}
            className="self-start px-1 font-px text-xs text-snow/70 hover:text-snow"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
