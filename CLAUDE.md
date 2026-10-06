# Jyotishka Ghosh — portfolio

Pinterest-style personal portfolio in soft pink. Next.js 16 (App Router, Turbopack) + Tailwind 4 + Framer Motion.
Owner: Jyotishka Ghosh (GitHub: JyotishkaGhosh). Deployed on Vercel.

## Rules
- NEVER run `git commit` or `git push`. Jyotishka makes every commit herself — only her name may appear in GitHub contributors (no Claude co-author lines, no bot commits).
- Next.js 16 has breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- Don't read the current date/time during render (Next 16 prerender error) — hard-code values instead.
- Fonts come from @fontsource packages imported in `app/layout.tsx`, not `next/font/google`.
- Keep the look: soft pink "dreamy" palette (tokens in `app/globals.css`), Bodoni Moda serif, Pinyon Script, DM Sans, bows/hearts/sparkles.
- Light + dark themes: colours are CSS variables in `app/globals.css` (`[data-theme="dark"]` block). Use the tokens (`bg-paper`, `text-ink`, `text-snow` for text on berry/wine cards, `bg-veil` for overlays) — never hard-code hex in components. `dark:` follows `data-theme`.
- Run `npm run build` and `npx eslint app` after changes; both must pass.

## Where things live
- `app/content.ts` — ALL text, links, numbers, projects, jobs. Edit content here, never in components.
- `app/layout.tsx` — metadata + the inline script that sets `data-theme` before first paint.
- `app/components/Board.tsx` — top bar, profile header (JG monogram), filter chips, masonry board, pin close-up.
- `app/components/ThemeToggle.tsx` — sun/moon pill; saves the choice in localStorage (`theme`).
- `app/components/Decorate.tsx` — "✦ decorate" sticker tray (client-only, max 60, nothing saved).
- `app/components/Covers.tsx` — artwork for each pin type.
- `app/components/Decor.tsx` — Bow, Heart, Sparkle SVGs.
- `public/pins/{kairo,signalstack,safar,matilda}.png` — 1280×800 project screenshots (designed covers show if a file is missing).
- `public/Jyotishka_Ghosh_Resume.pdf` — résumé.

## Live projects (for screenshots)
- Kairo — https://kairo-five-nu.vercel.app/
- SignalStack — https://signalstack-theta.vercel.app/
- Safar — https://safar-beta.vercel.app/
- Matilda — https://neurodiverse-app.vercel.app/
