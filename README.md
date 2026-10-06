# Jyotishka Ghosh — portfolio ✦

**Live → [jyotishkaghosh-portfolio.vercel.app](https://jyotishkaghosh-portfolio.vercel.app/)**

My portfolio as a Pinterest-style board. I'm a GTM engineer: I build the data pipelines, automations and ML models behind go-to-market, and I've closed the deals myself. Every pin is a project, a role, a number or a win.

## What you can do on it

- **Browse the board**: a masonry grid of pins for projects, work, wins and about me
- **Filter and search**: chips for each category, plus search across everything (try "ML" or "sales")
- **Open a pin**: a close-up with the full story, the stack and links to the live product
- **Switch theme**: soft-pink light or plum dark. It follows your system setting and remembers your choice.
- **Decorate it**: press ✦ decorate and drop sparkles, bows and hearts anywhere on the page

## Featured projects

| Project | What it is | Live |
|---|---|---|
| **Kairo** | AI-powered CRM and sales intelligence: lead scoring, win probability, deal briefings, forecasting | [kairo-five-nu.vercel.app](https://kairo-five-nu.vercel.app/) |
| **SignalStack** | Job discovery pipeline and application tracker: multi-source ETL into one schema | [signalstack-theta.vercel.app](https://signalstack-theta.vercel.app/) |
| **Safar** | AI travel planner grounded in live maps, weather and budget | [safar-beta.vercel.app](https://safar-beta.vercel.app/) |
| **Matilda** | Adaptive learning for neurodiverse kids with emotion recognition | [neurodiverse-app.vercel.app](https://neurodiverse-app.vercel.app/) |

## Built with

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · deployed on Vercel

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## How it's organised

| Path | What's there |
|---|---|
| `app/content.ts` | All text, links, numbers, projects and roles. Content lives here, never in components |
| `app/components/Board.tsx` | Top bar, profile header, filters, masonry board, pin close-up |
| `app/components/Covers.tsx` | The artwork for each kind of pin |
| `app/components/Decor.tsx` | Bow, heart and sparkle SVGs |
| `app/globals.css` | Colour tokens for the light and dark themes |
| `public/pins/` | Screenshots of the live projects |

---

Designed and built by **Jyotishka Ghosh** · [LinkedIn](https://www.linkedin.com/in/jyotishka-ghosh-5470b228a/) · [GitHub](https://github.com/JyotishkaGhosh) · jyotishkaghosh8@gmail.com
