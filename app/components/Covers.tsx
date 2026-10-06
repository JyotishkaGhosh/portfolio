"use client";
// The artwork on each pin. Pure visuals — no state.
import { motion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type Job, type Project } from "../content";
import { Bow, Heart, Sparkle } from "./Decor";

const tones: Record<string, string> = {
  satin: "satin text-ink",
  berry: "berry-card",
  cream: "bg-pearl text-ink border border-petal",
  wine: "wine-card",
  blush: "bg-blush text-ink",
  petal: "bg-gradient-to-b from-petal to-petal-deep text-ink",
};

export function ScoreRing({ value, big = false }: { value: string; big?: boolean }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className={`relative mx-auto ${big ? "h-64 w-64" : "h-36 w-36 sm:h-44 sm:w-44"}`}>
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} className="stroke-pearl" strokeOpacity=".7" strokeWidth="12" fill="none" />
        <motion.circle
          cx="90" cy="90" r={r} stroke="url(#ringg)" strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * 0.04 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="ringg"><stop offset="0" style={{ stopColor: "var(--bow-2)" }} /><stop offset="1" style={{ stopColor: "var(--bow-3)" }} /></linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-serif italic text-berry ${big ? "text-6xl" : "text-4xl"}`}>{value}</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-wine/70">scored 90%+ won</span>
      </div>
    </div>
  );
}

export function Stages() {
  const stages = ["saved", "applied", "interview", "offer"];
  return (
    <div className="flex flex-col gap-2">
      {stages.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold ${
            i === 3 ? "bg-berry text-snow" : "bg-pearl/80 text-wine"
          }`}
          style={{ marginLeft: `${i * 10}px` }}
        >
          <span className="text-[10px] opacity-70">0{i + 1}</span>
          <span className="capitalize">{s}</span>
          {i === 3 && <Heart size={12} className="ml-auto" />}
        </motion.div>
      ))}
    </div>
  );
}

// the strip under each screenshot wears the project's own colours
const shotTones: Record<string, string> = {
  Kairo: "satin text-ink",
  SignalStack: "bg-gradient-to-b from-blush to-petal text-ink",
  Safar: tones.petal,
  Matilda: tones.cream,
};

// screenshot from public/pins on top, name + kicker underneath — falls back to the designed cover if the file is missing
export function ProjectCover({ p, big = false }: { p: Project; big?: boolean }) {
  const [broken, setBroken] = useState(false);
  if (p.image && !broken)
    return (
      <div className={`flex flex-col ${shotTones[p.name] ?? tones.blush}`}>
        {/* in the close-up the shot grows to fill the column, the name strip stays underneath */}
        <div className={`overflow-hidden border-b border-petal/70 ${big ? "relative aspect-[16/10] md:aspect-auto md:min-h-[20rem] md:flex-1" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={`${p.name} — the live site`}
            onError={() => setBroken(true)}
            className={`object-cover object-top ${big ? "absolute inset-0 h-full w-full" : "block aspect-[16/10] w-full"}`}
          />
        </div>
        <div className={`relative flex flex-col justify-center gap-1.5 ${big ? "px-7 py-8 md:px-10" : "flex-1 px-5 pt-4 pb-5"}`}>
          <Sparkle size={big ? 22 : 14} className="absolute right-4 top-4 text-berry opacity-80" />
          <span className="pr-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-wine/80">{p.kicker}</span>
          <h3 className={`font-serif italic leading-none ${big ? "text-6xl" : "text-[1.6rem] sm:text-[2.3rem]"}`}>{p.name}</h3>
          {big && p.metric && (
            <p className="mt-3 text-sm text-wine">
              <span className="font-serif text-2xl text-berry">{p.metric.value}</span> {p.metric.label}
            </p>
          )}
        </div>
      </div>
    );

  if (p.name === "Kairo")
    return (
      <div className={`satin relative flex flex-col items-center justify-center gap-4 px-5 ${big ? "min-h-[28rem]" : "py-10"}`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-wine/70">{p.kicker}</span>
        <h3 className={`font-serif italic leading-none text-ink ${big ? "text-7xl" : "text-[2.4rem] sm:text-5xl"}`}>Kairo</h3>
        {p.metric && <ScoreRing value={p.metric.value} big={big} />}
        {p.metric && <p className="max-w-[16rem] text-center text-xs leading-relaxed text-wine/80">{p.metric.label}</p>}
        <Sparkle className="absolute right-5 top-5 text-berry" />
      </div>
    );

  if (p.name === "SignalStack")
    return (
      <div className={`relative flex flex-col justify-center gap-5 bg-gradient-to-b from-blush to-petal px-6 ${big ? "min-h-[28rem]" : "py-10"}`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-wine/70">{p.kicker}</span>
        <h3 className={`font-serif italic leading-none text-ink ${big ? "text-6xl sm:text-7xl" : "text-[1.75rem] sm:text-[2.6rem]"}`}>SignalStack</h3>
        <Stages />
        <Bow size={52} className="absolute right-4 top-4" />
      </div>
    );

  const palette: Record<string, string> = {
    Safar: tones.petal,
    Matilda: tones.cream,
  };
  return (
    <div className={`relative flex flex-col justify-end gap-2 px-6 ${palette[p.name] ?? tones.blush} ${big ? "min-h-[24rem] py-10" : "min-h-[13rem] py-7"}`}>
      <Sparkle size={big ? 28 : 18} className="absolute right-5 top-5 opacity-80" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-70">{p.kicker}</span>
      <h3 className={`font-serif italic leading-none ${big ? "text-7xl" : "text-[2.2rem] sm:text-5xl"}`}>{p.name}</h3>
    </div>
  );
}

// The intro and statement pins open the board side by side, so they share one height:
// each PairBox measures its own content and every box takes the tallest.
const pair = new Set<{ box: HTMLDivElement; content: HTMLDivElement }>();
function syncPair() {
  let tallest = 0;
  pair.forEach(({ box, content }) => {
    const s = getComputedStyle(box);
    tallest = Math.max(tallest, content.offsetHeight + parseFloat(s.paddingTop) + parseFloat(s.paddingBottom));
  });
  pair.forEach(({ box }) => (box.style.minHeight = pair.size > 1 ? `${tallest}px` : ""));
}

export function PairBox({ className, inner = "", children }: { className: string; inner?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current || !content.current) return;
    const entry = { box: box.current, content: content.current };
    pair.add(entry);
    const ro = new ResizeObserver(syncPair);
    ro.observe(entry.content);
    return () => {
      ro.disconnect();
      pair.delete(entry);
      entry.box.style.minHeight = "";
      syncPair();
    };
  }, []);
  return (
    <div ref={box} className={className}>
      <div ref={content} className={inner}>{children}</div>
    </div>
  );
}

export function QuoteCover({ text, tone, big = false, paired = false }: { text: string; tone: string; big?: boolean; paired?: boolean }) {
  const body = (
    <>
      <Bow size={big ? 70 : 46} className="mb-4" />
      <p className={`font-serif italic leading-snug ${big ? "text-4xl" : "text-[1.05rem] sm:text-[1.35rem]"}`}>“{text}”</p>
      <span className="mt-4 font-script text-2xl opacity-80">Jyotishka</span>
    </>
  );
  const box = `relative flex flex-col items-center justify-center px-6 text-center ${tones[tone]} ${big ? "min-h-[24rem] py-16" : "py-12"}`;
  if (paired && !big)
    return (
      <PairBox className={box} inner="flex flex-col items-center">
        {body}
      </PairBox>
    );
  return <div className={box}>{body}</div>;
}

export function StatCover({
  value, label, tone, big = false,
}: { value: string; label: string; tone: string; big?: boolean }) {
  return (
    <div className={`relative flex flex-col justify-between gap-6 px-6 ${tones[tone]} ${big ? "min-h-[22rem] py-12" : "py-8"}`}>
      <Heart size={14} className="opacity-70" />
      <div>
        <div className={`font-serif leading-none tracking-tight ${big ? "text-8xl" : "text-[2.4rem] sm:text-[3.4rem]"}`}>{value}</div>
        <p className="mt-3 text-xs font-medium leading-relaxed opacity-80">{label}</p>
      </div>
    </div>
  );
}

export function JobCover({ j, big = false }: { j: Job; big?: boolean }) {
  if (j.big)
    return (
      <div className={`relative px-4 sm:px-6 ${tones.berry} ${big ? "min-h-[26rem] py-12" : "py-8"}`}>
        <Sparkle size={70} className="absolute -right-3 -top-3 text-snow/25" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-80">{j.when}</span>
        <h3 className={`mt-3 font-serif italic leading-none ${big ? "text-6xl" : "text-[1.8rem] sm:text-[2.6rem]"}`}>{j.company}</h3>
        <p className="mt-2 text-sm font-semibold">{j.role}</p>
        <div className="mt-6 grid grid-cols-2 gap-2 text-ink">
          {[["₹35L", "ACV closed"], ["15", "enterprise deals"], ["87.5%", "pipeline → close"], ["40%", "reply rate"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-pearl/95 px-2.5 py-2.5 sm:px-3 sm:py-3">
              <div className="font-serif text-lg text-berry sm:text-2xl">{v}</div>
              <div className="text-[8px] font-medium uppercase tracking-wide text-wine/70 sm:text-[10px] sm:tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className={`relative px-4 sm:px-6 ${tones.cream} ${big ? "min-h-[20rem] py-12" : "py-7"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-berry">{j.when}</span>
      <h3 className={`mt-2 font-serif italic leading-tight ${big ? "text-5xl" : "text-[1.6rem] sm:text-3xl"} break-words`}>{j.company}</h3>
      {j.note && <p className="text-[11px] font-medium text-wine/60">{j.note}</p>}
      <p className="mt-3 text-sm font-semibold text-wine">{j.role}</p>
    </div>
  );
}
