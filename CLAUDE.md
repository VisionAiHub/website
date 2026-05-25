# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **VisionAiHub** — a Germany-based AI consulting company. Built to replace the legacy Wix site at https://www.visionaihub.com (still live during migration — reference for copy/structure). The cutover plan and DNS steps live in [README.md](README.md).

## Stack

- **Next.js 16** (App Router, Turbopack dev server)
- **React 19**
- **Tailwind CSS 3**
- **MDX** for blog posts (via `@next/mdx`, `gray-matter`)
- **TypeScript** strict mode
- **lucide-react** for icons
- Hosting target: **Vercel**

## Commands

```bash
npm run dev      # Dev server on :3000 (Turbopack)
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint via next lint
```

There are no tests yet.

## Architecture (the parts that need reading multiple files to understand)

### Single source of truth for site-wide data
- [src/lib/site.ts](src/lib/site.ts) — brand info, nav items, locations, email, social. Header, Footer, root layout, metadata, JSON-LD all import from here. **Change this file, not individual components.**
- [src/lib/content.ts](src/lib/content.ts) — `services` and `industries` arrays. Both the homepage sections and the dedicated `/services` and `/industries` pages render from these arrays. Adding or editing items propagates automatically.

### Root layout responsibilities
[src/app/layout.tsx](src/app/layout.tsx) is where global concerns live: `<Header>`, `<Footer>`, the Organization JSON-LD `<script>`, and the default `metadata` object (title template, OG, Twitter, canonical). Per-page `metadata` exports merge into this.

### MDX blog pipeline
- Posts: `.mdx` files in [content/blog/](content/blog/) with YAML frontmatter (`title`, `description`, `date`, optional `author`, `tags`).
- [src/lib/blog.ts](src/lib/blog.ts) reads the directory at build/request time using `fs` + `gray-matter` to produce post metadata for the index.
- [src/app/blog/page.tsx](src/app/blog/page.tsx) lists all posts.
- [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) statically generates each post via `generateStaticParams` and dynamically `import()`s the MDX module.
- [mdx-components.tsx](mdx-components.tsx) at the repo root maps default MDX elements (`h1`, `p`, `ul`, etc.) to Tailwind-styled components — required by `@next/mdx`.

### MDX + Turbopack gotcha
`next.config.mjs` configures remark/rehype plugins as **string references** (`[['remark-gfm']]`), not imported function references. Turbopack requires plugin options to be JSON-serializable, so importing the plugin and passing the function will crash the dev server with `does not have serializable options`. Keep the string-array form when adding plugins.

### Next 16 auto-rewrites `tsconfig.json`
On `npm run dev`, Next.js silently overwrites `jsx: "preserve"` → `"react-jsx"` and appends `.next/dev/types/**/*.ts` to `include`. This is intentional — don't revert it.

### Environment
Platform is Windows, but the shell is **bash** (Git Bash / WSL-style). Use Unix syntax: forward-slash paths (`c:/Users/...`), `/tmp` for scratch files, `&&` to chain. Don't write PowerShell or `cmd` commands.

### Tailwind theme
Custom `brand` (blue) and `ink` (neutral) palettes in [tailwind.config.ts](tailwind.config.ts). Reusable component classes (`container-page`, `btn-primary`, `btn-secondary`, `eyebrow`, `section`) are defined in [src/app/globals.css](src/app/globals.css) under `@layer components`. Prefer those over re-deriving the same Tailwind chains across pages.

### Path alias
`@/*` → `./src/*` (configured in [tsconfig.json](tsconfig.json)). Imports use `@/components/...`, `@/lib/...`.

## Conventions worth following

- **No client components unless needed.** Only [Header.tsx](src/components/Header.tsx) is `'use client'` (uses `useState` for the mobile menu toggle). Everything else is a server component — keep it that way for performance.
- **Don't hardcode brand strings on a page** — pull from `site.ts` so a rename only happens in one place.
- **Don't duplicate the services/industries lists** — render from `content.ts`.
- Per-page metadata: export `metadata` (or `generateMetadata` for dynamic routes). Don't put `<title>` tags directly in JSX.
