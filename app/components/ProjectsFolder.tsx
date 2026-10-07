"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Cube } from "./Cube";
import { arrowStep } from "./Icons";
import { play, useTouch } from "./hooks";
import { categories, projects, ui, type Category, type Project } from "../content";

type Slug = Project["slug"];

function matches(p: Project, cat: Category, q: string) {
  if (cat !== "all" && !p.tags.includes(cat)) return false;
  if (!q) return true;
  const hay = [p.file, p.name, p.kind, p.blurb, p.liveLabel, ...p.stack].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

const live = "inline-block bg-night px-1.5 py-0.5 font-px text-[9px] text-lime";

// file explorer for projects/: history, search, quick filters, icon grid + details list
export default function ProjectsFolder({ onOpen }: { onOpen: (slug: Slug) => void }) {
  const [hist, setHist] = useState<{ stack: Category[]; i: number }>({ stack: ["all"], i: 0 });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Slug>>(() => new Set());
  const [cursor, setCursor] = useState(0);
  const [show, setShow] = useState({ icons: true, list: true });
  const lastPointer = useRef("mouse");
  const touch = useTouch();
  const gridRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const cat = hist.stack[hist.i];
  const files = projects.filter((p) => matches(p, cat, query.trim()));
  const catSlug = categories.find((c) => c.id === cat)?.slug;
  const path = ui.folder.path + (catSlug ? `\\${catSlug}` : "");
  const selCount = files.filter((f) => selected.has(f.slug)).length;
  const focusIdx = Math.min(cursor, Math.max(0, files.length - 1));

  function go(c: Category) {
    if (c === cat) return;
    setHist((h) => ({ stack: [...h.stack.slice(0, h.i + 1), c], i: h.i + 1 }));
    setCursor(0);
  }

  function choose(e: MouseEvent, p: Project, i: number) {
    setCursor(i);
    if (lastPointer.current === "touch" || e.detail === 0) {
      onOpen(p.slug);
      return;
    }
    play("click");
    setSelected((s) => {
      if (e.ctrlKey || e.metaKey) {
        const n = new Set(s);
        if (n.has(p.slug)) n.delete(p.slug);
        else n.add(p.slug);
        return n;
      }
      return new Set([p.slug]);
    });
  }

  function onKey(e: KeyboardEvent, i: number, cols: number, refs: typeof gridRefs) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(files[i].slug);
      return;
    }
    const next = arrowStep(e.key, i, files.length, cols);
    if (next === null) return;
    e.preventDefault();
    setCursor(next);
    setSelected(new Set([files[next].slug]));
    refs.current[next]?.focus();
  }

  const handlers = (p: Project, i: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      lastPointer.current = e.pointerType;
    },
    onClick: (e: MouseEvent) => choose(e, p, i),
    onDoubleClick: () => onOpen(p.slug),
    onFocus: () => setCursor(i),
    "aria-pressed": selected.has(p.slug),
    tabIndex: focusIdx === i ? 0 : -1,
  });

  const navBtn = "px-btn alt sm disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div className="@container flex h-full min-h-[480px] flex-col">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 border-b-4 border-line bg-blush px-4 py-2.5">
        <button type="button" className={navBtn} disabled={hist.i === 0} onClick={() => setHist((h) => ({ ...h, i: h.i - 1 }))} aria-label={ui.folder.back}>
          ◀
        </button>
        <button
          type="button"
          className={navBtn}
          disabled={hist.i >= hist.stack.length - 1}
          onClick={() => setHist((h) => ({ ...h, i: h.i + 1 }))}
          aria-label={ui.folder.forward}
        >
          ▶
        </button>
        <p className="slot min-w-0 flex-1 truncate px-3 py-2 font-px text-xs text-ink" aria-label={ui.folder.pathLabel}>
          {path}
        </p>
        <label className="slot flex w-full items-center gap-2 px-3 py-1.5 @[560px]:w-52">
          <span aria-hidden="true" className="font-px text-xs text-ink opacity-70">
            ⌕
          </span>
          <span className="sr-only">{ui.folder.search}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder={ui.folder.search}
            className="w-full min-w-0 bg-transparent font-px text-xs text-ink outline-none placeholder:text-ink/60"
          />
        </label>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 @[620px]:grid-cols-[170px_1fr]">
        {/* sidebar */}
        <aside className="border-b-4 border-line bg-paper px-3 py-4 font-px @[620px]:border-b-0 @[620px]:border-r-4">
          <p className="mb-2.5 text-[11px] text-hot-deep">{ui.folder.quickAccess}</p>
          <ul className="flex flex-wrap gap-1 @[620px]:flex-col">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={cat === c.id}
                  onClick={() => go(c.id)}
                  className={`w-full px-2 py-2 text-left text-xs ${cat === c.id ? "bg-hot text-snow" : "text-ink hover:bg-petal"}`}
                >
                  {c.icon} {c.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="hidden @[620px]:block">
            <p className="mb-2.5 mt-5 text-[11px] text-hot-deep">{ui.folder.storage}</p>
            <div className="slot h-4">
              <div className="h-full w-[72%] bg-hot" />
            </div>
            <p className="mt-1.5 text-[10px] text-ink">{ui.folder.storageNote}</p>
          </div>
          <div className="mt-4 hidden gap-1.5 @[620px]:flex @[620px]:flex-col">
            <button type="button" aria-pressed={show.icons} onClick={() => setShow((s) => ({ icons: !s.icons || !s.list, list: s.list }))} className={`px-2 py-1.5 text-left text-[11px] ${show.icons ? "bg-night text-candy" : "text-ink hover:bg-petal"}`}>
              {ui.folder.viewIcons}
            </button>
            <button type="button" aria-pressed={show.list} onClick={() => setShow((s) => ({ icons: s.icons, list: !s.list || !s.icons }))} className={`px-2 py-1.5 text-left text-[11px] ${show.list ? "bg-night text-candy" : "text-ink hover:bg-petal"}`}>
              {ui.folder.viewList}
            </button>
          </div>
        </aside>

        {/* files */}
        <div className="min-w-0 px-5 py-5 @[620px]:px-6">
          {files.length === 0 && <p className="py-10 text-center font-vt text-2xl text-ink-soft">{ui.folder.empty}</p>}

          {show.icons && files.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 @[700px]:grid-cols-4">
              {files.map((p, i) => (
                <li key={p.slug}>
                  <button
                    ref={(el) => {
                      gridRefs.current[i] = el;
                    }}
                    type="button"
                    {...handlers(p, i)}
                    onKeyDown={(e) => onKey(e, i, 4, gridRefs)}
                    className={`vx-icon group flex w-full flex-col items-center px-2 pb-3 pt-4 text-center ${selected.has(p.slug) ? "bg-petal shadow-[0_0_0_3px_var(--color-line)]" : "hover:bg-blush"}`}
                  >
                    <span className="vx-art block">
                      <Cube id={p.slug} size={104} className="max-w-full" />
                    </span>
                    <span className="mt-1.5 font-pixel text-lg font-bold text-ink">{p.file}</span>
                    <span className="mt-0.5 font-vt text-lg leading-none text-ink-soft">{p.kind}</span>
                    <span className={`${live} mt-2`}>{ui.folder.live}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {show.list && files.length > 0 && (
            <div className={show.icons ? "mt-5 border-t-4 border-line" : ""}>
              <div className="hidden grid-cols-[1.3fr_1.6fr_1.6fr_.8fr] px-1.5 py-2.5 font-px text-[11px] text-hot-deep @[620px]:grid" aria-hidden="true">
                <span>{ui.folder.cols.name}</span>
                <span>{ui.folder.cols.type}</span>
                <span>{ui.folder.cols.live}</span>
                <span>{ui.folder.cols.date}</span>
              </div>
              <ul>
                {files.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      ref={(el) => {
                        listRefs.current[i] = el;
                      }}
                      type="button"
                      {...handlers(p, i)}
                      onKeyDown={(e) => onKey(e, i, 1, listRefs)}
                      className={`grid w-full grid-cols-1 items-center gap-x-2 px-1.5 py-1.5 text-left @[620px]:grid-cols-[1.3fr_1.6fr_1.6fr_.8fr] ${selected.has(p.slug) ? "bg-petal" : "hover:bg-blush"}`}
                    >
                      <span className="flex items-center gap-2 font-pixel text-base font-bold text-ink">
                        <Cube id={p.slug} size={26} className="shrink-0" />
                        {p.file}
                      </span>
                      <span className="font-vt text-[19px] leading-tight text-ink">{p.kind}</span>
                      <span className="break-words font-vt text-[19px] leading-tight text-hot-deep">{p.liveLabel}</span>
                      <span className="font-vt text-[19px] text-ink">{p.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* status bar */}
      <div className="flex justify-between gap-3 border-t-4 border-line bg-blush px-4 py-2.5 font-px text-[11px] text-ink" role="status">
        <span>
          {files.length} {files.length === 1 ? ui.folder.item : ui.folder.items} · {selCount} {ui.folder.selected}
        </span>
        <span className="hidden @[480px]:inline">{touch ? ui.folder.openHintTouch : ui.folder.openHint}</span>
      </div>
    </div>
  );
}
