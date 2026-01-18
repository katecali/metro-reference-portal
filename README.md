# Metro Reference Portal

A fast, clean **reference portal** (not an MDT) built with **React + Vite + Tailwind + shadcn/ui**.

## What’s inside

- **Command Palette** (Ctrl/⌘ + K) to jump around instantly
- **Deep links** via query params (e.g. `/?tab=penal&q=robbery`)
- **Penal codes**: favorites, filters, charge sheet + totals + copy-to-clipboard
- **Quick Reference** cards: Miranda, search & seizure, traffic stop checklist, reporting template
- **Settings**: dark theme + large text toggle
- **Static-host ready** (Vercel, Netlify, Cloudflare Pages)

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Output folder: `dist/`

## Deploy (free)

### Vercel
1. Push this repo to GitHub
2. Import into Vercel
3. Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

`vercel.json` already includes SPA rewrites.

### Netlify
1. New site from Git
2. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

`netlify.toml` + `public/_redirects` already handle SPA routing.

### Cloudflare Pages
1. Create a Pages project connected to your GitHub repo
2. Settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

`public/_redirects` works for SPA fallback.

## Data updates
Edit data in:
- `src/data/codes.ts`

