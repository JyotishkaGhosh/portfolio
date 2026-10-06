# Jyotishka Ghosh — my board ✦

A Pinterest-style portfolio in soft pink. Next.js 16 + Tailwind 4 + Framer Motion.

## Run it

```powershell
npm install
npm run dev
```
Open http://localhost:3000

## Make it yours

- **Your photo** → save it as `public/me.jpg` (a portrait works best). Until then a "JG" monogram shows.
- **Project screenshots** → save them in `public/pins/` as `kairo.png`, `signalstack.png`, `safar.png`, `matilda.png`.
  Any that are missing show a designed pink cover instead.
- **All text, links and numbers** → `app/content.ts`.
- **Résumé** → replace `public/Jyotishka_Ghosh_Resume.pdf`.

## Where things live

- `app/components/Board.tsx` — top bar, profile, filter chips, the masonry board and the pin close-up
- `app/components/Covers.tsx` — the artwork on each pin
- `app/components/Decor.tsx` — bows, hearts, sparkles
