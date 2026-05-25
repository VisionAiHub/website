# VisionAiHub Website

Modern, code-driven replacement for the Wix site at https://www.visionaihub.com.

Built with **Next.js 16** (App Router) + **Tailwind CSS** + **MDX** for content.

---

## Quickstart

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack, fast refresh) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  app/              # App Router routes (pages)
    page.tsx        # /
    services/       # /services
    industries/     # /industries
    about/          # /about
    contact/        # /contact
    blog/           # /blog and /blog/[slug]
    layout.tsx      # Root layout (Header, Footer, JSON-LD, metadata)
    globals.css     # Tailwind + custom utilities
  components/       # Header, Footer
  lib/
    site.ts         # Brand constants (name, nav, locations, contact)
    content.ts      # Services & industries data
    blog.ts         # MDX post loading helpers
content/blog/       # Blog posts as .mdx files
mdx-components.tsx  # Default MDX renderer styling
```

## Editing content

- **Services / industries**: edit `src/lib/content.ts`.
- **Brand info, navigation, locations, email, social**: edit `src/lib/site.ts`.
- **Pages**: edit the `page.tsx` under each route folder.
- **Blog posts**: drop a new `.mdx` file in `content/blog/` with this frontmatter:

  ```mdx
  ---
  title: "Post title"
  description: "Short summary used for SEO and the blog index."
  date: "2026-05-23"
  author: "VisionAiHub Team"
  tags: ["genai"]
  ---

  # Heading

  Markdown / MDX body.
  ```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — accept defaults and deploy.
4. The first deploy will give you a URL like `visionaihub-website.vercel.app`.

## Migrating from Wix (cutover plan)

1. Build out remaining content (case studies, full About, team) on this codebase.
2. Deploy to Vercel — verify on the preview/production Vercel URL.
3. In Vercel project → **Settings → Domains**, add `visionaihub.com` and `www.visionaihub.com`.
4. In your DNS provider (currently Wix nameservers), update the records as Vercel instructs:
   - `A` record for the apex pointing to Vercel's IP, **or** transfer the domain to Vercel.
   - `CNAME` for `www` to `cname.vercel-dns.com`.
5. Once propagation is complete and HTTPS is issued, disable the Wix site.

> Tip: do this on a low-traffic day. Lower DNS TTLs to ~5 minutes 24h before cutover so you can roll back fast.

## SEO already configured

- Per-page `<title>` and `<meta description>` via Next.js Metadata API.
- Organization JSON-LD in `<head>` of every page (locations, contact, social).
- Canonical URL + Open Graph + Twitter card.

When you're ready, add `app/sitemap.ts` and `app/robots.ts` for sitemap.xml / robots.txt.
