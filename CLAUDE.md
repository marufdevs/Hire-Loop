# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

`hireloop_client` is the frontend for HireLoop (Assignment 9). It is currently a fresh shadcn/ui + Next.js template: one placeholder route (`app/page.tsx`) and a single UI component. There is no data layer, auth, env config, or backend integration yet.

## Commands

```bash
npm run dev        # Next.js dev server (Turbopack) on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (flat config: next core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
npm run format     # Prettier on **/*.{ts,tsx}
```

There is no test framework configured.

## Stack and versions

- **Next.js 16.4.5, App Router, React 19.3.** Per AGENTS.md, check the bundled docs in `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`, …) before using Next.js APIs. Don't rely on memory of older versions.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. There is no `tailwind.config.*`. All theme config lives in `app/globals.css` (`@theme inline`, plus `:root` / `.dark` CSS variables in OKLCH).
- **shadcn/ui, style `base-nova`** (`components.json`). Components are built on **Base UI (`@base-ui/react`)**, not Radix, so primitives use Base UI APIs (e.g. `ButtonPrimitive.Props`). Add components with `npx shadcn@latest add <name>`. They land in `components/ui/`. Icons: `lucide-react`.
- **`cn`** comes from the `cn` package (shadcn's drop-in replacement for clsx + tailwind-merge), re-exported from `@/lib/utils`. Prefer importing it from `@/lib/utils`.

## Architecture notes

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).
- `app/layout.tsx` loads the Geist and Geist Mono fonts as CSS variables (`--font-sans`, `--font-mono`) on `<html>` and wraps the app in `ThemeProvider`.
- Theming: `components/theme-provider.tsx` (client component) wraps `next-themes` with `attribute="class"` and a system default. It also registers a global **`d` hotkey** that toggles dark mode, ignored while typing in inputs. Tailwind's `dark:` variant is defined as `&:is(.dark *)` in `globals.css`, so it keys off the `.dark` class.
- Style components with the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, …) rather than raw colors, so light and dark both work.

## Conventions

- Prettier: no semicolons, double quotes, 2-space indent, `trailingComma: es5`, 80 cols, LF line endings. `prettier-plugin-tailwindcss` sorts classes, including inside `cn()` and `cva()`.
- `.env*` files are gitignored.
