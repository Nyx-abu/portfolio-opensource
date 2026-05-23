# Deployment Checklist

A pre-flight list for shipping this portfolio to production.

## 1. Database (Neon — free tier)

- [ ] Sign up at https://neon.tech
- [ ] Create a project (single region close to your audience)
- [ ] Copy the **pooled** connection string from the dashboard
- [ ] Set it as `DATABASE_URL` in Vercel (Project Settings → Environment Variables)

## 2. NextAuth

- [ ] Generate a secret:
  - macOS/Linux: `openssl rand -base64 32`
  - Windows PowerShell: `[Convert]::ToBase64String((1..32 | %{Get-Random -Max 256}))`
- [ ] Set `AUTH_SECRET` in Vercel
- [ ] Set `AUTH_URL` to your production URL (e.g. `https://yourdomain.com`)

## 3. Admin bootstrap

- [ ] Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (used by `prisma/seed.ts`)
- [ ] Run `npx prisma migrate deploy` against the production DB (or `npx prisma db push` if you haven't created a migration yet)
- [ ] Run `npm run db:seed` once to create the admin user
- [ ] Sign in at `/admin/login` and change the password (TODO: add a settings page; for now update the user manually via Prisma Studio: `npm run db:studio`)

## 4. Storage

This template stores uploads in `public/uploads`. On Vercel that filesystem is read-only at runtime, so for production you should swap to object storage. Free-tier options:

- [ ] **Cloudflare R2** — 10 GB free, S3-compatible
- [ ] **Supabase Storage** — 1 GB free
- [ ] **Vercel Blob** — 1 GB free, zero config inside Vercel

Update `src/app/api/admin/upload/route.ts` to write to one of these instead of the local filesystem.

## 5. Analytics (optional, all free tier)

- [ ] **Vercel Analytics** — toggle on in Vercel dashboard, no env var needed
- [ ] **PostHog** — sign up at https://posthog.com → copy project key → set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## 6. Domain & site URL

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production URL (used for canonical URLs, OG images, sitemap)
- [ ] Add your custom domain in Vercel and update DNS
- [ ] Update social and Open Graph defaults in `src/lib/metadata.ts`

## 7. SEO sanity check

- [ ] Visit `/sitemap.xml` — should list home, /projects, and each published project
- [ ] Visit `/robots.txt` — should disallow `/admin` and `/api`
- [ ] Visit `/opengraph-image` — should return a 1200×630 PNG
- [ ] Submit sitemap in Google Search Console

## 8. Pre-deploy checks

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds locally
- [ ] Lighthouse run on the deployed preview — aim for ≥95 on all axes

## 9. Going live

- [ ] Push to your repo, Vercel auto-deploys
- [ ] Smoke test: home, /projects, a project detail page, /admin/login
- [ ] Add a featured project from /admin to verify the full content pipeline
