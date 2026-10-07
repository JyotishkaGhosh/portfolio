# Jyotishka Ghosh — portfolio

Pink voxel-style "desktop" portfolio. Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind 4 + three.js via @react-three/fiber and drei.
Owner: Jyotishka Ghosh (GitHub: JyotishkaGhosh). Deployed on Vercel.

## Rules
- NEVER run `git commit` or `git push`. Jyotishka makes every commit herself — only her name may appear in GitHub contributors (no Claude co-author lines, no bot commits).
- Next.js 16 has breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- Don't read the current date/time during render (Next 16 prerender error). The clock uses `useSyncExternalStore` with a `--:--` server snapshot.
- three.js code only loads in the browser: import it with `next/dynamic(..., { ssr: false })` from a client component (see `Desktop.tsx`, `ProjectWindow.tsx`).
- Style is *inspired by* blocky voxel games but must stay original: no Minecraft logo, name, font, textures, skins, characters or sounds.
- Fonts come from @fontsource packages imported in `app/layout.tsx` (Pixelify Sans, Silkscreen, VT323), not `next/font/google`. Pixel fonts (`font-pixel`, `font-px`) are for headings and labels only; longer text uses `font-vt` at 19px or larger.
- Light ("pink day") + dark ("plum night") themes: UI colours are CSS variables in `app/globals.css` (`[data-theme="dark"]` block). Use the tokens (`bg-paper`, `text-ink`, `border-line`, `bg-hot`, `text-snow`, `bg-night`, `text-candy`...) — never hard-code hex in component markup. `dark:` follows `data-theme`. Artwork palettes (cube colours in `voxel.ts`, badge sprites in `Cube.tsx`, character colours in `Companions.tsx`) are data and stay hex.
- Custom component classes in `globals.css` (`.win`, `.px-btn`, `.slot`...) live in `@layer components` so Tailwind utilities can override them.
- Respect `prefers-reduced-motion` in every new animation.
- Run `npm run build` and `npx eslint app` after changes; both must pass.

## Where things live
- `app/content.ts` — ALL text: bio, labels, window titles, button text, projects, jobs, achievements, education. Edit content here, never in components.
- `app/layout.tsx` — metadata, fonts, and the inline script that sets `data-theme` before first paint.
- `app/components/Desktop.tsx` — the window manager (open/close/focus/min/max/move reducer), Esc handling, hotbar slots, page layout.
- `app/components/Window.tsx` — pixel window frame: title-bar drag, _ □ ×, pop animation; full screen with a ◀ back button on phones.
- `app/components/apps.tsx` — window contents: jyotishka.exe (Welcome), about_me, experience, achievements, education, say_hi.
- `app/components/ProjectsFolder.tsx` — projects/ file explorer (history, search, quick filters, icon grid + details list, status bar).
- `app/components/ProjectWindow.tsx` — a project file's window (3D block, screenshot, stack slots, quests, links).
- `app/components/Block3D.tsx` — the drag-to-spin 3D block (react-three-fiber).
- `app/components/Companions.tsx` — the girl and her white kitty in one transparent canvas, standing on the grass just left of the big tree (sway, blink, she pets the kitty now and then; hover/tap: she waves "hi!", the kitty licks its paw with a ✦; tail swish). Keep it cute and playful, not romantic: no boyfriend, no hearts.
- `app/components/voxel3d.tsx` — shared 3D bits: box helper, chibi `Head`, hit boxes, the hover/tap gesture hook and `Bubble` (speech bubble anchored to a head; it portals into its own canvas container).
- `app/components/BlossomTree.tsx` — the big pixel cherry tree on the right (SVG): forked trunk, 3-tier canopy with flower pixels, slow sway, falling petals, petal burst on hover.
- `app/components/SkyBody.tsx` — the desktop sun / moon at ~65% across, ~10% down. It is drawn above icons and windows (z-65, pointer-events off) and windows open below it; the theme crossfades sun ↔ moon. Phones use the small `.sun` in `Wallpaper.tsx`.
- `app/components/Icons.tsx` — desktop blocks: default tidy column (CSS grid, top-to-bottom), then free drag to any spot. Icons never overlap each other or `[data-blocker]` elements (girl + kitty, big tree, sun); on an overlap the drop is nudged back toward where it came from. Marquee select, arrow keys + Enter.
- `app/components/Phone.tsx` — phone home: status bar, intro card, 3-column block grid, 4-slot dock (shown below 700px).
- `app/components/Taskbar.tsx` — "JG ✦" start menu, hotbar (only real items, no empty slots), theme + sfx toggles, footer credit, Kolkata clock (desktop only).
- `app/components/Toast.tsx` — "Achievement unlocked!" toast.
- `app/components/Wallpaper.tsx` — pixel sky, drifting clouds, a row of grass blocks (our own texture), and two seeded background cherry trees (`BG_TREES`: change a seed/shape/palette to grow a different tree) with falling petals.
- `app/components/voxel.ts` — block palettes, 8×8 sprites and seeded per-face pixel grids (shared by SVG icons and 3D textures).
- `app/components/Cube.tsx` — isometric SVG cubes (`<CubeDefs>` renders symbols once, `<Cube>` references them) + achievement badges.
- `app/components/hooks.ts` — media queries, theme, tab visibility, clock, sound effects (synthesised, off by default).
- `public/pins/{kairo,signalstack,safar,matilda}.png` — 1280×800 project screenshots.
- `public/Jyotishka_Ghosh_Resume.pdf` — résumé.
- `design/` — reference pictures and the static mockup the site was built from.

## Live projects (for screenshots)
- Kairo — https://kairo-five-nu.vercel.app/
- SignalStack — https://signalstack-theta.vercel.app/
- Safar — https://safar-beta.vercel.app/
- Matilda — https://neurodiverse-app.vercel.app/
