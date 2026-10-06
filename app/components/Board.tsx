"use client";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  aboutMe, education, featured, jobs, me, more, quotes, receipts, stats, toolkit, type Project,
} from "../content";
import { JobCover, ProjectCover, QuoteCover, StatCover } from "./Covers";
import { Bow, Heart, Sparkle } from "./Decor";
import Photo from "./Photo";

type Cat = "projects" | "work" | "wins" | "about";
type Detail = {
  kicker: string;
  title: string;
  body?: string;
  points?: string[];
  tags?: string[];
  links?: { label: string; href: string }[];
};
type Pin = {
  id: string;
  cat: Cat;
  title?: string;   // caption under the pin
  h: number;        // rough height, used to balance the columns
  cover: (big: boolean) => ReactNode;
  detail?: Detail;
  href?: string;
};

const chips: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "All pins" },
  { id: "projects", label: "Projects" },
  { id: "work", label: "Work" },
  { id: "wins", label: "Wins" },
  { id: "about", label: "About me" },
];

const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

function projectPin(p: Project, h: number): Pin {
  return {
    id: p.name,
    cat: "projects",
    title: p.name + " — " + p.kicker,
    h,
    href: p.live,
    cover: (big) => <ProjectCover p={p} big={big} />,
    detail: {
      kicker: p.kicker,
      title: p.name,
      body: p.blurb,
      points: p.points,
      tags: p.stack,
      links: [
        ...(p.live ? [{ label: "Open live site", href: p.live }] : []),
        ...(p.code ? [{ label: "See the code", href: p.code }] : []),
      ],
    },
  };
}

function buildPins(): Pin[] {
  const [kairo, signal] = featured;
  const [lead, ...rest] = jobs;
  const statTones = ["satin", "blush", "petal", "cream"];
  const statPins: Pin[] = stats.map((s, i) => ({
    id: "stat" + i,
    cat: "wins",
    h: 2,
    cover: (big) => (
      <StatCover
        big={big}
        tone={statTones[i]}
        value={`${s.prefix ?? ""}${s.value}${s.suffix}`}
        label={s.label}
      />
    ),
  }));
  const quotePins: Pin[] = quotes.map((q, i) => ({
    id: "quote" + i,
    cat: "about",
    h: 2.4,
    cover: (big) => <QuoteCover text={q.text} tone={q.tone} big={big} />,
  }));
  const jobPin = (j: (typeof jobs)[number], h: number): Pin => ({
    id: j.company,
    cat: "work",
    h,
    cover: (big) => <JobCover j={j} big={big} />,
    detail: {
      kicker: `${j.role} · ${j.when} · ${j.where}`,
      title: j.company,
      body: j.headline,
      points: j.points,
    },
  });

  const photoPin: Pin = {
    id: "me",
    cat: "about",
    title: "that's me ✦",
    h: 3.6,
    cover: () => (
      <div className="relative">
        <Photo className="aspect-[3/4] w-full" mono="text-8xl" />
        <Bow size={64} className="absolute left-1/2 top-3 -translate-x-1/2 drop-shadow" />
      </div>
    ),
  };

  const aboutPin: Pin = {
    id: "about",
    cat: "about",
    h: 2.6,
    cover: () => (
      <div className="bg-pearl px-6 py-8">
        <p className="font-script text-4xl text-berry">hello, I&apos;m</p>
        <p className="font-serif text-2xl italic">{me.first}</p>
        <ul className="mt-5 space-y-3">
          {aboutMe.map((a) => (
            <li key={a} className="flex gap-2 text-sm leading-snug text-wine">
              <Heart size={12} className="mt-1 shrink-0 text-rose" /> {a}
            </li>
          ))}
        </ul>
      </div>
    ),
    detail: { kicker: me.role, title: `${me.first} ${me.last}`, body: me.intro, points: aboutMe },
  };

  const toolPin: Pin = {
    id: "toolkit",
    cat: "about",
    title: "my toolkit",
    h: 3.4,
    cover: () => (
      <div className="bg-blush px-5 py-7">
        <p className="font-serif text-2xl italic">the toolkit</p>
        {toolkit.map((g) => (
          <div key={g.group} className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-berry">{g.group}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {g.items.map((t) => (
                <span key={t} className="rounded-full bg-pearl px-2.5 py-1 text-[11px] font-medium text-wine">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  };

  const eduPin: Pin = {
    id: "edu",
    cat: "wins",
    title: education.degree,
    h: 2.2,
    cover: () => (
      <div className="satin px-6 py-9">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-wine/70">{education.when} · CGPA</span>
        <p className="rose-gold font-serif text-7xl italic leading-none">{education.score}</p>
        <p className="mt-3 text-xs leading-relaxed text-wine">{education.school}</p>
      </div>
    ),
  };

  const receiptsPin: Pin = {
    id: "receipts",
    cat: "wins",
    title: "the receipts",
    h: 3,
    cover: () => (
      <div className="bg-gradient-to-b from-[#5a1634] to-[#3d0f26] px-6 py-8 text-blush">
        <p className="font-script text-4xl text-rose">the receipts</p>
        <ul className="mt-4 space-y-2.5">
          {receipts.map((r) => (
            <li key={r} className="flex gap-2 text-[13px] leading-snug">
              <Sparkle size={11} className="mt-1 shrink-0 text-rose" /> {r}
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  const contactPin: Pin = {
    id: "contact",
    cat: "about",
    title: "say hi",
    h: 2.4,
    href: `mailto:${me.email}`,
    cover: () => (
      <div className="relative flex flex-col items-center bg-berry px-6 py-10 text-center text-pearl">
        <div className="relative mb-5 h-16 w-24">
          <div className="absolute inset-0 rounded-md bg-pearl" />
          <div
            className="absolute inset-x-0 top-0 h-10 bg-petal"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
          <Heart size={20} className="absolute left-1/2 top-6 -translate-x-1/2 text-berry" />
        </div>
        <p className="font-script text-4xl">write to me</p>
        <p className="mt-2 break-all text-xs font-medium opacity-90">{me.email}</p>
      </div>
    ),
  };

  // order reads left → right; columns are balanced by height below
  return [
    photoPin,
    projectPin(kairo, 3.8),
    quotePins[0],
    statPins[0],
    jobPin(lead, 3.6),
    projectPin(signal, 3.6),
    aboutPin,
    statPins[1],
    projectPin(more[0], 2),
    quotePins[1],
    toolPin,
    jobPin(rest[0], 1.6),
    eduPin,
    projectPin(more[1], 2),
    statPins[3],
    receiptsPin,
    quotePins[2],
    jobPin(rest[2], 1.6),
    statPins[2],
    jobPin(rest[1], 1.6),
    quotePins[3],
    jobPin(rest[3], 1.6),
    contactPin,
  ];
}

function useColumns() {
  const [n, setN] = useState(4);
  useEffect(() => {
    const f = () => {
      const w = window.innerWidth;
      setN(w < 640 ? 2 : w < 1024 ? 3 : w < 1400 ? 4 : 5);
    };
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return n;
}

function PinCard({ pin, saved, onSave, onOpen }: { pin: Pin; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        className="group relative cursor-zoom-in overflow-hidden rounded-[1.4rem] shadow-[0_6px_24px_-12px_rgba(138,36,80,.35)] transition-shadow hover:shadow-[0_18px_40px_-14px_rgba(214,51,108,.45)]"
      >
        {pin.cover(false)}
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className={`absolute right-3 top-3 rounded-full px-4 py-2 text-sm font-bold shadow transition-all ${
            saved ? "bg-ink text-pearl" : "hidden bg-berry text-pearl opacity-0 group-hover:opacity-100 md:block"
          }`}
        >
          {saved ? "Saved ♡" : "Save"}
        </button>
        {pin.href && (
          <a
            href={pin.href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-full bg-pearl/95 px-3 py-1.5 text-xs font-semibold text-ink opacity-0 transition-opacity group-hover:opacity-100"
          >
            ↗ {host(pin.href)}
          </a>
        )}
      </div>
      {pin.title && (
        <div className="mt-2 flex items-center gap-2 px-1">
          {pin.cat === "projects" && <Photo className="h-6 w-6 shrink-0 rounded-full" mono="text-[9px]" />}
          <p className="truncate text-[13px] font-semibold text-ink/85">{pin.title}</p>
        </div>
      )}
    </motion.div>
  );
}

function CloseUp({ pin, saved, onSave, onClose }: { pin: Pin; saved: boolean; onSave: () => void; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  const d = pin.detail;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 p-3 backdrop-blur-sm md:items-center md:p-8"
    >
      <motion.div
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative grid w-full overflow-hidden rounded-[2rem] bg-pearl shadow-2xl ${d ? "max-w-5xl md:grid-cols-2" : "max-w-md"}`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-pearl/90 text-xl text-ink shadow"
        >
          ←
        </button>
        <div className="flex overflow-hidden md:rounded-l-[2rem] [&>*]:w-full [&>*]:flex-1">{pin.cover(true)}</div>
        {d && (
          <div className="flex flex-col p-7 md:p-10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-berry">{d.kicker}</span>
              <button
                onClick={onSave}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold ${saved ? "bg-ink text-pearl" : "bg-berry text-pearl"}`}
              >
                {saved ? "Saved ♡" : "Save"}
              </button>
            </div>
            <h2 className="mt-3 font-serif text-5xl italic leading-none">{d.title}</h2>
            {d.body && <p className="mt-4 font-serif text-lg italic leading-snug text-wine">{d.body}</p>}
            {d.points && d.points.length > 0 && (
              <ul className="mt-6 space-y-3">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-ink/85">
                    <Heart size={12} className="mt-1 shrink-0 text-rose" /> {p}
                  </li>
                ))}
              </ul>
            )}
            {d.tags && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-full bg-blush px-3 py-1 text-xs font-medium text-wine">{t}</span>
                ))}
              </div>
            )}
            {d.links && d.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {d.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                      i === 0 ? "bg-ink text-pearl hover:bg-berry" : "bg-blush text-ink hover:bg-petal"
                    }`}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
            <div className="mt-auto flex items-center gap-3 border-t border-petal pt-6">
              <Photo className="h-11 w-11 rounded-full" mono="text-sm" />
              <div className="flex-1">
                <p className="text-sm font-bold">{me.first} {me.last}</p>
                <p className="text-xs text-wine/70">{me.role}</p>
              </div>
              <a href={`mailto:${me.email}`} className="rounded-full bg-blush px-4 py-2 text-sm font-bold hover:bg-petal">
                Message
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Board() {
  const pins = useMemo(() => buildPins(), []);
  const [filter, setFilter] = useState<"all" | Cat>("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Pin | null>(null);
  const cols = useColumns();

  const toggle = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const shown = pins.filter((p) => {
    if (filter !== "all" && p.cat !== filter) return false;
    if (!query.trim()) return true;
    const hay = [p.id, p.title, p.detail?.title, p.detail?.body, p.detail?.kicker, ...(p.detail?.tags ?? []), ...(p.detail?.points ?? [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  // masonry: each pin goes into the currently shortest column
  const columns: Pin[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  shown.forEach((p) => {
    const i = heights.indexOf(Math.min(...heights));
    columns[i].push(p);
    heights[i] += p.h + 0.4;
  });

  return (
    <>
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-petal/60 bg-paper/85 backdrop-blur-md">
        <div className="flex items-center gap-3 px-3 py-3 md:px-6">
          <a href="#top" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-berry font-serif text-xl italic text-pearl">
            J
          </a>
          <span className="hidden rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-pearl md:block">Board</span>
          <a href={me.resume} target="_blank" className="hidden rounded-full px-4 py-2.5 text-sm font-bold hover:bg-blush md:block">
            Résumé
          </a>
          <label className="flex flex-1 items-center gap-2 rounded-full bg-blush px-4 py-3 text-wine focus-within:ring-2 focus-within:ring-rose">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" />
              <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my board — try “ML” or “sales”"
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-wine/50"
            />
          </label>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setFilter("all"); setQuery(""); setOpen(pins.find((p) => p.id === "contact") ?? null); }} className="shrink-0">
            <Photo className="h-10 w-10 rounded-full ring-2 ring-petal" mono="text-xs" />
          </a>
        </div>
      </header>

      {/* profile */}
      <section id="top" className="relative overflow-hidden px-5 pt-12 pb-8 text-center">
        <div className="satin absolute inset-x-0 top-0 h-56 opacity-80" />
        <div className="relative mx-auto w-fit">
          <Bow size={76} className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 animate-drift" />
          <div className="rounded-full bg-pearl p-1.5 shadow-[0_0_0_3px_#ffcade,0_0_0_7px_#fff7fa,0_0_0_8px_#f39bbd]">
            <Photo className="h-32 w-32 rounded-full md:h-40 md:w-40" mono="text-5xl" />
          </div>
        </div>
        <h1 className="relative mt-6 font-serif text-5xl font-medium italic tracking-tight md:text-7xl">
          {me.first} <span className="not-italic">{me.last}</span>
        </h1>
        <p className="relative mt-2 font-script text-3xl text-berry md:text-4xl">
          soft heart, sharp mind, closed deals
        </p>
        <p className="relative mt-3 text-sm font-semibold text-wine">
          @jyotishkaghosh · {me.location}
        </p>
        <p className="relative mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink/80">{me.intro}</p>
        <p className="relative mt-4 text-sm font-bold">
          5 internships <span className="text-rose">·</span> 4 shipped projects <span className="text-rose">·</span> ₹35L closed
        </p>
        <div className="relative mt-5 flex flex-wrap justify-center gap-2">
          <a href={`mailto:${me.email}`} className="rounded-full bg-berry px-6 py-3 text-sm font-bold text-pearl transition hover:bg-wine">
            Message me
          </a>
          <a href={me.resume} target="_blank" className="rounded-full bg-blush px-6 py-3 text-sm font-bold transition hover:bg-petal">
            Résumé
          </a>
          <a href={me.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-blush px-5 py-3 text-sm font-bold transition hover:bg-petal">
            LinkedIn
          </a>
          <a href={me.github} target="_blank" rel="noreferrer" className="rounded-full bg-blush px-5 py-3 text-sm font-bold transition hover:bg-petal">
            GitHub
          </a>
        </div>
      </section>

      {/* filter chips */}
      <nav className="sticky top-[68px] z-30 bg-paper/85 py-3 backdrop-blur-md">
        <div className="flex justify-start gap-2 overflow-x-auto px-4 md:justify-center [scrollbar-width:none]">
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                filter === c.id ? "bg-ink text-pearl" : "bg-blush text-ink hover:bg-petal"
              }`}
            >
              {c.label}
            </button>
          ))}
          {saved.size > 0 && (
            <span className="flex shrink-0 items-center gap-1 rounded-full px-3 text-sm font-bold text-berry">
              <Heart size={14} /> {saved.size} saved
            </span>
          )}
        </div>
      </nav>

      {/* the board */}
      <main className="px-3 pt-3 pb-16 md:px-6">
        {shown.length === 0 ? (
          <div className="py-24 text-center">
            <Bow size={70} className="mx-auto" />
            <p className="mt-4 font-serif text-2xl italic">No pins for “{query}” — yet.</p>
          </div>
        ) : (
          <div className="flex gap-4">
            {columns.map((col, i) => (
              <div key={i} className="flex min-w-0 flex-1 flex-col">
                <AnimatePresence mode="popLayout">
                  {col.map((p) => (
                    <PinCard key={p.id} pin={p} saved={saved.has(p.id)} onSave={() => toggle(p.id)} onOpen={() => setOpen(p)} />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer id="contact" className="border-t border-petal px-5 py-10 text-center">
        <p className="font-script text-4xl text-berry">let&apos;s make something beautiful</p>
        <a href={`mailto:${me.email}`} className="mt-3 inline-block font-serif text-xl italic underline decoration-rose underline-offset-4 md:text-2xl">
          {me.email}
        </a>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-wine/60">
          © 2026 {me.first} {me.last} · designed & built by me · pink on purpose
        </p>
      </footer>

      <AnimatePresence>
        {open && <CloseUp pin={open} saved={saved.has(open.id)} onSave={() => toggle(open.id)} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
