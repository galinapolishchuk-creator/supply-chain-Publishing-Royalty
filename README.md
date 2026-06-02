# Publishing Royalty Breakdown — prototype

Interactive React (Vite) prototype: a filterable view of how publishing royalties
are formed and split across Works → Writers → Publisher.

Part of the SC Records design exploration. Sample data only.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/

> On a machine behind a corporate proxy you may need the system CA store:
> `NODE_OPTIONS=--use-system-ca npm install`

## What it does

- 4 filters — **Work / Writer / Publisher / Agreement** — narrow the visible works.
- Each Work card shows its Agreement, writer count, one Publisher, and per-writer
  Gross / Writers' Net / Publisher Net.
- Top totals stay global (filters narrow the list, they don't recompute the totals).

## Deploy

**GitHub Pages** (zero extra services): push to `main`; the workflow in
`.github/workflows/deploy.yml` builds and publishes. Then enable
*Settings → Pages → Source: GitHub Actions*. Live at
`https://<user>.github.io/<repo>/`.

**Vercel / Netlify**: import this repo; framework auto-detected (Vite),
build `npm run build`, output `dist`. No base-path config needed.
