# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

> **This is a template.** It seeds every **thecolab.ai Impact for Good** build. Treat the sections below as a starting point — as the project takes shape, **keep this file updated to reflect the actual direction, stack, and conventions of the build**. A stale CLAUDE.md is worse than none; revise it whenever architecture, goals, or workflows change.

## What is this?

A **thecolab.ai Impact for Good** build — a project from TheColab's community programme that uses AI and software to create positive social, environmental, or community impact in Aotearoa New Zealand.

Each build lives in its own dated folder (e.g. `impact-2026-06-05/`). Fill in the specifics below as the project's purpose, audience, and success criteria become clear.

- **Project name:** _TBD — update once decided_
- **Impact goal:** _What good does this do, and for whom?_
- **Primary users:** _Who uses it?_
- **Success looks like:** _How do we know it worked?_

## Skills — use the shared library first

Before building, reach for TheColab's shared skills library:

**https://github.com/thecolab-ai/.skills**

It contains reusable, vetted skills for common Impact for Good build tasks. Check there for an existing skill that fits before writing something from scratch, and prefer those patterns so builds stay consistent across the programme. If you create something broadly useful during this build, consider contributing it back.

## Stack

_Update this section to match what the build actually uses._

The starter in `impact-2026-06-05/` is a Next.js app (TypeScript, Tailwind, Biome, Vitest, pnpm). Common commands:

```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # production build
pnpm lint         # Biome
pnpm test         # Vitest
```

## Conventions

- Use British/NZ English in content and user-facing copy (organisation, colours), American English in code.
- Follow thecolab.ai branding — invoke the `thecolab-branding` skill for exact colours, typography, voice, and component patterns.
- Keep commits focused; lint and test before pushing.

## Keeping this file current

This CLAUDE.md should evolve with the build. **Whenever the project's direction, architecture, stack, or workflow changes, update this file to match.** Capture decisions, gotchas, and conventions here so the next session (human or Claude) starts with accurate context.
