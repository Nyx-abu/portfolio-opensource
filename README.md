# Portfolio

A production-grade Next.js 15 portfolio with a cinematic, editorial design language and a built-in admin CMS for managing projects, content, and analytics.

## Tech Stack

- **Framework:** Next.js 15 (App Router) · React 19 · TypeScript (strict)
- **Styling:** TailwindCSS · custom design tokens · local display fonts (DxPlayhigh, Kiya Handwrite) + Inter / JetBrains Mono
- **Motion:** Framer Motion · Lenis (smooth scroll)
- **Data:** PostgreSQL · Prisma ORM
- **Auth:** NextAuth v5 (credentials provider) with Prisma adapter
- **Analytics:** Custom event tracking (Prisma) + optional PostHog + optional Vercel Analytics
- **Validation:** Zod (server actions + API)

## Local setup

```bash
# 1. Install dependencies (already done if you scaffolded with /goal)
npm install

# 2. Copy env example and fill in values
cp .env.example .env

# 3. (First time only) push schema to your DB
npx prisma db push

# 4. Seed the database (creates admin user + sample content)
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the dashboard.

## Environment variables

All required vars live in `.env.example`. The important ones:

| Var | What it does | Where to get it (free) |
| --- | --- | --- |
| `DATABASE_URL` | Postgres connection string | [Neon](https://neon.tech) — free tier, 0.5 GB / instant project. Copy the pooled connection string. |
| `AUTH_SECRET` | NextAuth signing secret | Run `openssl rand -base64 32` (or PowerShell: `[Convert]::ToBase64String((1..32 \| %{Get-Random -Max 256}))`) |
| `AUTH_URL` | Your site origin | `http://localhost:3000` locally; full https URL in prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeds your first admin user | Pick anything — change password from `/admin` after first login |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional PostHog ingest | [PostHog cloud](https://posthog.com) — free 1M events/mo |
| `NEXT_PUBLIC_SITE_URL` | Used for canonical URLs, OG images, sitemap | `http://localhost:3000` locally |

## Project structure

```
src/
  app/
    (home, projects, project/[slug], admin/*, api/*)
  components/
    ui/        primitives — Text, Button, Container, Section, Grid, Card, Tag, Badge
    motion/    Framer Motion wrappers — FadeIn, RevealText, MagneticButton, ...
    sections/  Page sections — Hero, About, Projects, Experience, Contact, Footer, Nav
    admin/     Dashboard shell, editors, managers
    providers/ SmoothScroll, SessionProvider, Analytics
  lib/
    db.ts          Prisma client
    auth.ts        NextAuth config
    actions/       Server actions (projects, about, skills, social, experience)
    fonts.ts       Font loading
    motion.ts      Motion presets
    metadata.ts    SEO helpers
    analytics.ts   Client-side event tracker
    data.ts        Public read queries (with safe fallbacks)
  hooks/    useInView, useScrollProgress
  styles/   globals.css
prisma/
  schema.prisma  · Postgres schema for User, Project, Experience, Skill, SocialLink, AboutContent, AnalyticsEvent
  seed.ts        · Bootstraps admin + sample content
public/
  fonts/    Local display fonts
  uploads/  Image uploads (gitignored)
```

## Admin

Once seeded, sign in at `/admin/login` with the credentials from your `.env`.

Dashboard sections:

- **Dashboard** — overview, quick actions, recent activity
- **Projects** — create / edit (autosave every 30s), publish, feature toggle, image upload, ordering
- **About** — live preview editor for the homepage About copy
- **Skills** — grouped editor, inline updates
- **Social** — links shown in nav, footer & contact
- **Experience** — timeline entries
- **Analytics** — 30-day chart, devices, browsers, top projects, referrers

## Customising

- **Identity:** name, tagline, colors — `src/lib/metadata.ts`, `tailwind.config.ts`
- **Fonts:** swap `src/lib/fonts.ts` for any local OTF/WOFF, or use `next/font/google`
- **Sections:** every section lives in `src/components/sections` — break the templates further to match you
- **Design tokens:** `tailwind.config.ts` for type scale, spacing, accent palette, easing
- **Motion philosophy:** `PORTFOLIO_BRIEF.md` is the single source of truth — read it before touching the UI

## Performance notes

- Server Components for all data-fetching sections; only animated/interactive pieces are client components
- Local font files self-host with `next/font/local`
- Image optimisation via `next/image` (AVIF + WebP)
- `prefers-reduced-motion` respected globally and inside each motion primitive
- Sitemap + robots + structured data (Person + CreativeWork) included
- Dynamic OG images via Next.js `ImageResponse`

## Deployment

Recommended host: **Vercel** (free hobby tier). See `DEPLOYMENT_CHECKLIST.md`.
