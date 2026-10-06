"use client";
// The artwork on each pin. Pure visuals — no state.
import { motion } from "framer-motion";
import { useImage } from "./useImage";
import { type Job, type Project } from "../content";
import { Bow, Heart, Sparkle } from "./Decor";

const tones: Record<string, string> = {
  satin: "satin text-ink",
  berry: "bg-gradient-to-br from-[#e04a83] to-[#a8204f] text-pearl",
  cream: "bg-pearl text-ink border border-petal",
  wine: "bg-gradient-to-br from-[#5a1634] to-[#3d0f26] text-blush",
  blush: "bg-blush text-ink",
  petal: "bg-gradient-to-b from-petal to-[#ffb3cd] text-ink",
};

export function ScoreRing({ big = false }: { big?: boolean }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className={`relative mx-auto ${big ? "h-64 w-64" : "h-36 w-36 sm:h-44 sm:w-44"}`}>
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} stroke="#ffffff" strokeOpacity=".7" strokeWidth="12" fill="none" />
        <motion.circle
          cx="90" cy="90" r={r} stroke="url(#ringg)" strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * 0.04 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="ringg"><stop offset="0" stopColor="#f48fb6" /><stop offset="1" stopColor="#d6336c" /></linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-serif italic text-berry ${big ? "text-6xl" : "text-4xl"}`}>96%</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-wine/70">won · score 90+</span>
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
            i === 3 ? "bg-berry text-pearl" : "bg-pearl/80 text-wine"
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

// screenshot if public/pins/<name>.png exists, otherwise the designed cover
export function ProjectCover({ p, big = false }: { p: Project; big?: boolean }) {
  const shot = useImage(p.image);
  if (shot && p.image)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={p.name} className="w-full object-cover" />;

  if (p.name === "Kairo")
    return (
      <div className={`satin relative flex flex-col items-center justify-center gap-4 px-5 ${big ? "min-h-[28rem]" : "py-10"}`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-wine/70">{p.kicker}</span>
        <h3 className={`font-serif italic leading-none text-ink ${big ? "text-7xl" : "text-[2.4rem] sm:text-5xl"}`}>Kairo</h3>
        <ScoreRing big={big} />
        <p className="max-w-[16rem] text-center text-xs leading-relaxed text-wine/80">of deals the model scored 90%+ actually closed — 195-deal backtest</p>
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

export function QuoteCover({ text, tone, big = false }: { text: string; tone: string; big?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center justify-center px-6 text-center ${tones[tone]} ${big ? "min-h-[24rem] py-16" : "py-12"}`}>
      <Bow size={big ? 70 : 46} className="mb-4" />
      <p className={`font-serif italic leading-snug ${big ? "text-4xl" : "text-[1.05rem] sm:text-[1.35rem]"}`}>“{text}”</p>
      <span className="mt-4 font-script text-2xl opacity-80">Jyotishka</span>
    </div>
  );
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
        <Sparkle size={70} className="absolute -right-3 -top-3 text-pearl/25" />
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
