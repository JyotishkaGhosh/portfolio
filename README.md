# Jyotishka Ghosh — portfolio ✦

**Live → [jyotishkaghosh-portfolio.vercel.app](https://jyotishkaghosh-portfolio.vercel.app/)**

My portfolio as a little pink voxel computer. I'm a GTM engineer: I build the pipelines, automations and ML models behind go-to-market, and I've closed the deals myself. Every block on the desktop opens a window: about me, projects, experience, achievements, education, résumé and contact.

## What you can do on it

- **Open blocks**: double-click a block on the desktop (or tap it on a phone) to open its window. Click once to select it, drag it anywhere on the desktop (blocks never overlap), drag on empty desktop to select several, or use the arrow keys and Enter.
- **Juggle windows**: drag them by the title bar, minimise them to the hotbar, maximise them, or press Esc to close the top one
- **Browse projects/**: a file explorer with search, quick filters (AI / ML, data pipelines, web apps), back/forward, and icon and details views. Double-click a `.exe` to open the project with a 3D block you can spin, a screenshot, the stack and what it does.
- **Say hi to the companions**: hover the girl and she waves; hover the kitty and it licks its paw. Every so often she pets the kitty. On a phone, tap them.
- **Shake the cherry tree**: hover the big tree on the right for a little burst of petals
- **Switch theme**: pink day or plum night. It follows your system setting and remembers your choice.
- **Turn on sound**: tiny synthesised blips, off by default
- **Use it on a phone**: an app-grid home screen with a dock. Windows open full screen.

## Projects inside

| Project | What it is | Live |
|---|---|---|
| **Kairo** | AI-powered CRM and sales intelligence: lead scoring, win probability, deal briefings, forecasting | [kairo-five-nu.vercel.app](https://kairo-five-nu.vercel.app/) |
| **SignalStack** | Job discovery pipeline and application tracker: multi-source ETL into one schema | [signalstack-theta.vercel.app](https://signalstack-theta.vercel.app/) |
| **Safar** | AI travel planner grounded in live maps, weather and budget | [safar-beta.vercel.app](https://safar-beta.vercel.app/) |
| **Matilda** | Adaptive learning for neurodiverse kids with emotion recognition | [neurodiverse-app.vercel.app](https://neurodiverse-app.vercel.app/) |

## Built with

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · three.js with React Three Fiber and drei · Pixelify Sans, Silkscreen and VT323 · deployed on Vercel

All the art is original: the blocks are SVG drawn from 8×8 sprites, and the companions are built out of boxes in three.js.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## How it's organised

| Path | What's there |
|---|---|
| `app/content.ts` | All text, links, numbers, projects, roles and achievements. Content lives here, never in components |
| `app/components/Desktop.tsx` | Window manager, hotbar slots and page layout |
| `app/components/Window.tsx` | The pixel window frame (drag, minimise, maximise, close) |
| `app/components/apps.tsx` | Window contents: welcome, about, experience, achievements, education, say_hi |
| `app/components/ProjectsFolder.tsx` · `ProjectWindow.tsx` | The projects/ explorer and each project's window |
| `app/components/Block3D.tsx` · `Companions.tsx` · `voxel3d.tsx` | The 3D bits: the spinning block and the girl + kitty |
| `app/components/Wallpaper.tsx` · `BlossomTree.tsx` · `SkyBody.tsx` | Sky, grass, cherry trees, sun and moon |
| `app/components/Phone.tsx` | The phone home screen and dock |
| `app/components/voxel.ts` · `Cube.tsx` | Block palettes, pixel sprites and the isometric cube drawing |
| `app/globals.css` | Colour tokens for pink day and plum night, pixel borders, animations |
| `public/pins/` | Screenshots of the live projects |

---

Designed and built by **Jyotishka Ghosh** · [LinkedIn](https://www.linkedin.com/in/jyotishka-ghosh-5470b228a/) · [GitHub](https://github.com/JyotishkaGhosh) · jyotishkaghosh8@gmail.com
