"use client";

import { useState } from "react";
import { Badge, Cube } from "./Cube";
import { BLOCK_IDS } from "./voxel";
import { aboutMe, achievements, education, jobs, me, toolkit, ui, welcomeStats } from "../content";

const label = "font-px text-xs tracking-wide text-hot-deep";
const body = "font-vt text-[22px] leading-[1.15] text-ink-soft";

// ---------- jyotishka.exe ----------
export function Welcome({ onExplore }: { onExplore: () => void }) {
  return (
    <div>
      <div className="flex flex-col gap-6 px-7 pb-6 pt-7 sm:flex-row [@media(max-height:780px)]:pb-4 [@media(max-height:780px)]:pt-5">
        <Monogram size={132} />
        <div className="min-w-0">
          <p className={`${label} tracking-[.12em]`}>{me.player}</p>
          <p className="mt-1.5 font-pixel text-[clamp(30px,4vw,42px)] font-bold leading-[1.05] text-ink">{me.name}</p>
          <p className="mt-2 inline-block bg-night px-2.5 py-1 font-pixel text-xl font-bold text-candy">{me.headline}</p>
          <p className={`${body} mt-3.5 text-2xl leading-[1.1]`}>{me.intro}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3.5 px-7 pb-6 [@media(max-height:780px)]:pb-4">
        <button type="button" onClick={onExplore} className="px-btn">
          {ui.welcome.explore}
        </button>
        <a href={me.resume} target="_blank" rel="noopener" className="px-btn alt">
          {ui.welcome.resume}
        </a>
        <a href={me.linkedin} target="_blank" rel="noopener noreferrer" className="px-btn alt">
          {ui.welcome.linkedin}
        </a>
        <a href={me.github} target="_blank" rel="noopener noreferrer" className="px-btn alt">
          {ui.welcome.github}
        </a>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t-4 border-line bg-blush px-7 py-3.5 font-px text-[13px] text-ink">
        {welcomeStats.map((s) => (
          <li key={s.label}>
            <span className="text-hot" aria-hidden="true">
              {s.icon}
            </span>{" "}
            <b>{s.value}</b> {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Monogram({ size }: { size: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center bg-candy shadow-[inset_6px_6px_0_var(--color-candy-hi),inset_-6px_-6px_0_var(--color-candy-lo),0_0_0_4px_var(--color-line)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="font-pixel font-bold text-bubblegum [text-shadow:4px_4px_0_var(--color-night)]" style={{ fontSize: size * 0.45 }}>
        {me.monogram}
      </span>
    </div>
  );
}

// ---------- about_me ----------
export function About() {
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start gap-4">
        <Cube id="about" size={72} className="shrink-0" />
        <div>
          <p className="inline-block bg-night px-2 py-0.5 font-px text-xs text-candy">{ui.about.tagline}</p>
          <p className={`${body} mt-2`}>{me.longIntro}</p>
        </div>
      </div>
      <blockquote className="bg-night px-5 py-4 font-pixel text-[22px] font-bold leading-snug text-snow shadow-[0_0_0_4px_var(--color-glow)]">
        <span className="text-glow">“</span>
        {me.statement}
        <span className="text-glow">”</span>
      </blockquote>
      <section>
        <h3 className={label}>{ui.about.factsTitle}</h3>
        <ul className={`${body} mt-1.5 space-y-0.5`}>
          {aboutMe.map((l) => (
            <li key={l}>
              <span className="text-hot" aria-hidden="true">
                ♥{" "}
              </span>
              {l}
            </li>
          ))}
          <li>
            <span className="text-hot" aria-hidden="true">
              ♥{" "}
            </span>
            <i>{me.quote}</i>
          </li>
        </ul>
      </section>
      <section>
        <h3 className={label}>{ui.about.lootTitle}</h3>
        <div className="mt-2 space-y-3">
          {toolkit.map((g, gi) => (
            <div key={g.group}>
              <p className="font-pixel text-sm font-bold text-ink">{g.group}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {g.items.map((t, i) => (
                  <li key={t} className="slot flex items-center gap-1.5 px-2.5 py-1.5 font-px text-[11px] text-ink">
                    <Cube id={BLOCK_IDS[(gi * 3 + i) % BLOCK_IDS.length]} size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- experience: one save file per job ----------
export function Experience() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div className="p-5">
      <p className={`${body} mb-4`}>{ui.experience.intro}</p>
      <ol className="space-y-3.5">
        {jobs.map((j, i) => {
          const expanded = open.has(i);
          const panel = `save-${i}`;
          return (
            <li key={j.company} className={j.big ? "bg-petal shadow-[0_0_0_4px_var(--color-hot),6px_6px_0_4px_var(--drop)]" : "bg-paper shadow-[0_0_0_3px_var(--color-line)]"}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panel}
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3.5 p-3 text-left hover:bg-blush/60"
              >
                <span className="slot grid size-14 shrink-0 place-items-center">
                  <Cube id={j.big ? "achievements" : "experience"} size={38} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-px text-[11px] text-hot-deep">
                    {ui.experience.save} {String(i + 1).padStart(2, "0")}
                    {j.big && <span className="bg-hot px-1.5 py-0.5 text-snow">{ui.experience.latest}</span>}
                  </span>
                  <span className="block font-pixel text-xl font-bold leading-tight text-ink">
                    {j.company}
                    {j.note && <span className="ml-2 font-vt text-lg font-normal text-ink-soft">· {j.note}</span>}
                  </span>
                  <span className="block font-vt text-xl leading-tight text-ink-soft">{j.role}</span>
                </span>
                <span className="hidden shrink-0 text-right font-px text-[11px] leading-relaxed text-ink sm:block">
                  {j.when}
                  <br />
                  <span className="opacity-70">{j.where}</span>
                </span>
                <span className="font-px text-sm text-ink" aria-hidden="true">
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
              {expanded && (
                <div id={panel} className="border-t-4 border-line px-4 pb-4 pt-3">
                  <p className="font-px text-[11px] text-ink sm:hidden">
                    {j.when} · {j.where}
                  </p>
                  <p className={body}>{j.headline}</p>
                  {j.stats && (
                    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {j.stats.map((s) => (
                        <li key={s.label} className="slot px-2 py-2.5 text-center">
                          <span className="block font-pixel text-2xl font-bold text-hot [text-shadow:2px_2px_0_var(--color-line)]">{s.value}</span>
                          <span className="block font-vt text-lg leading-none text-ink">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {j.points.length > 0 && (
                    <ul className={`${body} mt-3 space-y-1.5 text-xl`}>
                      {j.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="text-hot" aria-hidden="true">
                            ✔
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------- achievements ----------
export function Achievements() {
  const n = achievements.length;
  return (
    <div className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-px text-xs text-ink">
          {n} / {n} {ui.achievements.progress}
        </span>
        <div className="slot h-4 flex-1">
          <div className="h-full w-full bg-hot" />
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {achievements.map((a) => (
          <li key={a.title} className="flex items-center gap-3.5 bg-paper p-3 shadow-[0_0_0_3px_var(--color-line)]">
            <span className="slot grid size-16 shrink-0 place-items-center">
              <Badge name={a.sprite} size={40} />
            </span>
            <span className="min-w-0">
              <span className="inline-block bg-night px-1.5 py-0.5 font-px text-[9px] text-lime">★ {ui.achievements.unlocked}</span>
              <span className="mt-1 block font-pixel text-[17px] font-bold leading-tight text-ink">{a.title}</span>
              <span className="block font-vt text-lg leading-tight text-ink-soft">{a.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- education ----------
export function Education() {
  return (
    <div className="flex flex-col items-center gap-6 p-7 sm:flex-row sm:items-start">
      <Cube id="education" size={120} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <p className={label}>{education.when}</p>
        <h3 className="mt-1 font-pixel text-2xl font-bold leading-tight text-ink">{education.degree}</h3>
        <p className={`${body} mt-2`}>{education.school}</p>
        <p className="font-px text-xs text-ink-soft">{education.university}</p>
        <div className="mt-5 flex gap-3">
          <div className="slot px-5 py-3 text-center">
            <span className="block font-pixel text-4xl font-bold text-hot [text-shadow:3px_3px_0_var(--color-line)]">{education.score}</span>
            <span className="block font-px text-[11px] text-ink">{ui.education.scoreLabel}</span>
          </div>
          <div className="slot flex items-center px-4 font-px text-[11px] text-ink">● {ui.education.status}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- say_hi ----------
export function SayHi() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(me.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = me.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-4">
        <Cube id="sayhi" size={72} className="shrink-0" />
        <p className={body}>{ui.sayhi.intro}</p>
      </div>
      <div>
        <p className={label}>{ui.sayhi.email}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <span className="slot min-w-0 flex-1 break-all px-3 py-2.5 font-vt text-[22px] text-ink">{me.email}</span>
          <button type="button" onClick={copy} className="px-btn alt sm w-28">
            {copied ? ui.sayhi.copied : ui.sayhi.copy}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? ui.sayhi.copied : ""}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3.5">
        <a href={`mailto:${me.email}`} className="px-btn">
          {ui.sayhi.write}
        </a>
        <a href={me.linkedin} target="_blank" rel="noopener noreferrer" className="px-btn alt">
          {ui.sayhi.linkedin}
        </a>
        <a href={me.github} target="_blank" rel="noopener noreferrer" className="px-btn alt">
          {ui.sayhi.github}
        </a>
      </div>
    </div>
  );
}
