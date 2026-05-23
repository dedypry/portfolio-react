# Dedy Priyatna · Portfolio

A modern, animated personal portfolio for **Dedy Priyatna** — Engineering Lead & Full-Stack Architect — with a fullstack admin panel for managing content.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma + PostgreSQL**, **Auth.js v5**, and **Tiptap**.

## Highlights

### Public site
- Hero, About, Experience timeline, Projects gallery, Skills, Education, Contact, Case Study.
- Path-based i18n: `/en/...` and `/id/...`.
- Light/dark theme toggle, scroll progress bar, Command Palette (`⌘K`).
- Built-in AI chat powered by Google Gemini.
- Public blog at `/{lang}/blog` with SEO metadata, OG images, hreflang.
- Downloadable per-locale PDF CV.

### Admin panel (`/admin`)
- Email/password login with bcrypt-hashed credentials (`/login`).
- Full CRUD for **Profile, Experiences, Education, Projects, Skill groups + items, and Blogs**.
- Rich text editing for blog posts (Tiptap) with image uploads.
- Local-disk image uploads at `public/uploads/yyyy/mm/`.
- Per-locale fields edited via tabbed form (English / Bahasa Indonesia).
- All public content fetched from PostgreSQL; falls back to static data if DB is empty.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```bash
# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dedypry?schema=public

# Auth (generate with: openssl rand -base64 32)
AUTH_SECRET=...
AUTH_URL=http://localhost:3000

# Initial admin (used by db:seed)
ADMIN_EMAIL=admin@dedypry.site
ADMIN_PASSWORD=changeme123
ADMIN_NAME=Dedy Priyatna

# Gemini chat
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash

# Public URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Initialize the database

```bash
# Make sure your local PostgreSQL is running and the DB exists:
createdb dedypry

# Push the schema (no migrations file — fast for dev):
npm run db:push

# Seed: creates the admin user + populates initial portfolio content from
# data/portfolio.ts and i18n/locales/{en,id}.ts
npm run db:seed
```

For a production-ready migration history, use `npm run db:migrate` instead of `db:push`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel (sign in with the admin email/password from your `.env.local`).

## Scripts

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start Next.js dev server                        |
| `npm run build`     | `prisma generate` + production build            |
| `npm run start`     | Serve the production build                      |
| `npm run lint`      | Run ESLint                                      |
| `npm run typecheck` | Run `tsc --noEmit`                              |
| `npm run db:generate` | Generate Prisma client                        |
| `npm run db:push`   | Push schema to DB without migration files       |
| `npm run db:migrate`| Create + apply a new migration (recommended)    |
| `npm run db:studio` | Open Prisma Studio (visual DB inspector)        |
| `npm run db:seed`   | Seed admin user + initial content               |
| `npm run db:reset`  | Reset DB (destroys data) and re-run migrations  |

## Project structure

```
app/
├── [lang]/                 # Localized public site
│   ├── page.tsx            # Home (hero, about, experience…)
│   ├── blog/page.tsx       # Blog list
│   └── blog/[slug]/page.tsx# Blog detail
├── admin/                  # Admin panel (auth-gated)
│   ├── layout.tsx          # Auth check + sidebar shell
│   ├── page.tsx            # Dashboard home
│   ├── _components/        # Shared admin UI (DataTable, LocaleTabs, Editor, …)
│   ├── profile/            # Singleton profile form
│   ├── blogs/              # Blog CRUD (Tiptap editor)
│   ├── experiences/        # Experience CRUD
│   ├── education/          # Education CRUD
│   ├── projects/           # Project CRUD
│   └── skills/             # Skill groups + items
├── api/
│   ├── auth/[...nextauth]/ # Auth.js handlers
│   ├── upload/route.ts     # Authenticated file upload → public/uploads
│   └── chat/route.ts       # Gemini chat
├── login/                  # Login page
└── layout.tsx              # Root layout (fonts, metadata)

components/                 # Public site UI components
├── Hero.tsx, About.tsx, …  # Section components (now accept DB data via props)
└── chat/…                  # Chat bubble + panel

lib/
├── prisma.ts               # Prisma singleton
├── auth.ts                 # Auth.js config
├── queries.ts              # Server-side data fetchers (DB → view models)
├── translations.ts         # JSON-translation column helpers
└── validators.ts           # Zod schemas (shared form ⇆ server)

prisma/
├── schema.prisma           # All models
└── seed.ts                 # Initial admin + content seed

data/portfolio.ts           # Fallback static data (used when DB empty)
i18n/                       # UI labels (eyebrows, button text, etc.)
public/uploads/             # User-uploaded images (gitignored)
middleware.ts               # Locale routing (admin/login pass-through)
```

## i18n model

- **UI labels** (eyebrow, "Let's talk", filter labels): live in `i18n/locales/{en,id}.ts`.
- **Content** (profile copy, blog posts, project descriptions, experience highlights): stored in Postgres as a `translations` JSON column shaped `{ en: { …fields }, id: { …fields } }`.
- The admin form has tabbed locale switching so you fill both languages in one save.

## Production deploy

The project is set up for VM deploy (PM2 + Nginx). Build and start:

```bash
npm run build
npm run start         # listens on $PORT (default 3000)
```

For PM2:

```bash
pm2 start ecosystem.config.cjs
```

Make sure your reverse proxy forwards `Host` correctly (use `proxy_set_header Host $host;` not `localhost`).

## License

Personal portfolio — all content © Dedy Priyatna.
