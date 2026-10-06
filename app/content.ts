// ✦ Everything on the site lives here. Edit text in this file — never in the components.

export const me = {
  first: "Jyotishka",
  last: "Ghosh",
  headline: "GTM Engineer",
  intro:
    "I'm a GTM engineer: I build the data pipelines, automations and ML models that tell revenue teams who to call, what to say and what will close. I've also run the deals myself — closing ₹35L in enterprise ACV at Anything.ai, first touch to signature.",
  email: "jyotishkaghosh8@gmail.com",
  github: "https://github.com/JyotishkaGhosh",
  linkedin: "https://www.linkedin.com/in/jyotishka-ghosh-5470b228a/",
  resume: "/Jyotishka_Ghosh_Resume.pdf",
  location: "Kolkata, India",
};

export const ribbon = [
  "₹35L ACV closed",
  "87.5% pipeline-to-close",
  "96% win rate on top-scored deals",
  "10,000+ outreach touches",
  "200+ candidates interviewed",
  "9.2 CGPA",
  "SIH top teams ×2",
];

export const stats = [
  { value: 35, prefix: "₹", suffix: "L", label: "enterprise ACV closed in 8 months" },
  { value: 87.5, suffix: "%", label: "pipeline-to-close conversion", decimals: 1 },
  { value: 40, suffix: "%", label: "reply rate across 10k+ touches" },
  { value: 96, suffix: "%", label: "win rate my model predicted on 90%+ scored deals" },
];

export type Project = {
  name: string;
  kicker: string;
  blurb: string;
  points: string[];
  stack: string[];
  live?: string;
  code?: string;
  // ✦ optional screenshot, e.g. "/pins/kairo.png" (put the file in public/pins)
  image?: string;
  metric?: { value: string; label: string };
};

export const featured: Project[] = [
  {
    name: "Kairo",
    kicker: "AI-powered CRM & sales intelligence",
    blurb:
      "I spent months closing deals by gut feel. Kairo is the tool I wished I had — it turns raw CRM data into who to call, what to say, and what will close.",
    points: [
      "Simulated 18 months of B2B SaaS sales data — reps, accounts, leads, deals, stage history — modelled in DuckDB with daily point-in-time snapshots so nothing leaks from the future.",
      "Trained lead-scoring and win-probability models tracked in MLflow; caught and removed a target-leakage feature (the rep's own forecast).",
      "Gemini-written deal briefings grounded only in model outputs, flagging close-date slippage and rep-vs-model gaps.",
      "Explainable next-best-actions and a backtested pipeline forecast, refreshed daily by GitHub Actions.",
    ],
    stack: ["Python", "SQL", "DuckDB", "Parquet", "MLflow", "Gemini API", "GitHub Actions", "Vercel"],
    live: "https://kairo-five-nu.vercel.app/",
    image: "/pins/kairo.png",
    metric: { value: "96%", label: "of deals scored 90%+ actually won · 195-deal backtest" },
  },
  {
    name: "SignalStack",
    kicker: "Job discovery & application tracking",
    blurb:
      "A data pipeline wearing a product's clothes — it pulls job postings from many sources, cleans them into one schema, and lets you track every application to the offer.",
    points: [
      "End-to-end pipeline that ingests, cleans, deduplicates and normalises postings into a unified schema.",
      "Scheduled ETL with incremental loads and idempotent upserts, so every rerun is safe.",
      "Relational model of jobs, companies and applications — saved → applied → interview → offer.",
      "Search and filters over role, location, seniority and recency, with Supabase auth and row-level security.",
    ],
    stack: ["Python", "SQL", "DuckDB", "Parquet", "Supabase", "Postgres", "GitHub Actions", "Vercel"],
    live: "https://signalstack-theta.vercel.app/",
    image: "/pins/signalstack.png",
    code: "https://github.com/JyotishkaGhosh/signalstack",
    metric: { value: "4", label: "stages tracked, saved → offer · reruns are idempotent" },
  },
];

export const more: Project[] = [
  {
    name: "Safar",
    kicker: "AI travel planner",
    blurb:
      "Itineraries that find hidden gems and local food, not tourist lists — grounded in live maps, weather and a real budget.",
    points: [],
    stack: ["MERN", "Tailwind", "Google Maps", "OpenWeather"],
    live: "https://safar-beta.vercel.app/",
    image: "/pins/safar.png",
  },
  {
    name: "Matilda",
    kicker: "Learning for neurodiverse kids",
    blurb:
      "Adaptive, picture-based lessons that read a child's engagement through emotion recognition and adjust in real time.",
    points: [],
    stack: ["Next.js", "FastAPI", "OpenCV", "Python"],
    live: "https://neurodiverse-app.vercel.app/",
    image: "/pins/matilda.png",
  },
];

export type Job = {
  company: string;
  note?: string;
  role: string;
  when: string;
  where: string;
  headline: string;
  points: string[];
  big?: boolean;
};

export const jobs: Job[] = [
  {
    company: "Anything.ai",
    role: "GTM Consultant",
    when: "Jan – Aug 2026",
    where: "Remote",
    big: true,
    headline: "The founders' GTM execution layer — I owned every deal from first touch to onboarding.",
    points: [
      "Closed 15 enterprise deals worth ₹35L ACV from ₹40L of pipeline — ~87.5% conversion, 15–18 day cycles.",
      "Ran 10,000+ touches across LinkedIn, email and calls at a 40% reply rate, ~6 meetings booked a week.",
      "Built the outbound machine in n8n, Apollo and Clay, with ICP qualification on funding stage and investor signals for YC and a16z-ecosystem startups.",
    ],
  },
  {
    company: "Zeex AI",
    note: "IIT Madras startup",
    role: "Business Development Intern",
    when: "Feb – Mar 2026",
    where: "Remote",
    headline: "Outbound lead-gen workflows, market research and early customer demos for AI products.",
    points: [],
  },
  {
    company: "StarterYou",
    note: "New York startup",
    role: "Research Intern",
    when: "Feb – Mar 2026",
    where: "Remote",
    headline: "Market and competitive research, user segmentation and outbound research.",
    points: [],
  },
  {
    company: "Xponentium India",
    role: "Intern — CEO Office",
    when: "Oct 2025 – Jan 2026",
    where: "Gurugram · Remote",
    headline: "Screened and interviewed 200+ candidates; recognised as a top contributor in talent acquisition.",
    points: [],
  },
  {
    company: "Momento",
    note: "Humora Technologies",
    role: "BD & Growth Analyst Intern",
    when: "Nov 2025 – Jan 2026",
    where: "Remote",
    headline: "SQL and Python analysis that turned messy business data into GTM recommendations.",
    points: [],
  },
];

export const toolkit = [
  { group: "Languages", items: ["Python", "JavaScript", "Java", "C", "SQL"] },
  { group: "Data & ML", items: ["DuckDB", "Parquet", "MLflow", "Transformers", "Hugging Face", "OpenCV", "RAG"] },
  { group: "Build", items: ["Next.js", "React", "Tailwind", "FastAPI", "Node.js", "Express"] },
  { group: "Store & ship", items: ["Postgres", "Supabase", "MongoDB", "MySQL", "GitHub Actions", "Vercel"] },
  { group: "GTM", items: ["Apollo.io", "Clay", "n8n", "Airtable", "CRM"] },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "RCC Institute of Information Technology, MAKAUT",
  when: "2023 – 2027",
  score: "9.2",
};

export const receipts = [
  "Top teams — Smart India Hackathon 2023 & 2024",
  "7th — Smart Bengal Hackathon",
  "3rd — INNOVISION Extempore",
  "Contributor — GirlScript Summer of Code",
  "Departmental topper — VECC visit",
  "McKinsey Forward Program",
];

// ✦ little mood pins scattered across the board
export const quotes = [
  { text: "Pink is a power color.", tone: "berry" },
  { text: "I build software for the person I used to be.", tone: "cream" },
  { text: "Most engineers have never sold. Most sellers have never shipped. I've done both.", tone: "wine" },
];

export const aboutMe = [
  "Based in Kolkata, building for everywhere",
  "Sales brain, engineer hands",
  "Happiest when a pipeline runs clean — the data kind and the deal kind",
];
