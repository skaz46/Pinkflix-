# PinkFlix

A premium, offline-capable video library PWA with an AMOLED black theme and
BLACKPINK-inspired pink accents. Built with React, TypeScript, Vite, and
Tailwind CSS.

All data (favorites, collections, watch history, settings) is generated from
a local mock catalog and stored entirely on-device via `localStorage` — there
is no backend and no real video playback; the player screen is a lightweight
simulation used to demonstrate history/continue-watching behavior.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

Open the printed local URL on your phone (same Wi-Fi network) or desktop
browser. In Chrome/Edge/Safari you can install it to your home screen via the
browser's install / "Add to Home Screen" option, or the "Install" button in
Settings once a browser install prompt is available.

## Tech stack

- **React 19 + TypeScript + Vite** — app shell and build tooling
- **Tailwind CSS 3** — styling, with a custom AMOLED + pink design system
- **Framer Motion** — spring-based interactions and page transitions
- **Zustand** (+ `persist`) — favorites, history, collections, settings
- **React Router 7** — client-side routing with animated transitions
- **Recharts** — analytics dashboard charts
- **vite-plugin-pwa** — manifest + service worker for offline support and
  installability

## Project structure

```
src/
  components/
    analytics/     stat cards + charts for the dashboard
    collections/   collection cards, create/add-to-collection sheets
    common/        Badge, Modal, Toggle, IconButton, EmptyState, Toast
    layout/        Sidebar, BottomNav, TopBar, PageTransition
    search/        SearchBar, SortMenu, FilterDrawer
    video/         VideoCard, HeroBanner, PlayerOverlay, Row, skeletons
  config/          navigation config shared by Sidebar/BottomNav
  data/            mock catalog + seed data (favorites/history/collections)
  hooks/           search/filter/sort, analytics, recommendations, etc.
  pages/           one file per route
  store/           Zustand stores (library, settings, toasts)
  types/           shared TypeScript types
  utils/           formatting, catalog query logic, tag→icon mapping
```

## Notes on the mock catalog

`src/data/catalog.ts` contains ~38 fictional titles across genres (drama,
thriller, concert film, sci-fi, anime, and more) with realistic metadata:
resolution, duration, a quality/rating score, tags, release/added dates, and
studio. Thumbnails are rendered as gradient art with a genre icon rather than
fetched images, so the whole app works fully offline with zero network
requests after the first load.

## Regenerating icons

App icons live in `public/icons/`. To regenerate them:

```bash
python3 -m pip install --break-system-packages Pillow numpy
python3 scripts/gen_icons.py
```
