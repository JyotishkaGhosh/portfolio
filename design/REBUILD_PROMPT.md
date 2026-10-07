# Rebuild: pink voxel-desktop portfolio

Replace the current Pinterest-board portfolio entirely with a pink, blocky, voxel-style "desktop" portfolio.
Read CLAUDE.md first. Never commit or push.

## Design references (match these closely)
- `design/desk.png`: desktop home screen
- `design/folder.png`: the projects/ folder opened as a file explorer
- `design/kairo.png`: a project file opened in its own window
- `design/phone.png`: phone layout
- `design/mockup.html`: the static mockup that produced the pictures. Reuse its colours, pixel borders, the isometric voxel-cube look, the sprite icons and the layout.

The style is *inspired by* blocky voxel games, but it must stay original. Do NOT use any Minecraft logo, name, font, textures, skins, characters (no Steve, Alex, creepers and so on) or sounds. Everything is drawn or modelled by us.

## Tech
- Keep Next.js 16 + TypeScript + Tailwind 4. Read the relevant guide in `node_modules/next/dist/docs/` before Next-specific code.
- 3D: `three`, `@react-three/fiber` and `@react-three/drei` for the characters and the big spinning block inside project windows. Load them client-only with `next/dynamic` (`ssr: false`).
- Desktop icons: lightweight CSS-3D or SVG isometric cubes (not a WebGL canvas per icon).
- Pixel fonts via @fontsource: `pixelify-sans`, `silkscreen`, `vt323`. Remove the old Bodoni, Pinyon and DM Sans fonts.
- Content stays in `app/content.ts`. Rework its shape as needed, but keep all text there.
- Delete the old Board, Covers, Decor and Photo components once nothing uses them.

## 1. Desktop (home)
- Wallpaper: pink pixel sky with blocky clouds and a pixel sun. At the bottom, a blocky pink landscape with cherry-blossom block trees. Clouds drift slowly.
- Desktop icons in a grid on the left: `about_me`, `projects/`, `experience`, `achievements`, `education`, `résumé.pdf`, `say_hi`.
  - Each icon is an isometric voxel block with a pixel sprite on its face and a label underneath.
  - Hover: the block lifts and tilts slightly. Single click selects it. Double-click (single tap on touch) opens its window.
  - Icons can be dragged around the desktop. Positions reset on reload.
- Welcome window `jyotishka.exe`, open on first load:
  - "JG" pixel monogram (no photo)
  - "PLAYER 1 · KOLKATA"
  - "Jyotishka Ghosh" with a **GTM Engineer** tag
  - Intro: I build the pipelines, automations and ML models behind go-to-market, and I've closed the deals myself.
  - Buttons: ▶ start exploring (opens projects/), résumé.pdf, linkedin, github
  - Footer stats: 5 internships · 4 live products · ₹35L ACV closed. **No CGPA here.**
- "Achievement unlocked! ₹35L enterprise ACV closed" toast slides in from the top-right a second after load and auto-hides after ~6s.
- Taskbar hotbar at the bottom:
  - "JG ✦" start button that opens a small menu: about, projects, résumé, contact, theme
  - 9 hotbar slots holding the main blocks, with the active window's slot highlighted
  - Theme toggle (pink day / plum night). Remember it in localStorage inside try/catch, default to the system preference, and no flash of the wrong theme.
  - Sound-effects toggle (default OFF)
  - Live clock

## 2. Windows (all of them)
- Pixel-bordered windows like the mockup, with a title bar and _ □ × buttons.
- Draggable by the title bar. Click to bring to front. × closes, _ minimises to the hotbar, □ maximises.
- Several windows can be open at once. Opening one plays a small "pop" scale animation.
- Esc closes the top window.
- `about_me`: the intro, sales brain + engineer hands, and the statement "Most engineers have never sold. Most sellers have never shipped. I've done both."
- `experience`: each job as a "save file" row (Anything.ai first, highlighted, with its stats), click to expand.
- `achievements`: an achievements grid (hackathons, GirlScript, McKinsey Forward and so on), each with a trophy sprite and an "unlocked" style.
- `education`: degree, college, years (the CGPA can show here)
- `résumé.pdf`: opens `/Jyotishka_Ghosh_Resume.pdf` in a new tab
- `say_hi`: email (with a copy button), LinkedIn and GitHub

## 3. projects/ folder → separate project files
- Double-clicking `projects/` opens a file-explorer window like `design/folder.png`:
  - Back/forward buttons and the path `C:\jyotishka\desktop\projects`
  - A working search box that filters files
  - Sidebar quick filters: all, AI / ML, data pipelines, web apps
  - A large-icon grid AND a list view (name, type, live at, date)
  - Status bar: "4 items · N selected"
- Files: `Kairo.exe`, `SignalStack.exe`, `Safar.exe`, `Matilda.exe`. Each is a voxel block with a ● LIVE tag. **Synthify is not included.**
- Double-clicking a file opens its own project window like `design/kairo.png`:
  - Left: a large 3D block (react-three-fiber) that idles slowly and can be dragged to spin
  - Right: the screenshot from `public/pins/<name>.png` in a browser-frame, then the blurb
  - "INVENTORY · STACK" as item slots, one per tech
  - "QUESTS COMPLETED" as ✔ bullets
  - Buttons: ▶ open live site, source (if any), ◀ back to projects/
  - Kairo's headline stat must read: "96% of deals scored 90%+ won — 195-deal backtest on simulated data"

## 4. The three companions (bottom-right corner, above the taskbar)
Three small, cute, original blocky 3D characters built from boxes in react-three-fiber, in a transparent canvas:
- **Girl** (me): pink outfit, long dark hair blocks, a little pink bow.
- **Boy** (my boyfriend): plum or blue hoodie, short dark hair.
- **Kitty**: small blocky cat, cream/white with pink ears and nose, a long jointed tail.
- Soft, rounded-feeling proportions: big heads, tiny bodies, simple pixel faces (dot eyes, blush squares). Clearly original characters, not any game's skins.

Idle animation (always running, slow and gentle):
- The girl and boy **hold hands** (inner arms angled toward each other, hands meeting) and **sway/rock together** slowly side to side, with a tiny bob.
- They blink every few seconds.
- The kitty sits beside them and **swishes its tail continuously** (smooth sine wave through the tail segments).

Cursor interactions (per character, using pointer-enter/leave on each model's hit box):
- Hover the girl or the boy: that character lets go and does a **"hi" wave** (raises the outer arm and waves 2–3 times), with a small pixel speech bubble ("hi!" for each). When the pointer leaves, they take hands again and resume swaying.
- Hover the kitty: it **licks itself** (head turns down to its paw, paw lifts, little lick loop) with a tiny "♡". When the pointer leaves, it returns to sitting with the tail swish.
- On touch devices, a tap triggers the same gesture for ~2 seconds.
- Tiny shadow under them. Small hearts float up occasionally from between the couple.
- Keep it light: one canvas, low poly, `frameloop` paused when the tab is hidden, and `dpr` capped at 2.
- On phones, scale them down and keep them in the corner without covering the dock.
- With prefers-reduced-motion, show them standing still holding hands, and play gestures only on tap.

## 5. Phone layout (match design/phone.png)
- Status bar, the `jyotishka.exe` intro card, a 3-column grid of block "apps", the achievement toast, and a 4-slot dock (about_me, projects/, résumé, say_hi).
- Windows open full-screen with a ◀ back button. No dragging on phones.
- Companions are smaller, in the corner above the dock.

## 6. Quality
- Accessible: icons and files are real buttons with labels, keyboard navigation works (arrow keys move the selection, Enter opens), and focus rings are visible.
- Text stays readable: pixel fonts for headings and labels only, VT323 or a clear font for longer text.
- Respect prefers-reduced-motion everywhere.
- Update the metadata in layout.tsx: title "Jyotishka Ghosh — GTM Engineer", plus a matching description.
- Update README.md to describe the new desktop portfolio, and CLAUDE.md for the new structure.
- Run `npm run build` and `npx eslint app`; both must pass. Then tell me what you built and anything you couldn't do.
