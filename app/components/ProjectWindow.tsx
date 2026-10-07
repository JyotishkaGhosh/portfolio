"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Cube } from "./Cube";
import { BLOCK_IDS } from "./voxel";
import { ui, type Project } from "../content";

// three.js only ever loads in the browser
const Block3D = dynamic(() => import("./Block3D"), {
  ssr: false,
  loading: () => <div className="size-full" />,
});

const label = "font-px text-xs tracking-wide text-hot-deep";

export default function ProjectWindow({ project: p, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 @[720px]:grid-cols-[300px_1fr]">
        {/* left: the block + headline stat */}
        <div className="flex flex-col items-center border-b-4 border-line bg-gradient-to-b from-blush to-petal p-6 @[720px]:border-b-0 @[720px]:border-r-4">
          <div className="size-[250px] max-w-full">
            <Block3D id={p.slug} label={`${p.name} ${ui.project.blockLabel}`} />
          </div>
          <p className="mt-1 font-px text-[11px] text-ink opacity-70">{ui.project.drag}</p>
          <div className="slot mt-5 w-full px-4 py-4 text-center">
            {p.metric ? (
              <>
                <p className="font-pixel text-[54px] font-bold leading-none text-hot [text-shadow:3px_3px_0_var(--color-line)]">{p.metric.value}</p>
                <p className="mt-2 font-vt text-xl leading-tight text-ink">{p.metric.label}</p>
              </>
            ) : (
              <>
                <p className="inline-block bg-night px-2 py-1 font-px text-xs text-lime">{ui.folder.live}</p>
                <p className="mt-2 break-all font-vt text-xl leading-tight text-ink">{p.liveLabel}</p>
              </>
            )}
          </div>
        </div>

        {/* right: screenshot, blurb, stack, quests */}
        <div className="min-w-0 p-6">
          <figure className="relative overflow-hidden bg-white shadow-[0_0_0_4px_var(--color-line)]">
            <div className="flex h-7 items-center gap-1.5 border-b-[3px] border-line bg-chrome px-2">
              <i className="size-2.5 bg-hot" />
              <i className="size-2.5 bg-candy" />
              <span className="ml-2 truncate font-px text-[10px] text-night/70">{p.liveLabel}</span>
            </div>
            <Image src={p.image} alt={`${ui.project.shotAlt} ${p.name}`} width={1280} height={800} className="block h-auto w-full" sizes="(max-width: 700px) 100vw, 640px" />
            <figcaption className="absolute bottom-2.5 right-2.5 bg-night px-2 py-1 font-px text-[11px] text-snow">{ui.project.shot}</figcaption>
          </figure>

          <p className="mt-5 font-vt text-[22px] leading-[1.15] text-ink-soft">{p.blurb}</p>

          <h3 className={`${label} mt-5`}>{ui.project.stack}</h3>
          <ul className="mt-2 grid grid-cols-4 gap-1.5 @[560px]:grid-cols-8">
            {p.stack.map((t, i) => (
              <li key={t} className="slot flex h-16 flex-col items-center justify-center gap-1 px-0.5">
                <Cube id={BLOCK_IDS[(i + 1) % BLOCK_IDS.length]} size={28} />
                <span className="max-w-full truncate font-px text-[9px] text-ink">{t}</span>
              </li>
            ))}
          </ul>

          <h3 className={`${label} mt-5`}>{ui.project.quests}</h3>
          <ul className="mt-1.5 space-y-1 font-vt text-[21px] leading-[1.15] text-ink">
            {p.quests.map((q) => (
              <li key={q} className="flex gap-2">
                <span className="text-hot" aria-hidden="true">
                  ✔
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3.5">
            <a href={p.live} target="_blank" rel="noopener noreferrer" className="px-btn">
              {ui.project.live}
            </a>
            {p.code && (
              <a href={p.code} target="_blank" rel="noopener noreferrer" className="px-btn alt">
                {ui.project.source}
              </a>
            )}
            <button type="button" onClick={onBack} className="px-btn alt">
              {ui.project.back}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
