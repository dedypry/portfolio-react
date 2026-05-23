# Dedy Priyatna · Portfolio

A modern, animated personal portfolio for **Dedy Priyatna** — Engineering Lead & Full-Stack Architect.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Highlights

- Hero section with live-status badge, gradient typography, and animated grid backdrop.
- About section featuring three guiding principles.
- Vertical timeline of experience with stack chips per role.
- Filterable projects gallery (Web · Mobile · Backend · Landing).
- Toolkit section grouping languages, frameworks, data/cloud, and practices.
- Contact section with direct email, phone, LinkedIn, and GitHub links.
- Responsive, dark-first design with subtle motion on scroll.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Script           | What it does                       |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start Vite dev server              |
| `npm run build`  | Type-check + build production bundle |
| `npm run preview`| Serve the production build locally |
| `npm run lint`   | Run ESLint                         |

## Editing your data

All content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts):

- `profile` — name, role, contact info, intro, stats
- `philosophy` — three guiding principles shown in About
- `experiences` — work history (timeline)
- `projects` — featured products / projects
- `skillGroups` — toolkit categories
- `education` — degree info

Edit the values there and the UI updates automatically.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3
- Framer Motion 12
- lucide-react & react-icons

## License

Personal portfolio — all content © Dedy Priyatna.
