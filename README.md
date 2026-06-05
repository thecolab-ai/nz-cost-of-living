# impact.template

A branded starter template by **[thecolab.ai](https://thecolab.ai)** — New Zealand's
community-driven AI consultancy. *AI expertise, built together.*

Next.js 15 + Tailwind v4 + shadcn/ui, pre-wired with thecolab.ai branding (warm-cream
theme, navy serif headings, the indigo→cyan accent gradient, and the Inter / Playfair
Display / JetBrains Mono type system). Use it as the starting point for new thecolab
apps and prototypes.

## Use this template

Click **"Use this template"** on GitHub, or:

```bash
gh repo create my-app --template thecolab-ai/impact.template --private --clone
```

## Getting started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## What's included

- **Next.js 15** (App Router) + **React 19**
- **Tailwind v4** with thecolab.ai brand tokens (`bg-brand-navy`, `text-brand-cyan`, the
  `from-brand-indigo to-brand-cyan` signature gradient, etc.)
- **shadcn/ui** component library (`src/components/ui`)
- **Biome** for lint/format, **Vitest** for tests
- Brand fonts via `next/font`: Playfair Display (headings), Inter (body), JetBrains Mono (code)

## Branding

The brand palette and shadcn token mappings live in
[`src/styles/globals.css`](./src/styles/globals.css) under the `THECOLAB.AI BRAND OVERRIDES`
section. Adjust there to retheme.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm test` | Run Vitest |
| `pnpm lint` | Biome check |
| `pnpm lint:fix` | Biome check + autofix |
