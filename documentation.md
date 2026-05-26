# Documentation

Comprehensive reference for the portfolio project. For onboarding and design guidance see `PORTFOLIO_BRIEF.md`; for repo-management rules see `HANDOVER.md`.

---

## 1. Architecture

| Layer | Stack |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC by default) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables in `src/styles/globals.css` |
| Database | PostgreSQL (Neon) via Prisma |
| Auth | NextAuth v5 (credentials provider, JWT sessions) |
| Media | Cloudinary (images, video, raw docs) |
| Motion | Framer Motion + Lenis smooth scroll |
| Analytics | First-party (`/api/analytics`) + optional PostHog |
| Deploy | Vercel |

### Directory layout

```
src/
  app/                Routes (public + admin + api)
    page.tsx          Home composition
    projects/         Index and dynamic [slug]
    admin/            Login, dashboard, CRUD pages
    api/              projects, analytics, admin/upload, auth, github/*
    sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  components/
    ui/               Primitives (Text, Container, Section, Grid, Button, Card, Tag, Badge, Divider)
    motion/           FadeIn, RevealText, ScaleIn, MagneticButton, ParallaxContainer, ViewTransition
    sections/         Hero, About, Projects, ProjectCard, ProjectsBrowser, Experience, Contact, Footer, Nav
    admin/            AdminShell, ProjectEditor, ProjectRowActions, GitHubImporter, About/Skills/Social/Experience editors
    providers/        SmoothScroll, SessionProvider, Analytics
  lib/
    db.ts             Prisma client singleton
    auth.ts           NextAuth config (credentials + JWT)
    actions/          Server actions (projects, about, skills, social, experience) — zod-validated
    data.ts           Public read queries with safe fallbacks
    cloudinary.ts     Cloudinary upload wrapper
    crypto.ts         AES-256-GCM for GitHub token at rest
    github.ts         GitHub OAuth + API client
    rate-limit.ts     Sliding-window in-memory rate limiter
    fonts.ts          Font registrations (display + body + mono)
    motion.ts         Easing + duration presets
    metadata.ts       Site identity + buildMetadata factory
    analytics.ts      Client track() — fires to /api/analytics
  middleware.ts       Auth gate for /admin/* + site-wide security headers
prisma/
  schema.prisma       Models: User, Project, Experience, Skill, SocialLink, AboutContent, GitHubToken, AnalyticsEvent
  seed.ts             Idempotent upserts (pass --reset to wipe content)
public/
  fonts/              Self-hosted display fonts
```

### Data flow

- **Public reads** flow through `lib/data.ts`, which wraps Prisma queries in try/catch so a DB outage degrades gracefully to empty states rather than 500s.
- **Mutations** go through `lib/actions/*` — every action runs `requireAdmin()`, validates with zod, and calls `revalidatePath()` on the affected routes.
- **Client-side state** is intentionally thin: optimistic UI in `ProjectRowActions`, autosave timers in the project editor, and a `useTransition` for non-blocking updates.

---

## 2. Authentication

Credentials-only NextAuth setup. Single admin user is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars via `prisma/seed.ts`.

- **Strategy**: JWT (no DB session lookups; faster cold starts on Vercel).
- **Adapter**: Prisma — used only for the user record, not session storage.
- **Gate**: `src/middleware.ts` blocks unauthenticated requests to `/admin/*` and bounces logged-in users away from `/admin/login`.
- **Server-side check**: `requireAdmin()` (in `lib/actions/_helpers.ts`) is called inside every mutation. Re-checks the session and role, even though the middleware already gated the route — defense in depth.

### Changing the admin password

There is no in-app change-password UI yet (intentional — single-operator). Replace `passwordHash` directly in Prisma Studio:

```bash
npm run db:studio
# In the User table, set passwordHash = bcrypt.hash(newPass, 12)
```

---

## 3. Design system

The look is editorial, cinematic, monochrome with a single cobalt accent (`#3B5BDB`). Full design rules are in `PORTFOLIO_BRIEF.md`. Short version:

- **Typography**: A narrow display face for headlines, a humanist sans for body, a mono for labels. Display sizes are deliberately huge; do not add a third display font.
- **Palette**: black / off-white / grayscale + one accent used sparingly. No gradients, no glassmorphism.
- **Motion**: Framer Motion only. Every animated component wraps in a `useReducedMotion()` check (the primitives in `components/motion/` already do this).
- **Spacing**: 4/8/12/16/24/32/48/64/96/144. Container widths and grid scales live in `tailwind.config.ts`.
- **Custom cursor**: enabled site-wide. The admin uses the native cursor — the cursor component is disabled inside `/admin/*` for usability.

---

## 4. Admin panel

`/admin` (gated by `middleware.ts`). Surface:

| Section | Purpose |
| --- | --- |
| Dashboard | Glance at counts and recent analytics |
| Projects | CRUD with autosave, drag-reorder, image/video/doc upload, GitHub auto-import |
| About | Headline + body, live preview |
| Skills | Grouped by category |
| Social | Drag-reorder list of platform + URL |
| Experience | Timeline entries with `current` flag |
| Analytics | 30-day chart, device/browser/referrer breakdowns, top projects |

### Autosave

`ProjectEditor` debounces field changes and posts to the `updateProject` server action every ~30s when dirty. Manual save is also available.

### Upload pipeline

All uploads route through `POST /api/admin/upload`. The route:

1. Verifies the session and admin role.
2. Applies a rate limit (default 60 uploads / minute per admin).
3. Rejects files > 50 MB or with disallowed extensions / MIME types.
4. Verifies the binary magic bytes match the declared MIME (skipped for text formats).
5. Sanitizes the filename (strips path separators, traversal segments, non-alphanumerics, length-caps to 60 chars).
6. Streams the buffer to Cloudinary and returns the secure URL + public ID.

---

## 5. GitHub integration

Optional admin feature. When configured, the projects page exposes a panel that lists the admin's GitHub repos and auto-imports any of them as a draft project.

### OAuth flow

1. Admin clicks **Connect GitHub** → `GET /api/github/authorize`.
2. Route mints a cryptographic state token, stores it in an `HttpOnly` cookie, and redirects to GitHub's authorization URL with scope `public_repo` (read-only).
3. GitHub redirects to `GET /api/github/callback?code&state`. The route verifies the state cookie (CSRF check), exchanges the code for an access token, encrypts the token with AES-256-GCM, and upserts it into the `GitHubToken` table.
4. The plaintext token is never stored, never logged, never sent to the client.

### Import flow

`POST /api/github/import` with `{ owner, repo }`:

- Decrypts the stored token and fetches repo metadata, topics, and languages.
- Scans for screenshots in `screenshots/`, `docs/images/`, `docs/screenshots/`, `assets/`, and the repo root (`*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.webp`, `*.avif`).
- Searches for `documentation.md`, `DOCUMENTATION.md`, or `docs/documentation.md`. Falls back to `README.md` if none of those exist.
- Downloads up to 6 images and the documentation file, uploads them to Cloudinary.
- Returns auto-filled project data; the client then calls `createProject` and redirects to the editor for the new draft.

### Failure modes

- **No documentation found**: The import still succeeds; the UI flags it with a banner so the admin can write docs manually.
- **GitHub rate limit exhausted**: The API client throws if `X-RateLimit-Remaining` hits zero. The admin sees the error in the importer banner.
- **Token decryption failure**: Means the encryption key was rotated — the admin has to reconnect GitHub.

---

## 6. Security

| Concern | Mitigation |
| --- | --- |
| Unauthorized admin access | Middleware gate on `/admin/*` + `requireAdmin()` inside every server action |
| CSRF on OAuth | Cryptographic `state` parameter validated against `HttpOnly` cookie |
| XSS / clickjacking | CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` set in middleware |
| HTTPS downgrade | `Strict-Transport-Security` header (prod only) |
| Token leakage at rest | GitHub tokens encrypted with AES-256-GCM before DB write |
| Brute-force auth | Rate limit (10 attempts / minute per user) — apply in your auth provider if needed |
| Upload abuse | Rate limit (60 / minute), size cap (50 MB), MIME/extension allowlist, magic-byte verification, filename sanitization |
| GitHub API abuse | Per-admin rate limit (30 / minute) + GitHub's own rate-limit header respected |

### Rate limiter

`lib/rate-limit.ts` is an in-memory sliding-window limiter keyed by user id (falling back to IP). On Vercel the store is per-instance, so the effective limit under heavy fan-out is higher than configured — acceptable for an admin-only surface used by one operator. Move to Upstash / Redis if you ever expose these endpoints to anonymous traffic.

### Token encryption

`lib/crypto.ts` wraps Node's `crypto.createCipheriv("aes-256-gcm", ...)`. The encryption key is read from `GITHUB_TOKEN_ENCRYPTION_KEY` (32-byte hex). Each ciphertext is stored alongside its IV (96-bit random) and auth tag, base64-encoded.

---

## 7. Deployment

### Vercel

1. Import the Git repo into Vercel.
2. Add every variable from `.env.example` to **Project Settings → Environment Variables**. Set `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Add a new GitHub OAuth App (or update the existing one) with the production callback URL: `https://<your-domain>/api/github/callback`.
4. Deploy. First boot will run `prisma generate` automatically via the postinstall hook.
5. After deploy, run `npm run db:push` once locally against the production `DATABASE_URL` to apply the schema. (Or wire it into the build command — `prisma db push && next build` — if you prefer.)

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon recommended) |
| `AUTH_SECRET` | NextAuth JWT signing secret |
| `AUTH_URL` | Public base URL (e.g. `https://your-domain.com`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin credentials |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Media uploads |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (optional) |
| `GITHUB_TOKEN_ENCRYPTION_KEY` | 32-byte hex; required if GitHub OAuth is enabled |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | Analytics (optional) |
| `NEXT_PUBLIC_SITE_URL` | Public URL used in metadata, sitemap, OG images |

---

## 8. API reference

### Public

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | List published projects |
| `POST` | `/api/analytics` | Record a client-side analytics event |

### Admin (session required)

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/admin/upload` | Upload image / video / doc to Cloudinary |

### GitHub OAuth (session + role check)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/github/authorize` | Redirect to GitHub authorization with CSRF state cookie |
| `GET` | `/api/github/callback` | Exchange code for token, encrypt, store, redirect to admin |
| `GET` | `/api/github/repos` | Returns `{ connected, user, repos[] }` |
| `POST` | `/api/github/import` | Body: `{ owner, repo }`. Returns auto-filled project data |

### Auth

| Method | Path | Description |
| --- | --- | --- |
| `POST`/`GET` | `/api/auth/[...nextauth]` | NextAuth handlers (sign-in / sign-out / callbacks) |

---

## 9. Local development

```bash
npm install
cp .env.example .env       # then fill in values
npm run db:push            # apply schema to your Postgres
npm run db:seed            # seed admin user + sample content
npm run dev                # http://localhost:3000
```

Common commands:

```bash
npm run typecheck          # tsc --noEmit
npm run lint               # next lint
npm run build              # production build
npm run db:studio          # Prisma Studio GUI
npx tsx prisma/seed.ts --reset   # wipe content tables, reseed
```

---

## 10. Extending

- **Adding a new model**: edit `prisma/schema.prisma`, run `npx prisma generate`, then `npm run db:push`. Add a corresponding `lib/actions/<entity>.ts` with `requireAdmin()` + zod + `revalidatePath`.
- **Adding a public section**: drop a component into `components/sections/`, compose it from `src/app/page.tsx`. Pull data from `lib/data.ts` server-side.
- **Adding an admin page**: create `src/app/admin/<route>/page.tsx`. It is gated automatically by the middleware. Use the `AdminShell` for consistent chrome.
- **Adding a server action**: every new action must call `requireAdmin()`, parse input through zod, and revalidate affected paths.

---

## 11. Known limitations

- In-memory rate limiter (see §6); upgrade to Upstash for multi-instance or anonymous traffic.
- No automated tests — add Vitest when there is real logic worth testing.
- No password-change UI (intentional for solo operator; edit `passwordHash` via Prisma Studio).
- No CSRF token on regular admin form submissions — protected by same-site cookies and `requireAdmin()` on the server action, which is sufficient for an authenticated single-user surface.
