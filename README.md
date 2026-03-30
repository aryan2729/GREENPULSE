# GreenPulse: Delhi Smart Parks Platform

**GreenPulse** is a citizen centric web application for exploring, understanding, and engaging with public green spaces in Delhi. It was built for the **DDA Greens Innovation Challenge** context: a single page experience that combines an interactive map, gamified rewards, community features, and an admin oriented dashboard, without requiring user accounts.

## Live demo

**[Open live app](https://greenpulseparks.vercel.app)** 

## What GreenPulse does

### For citizens

- **Home**: Landing experience with hero messaging, animated stats, and a live style ticker of park related updates.
- **Find Parks (map)**: **Leaflet** + **OpenStreetMap**: pan and zoom Delhi, see park markers, open detail panels with crowd, AQI, amenities, safety signals, and charts (**Recharts**).
- **My Park (Citizen Hub)**: Park finder, nature explorer (including QR style plant learning), favorites (heart), reports/feedback hooks, and a **Safety** flow with an **SOS** modal (multi step confirmation UI).
- **Community**: Anonymous style posts, tips, and announcements; aligns with “no login” privacy choices.
- **Rewards**: Points, levels, badges, challenges, and leaderboard integration via API.
- **Admin**: Overview style dashboard for operators: park lens, AI suggestions surface, and aggregated “reports” views (demo data).

### Privacy & identity (by design)

- **No traditional login**: The app uses a **generated alias** (e.g. `EcoCitizen_4821`) stored locally.
- **Anonymous toggle**: Users can reflect how they want to be represented in community facing UI.
- **Persistence**: Points, favorites, visited parks, scanned plants, dark mode, and alias related state use **Zustand** with **localStorage** (`greenpulse-v4` persist key).
- **SOS and reports**: Presented as anonymous flows suitable for a prototype; production systems would wire these to real emergency and ticketing backends.

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 14** (App Router), **React 18** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** + custom green palette, **Framer Motion** for motion |
| Maps | **Leaflet**, **react-leaflet**, OSM tiles |
| Charts | **Recharts** |
| State | **Zustand** + `persist` middleware |
| Icons | **lucide-react** |
| Utilities | **clsx** |

## How navigation works (important)

The UI behaves like a **multi page app** but technically lives on a **single route**: **`/`**. The “tabs” (Home, Find Parks, My Park, Community, Rewards, Admin) switch on the **client side** via Zustand (`activePage`). That means:

- Deep links to “`/map`” or “`/rewards`” are **not** separate URLs in the current implementation; everything is under `/`.
- Bookmarking always opens **Home** unless you later add Next.js routes or hash/query sync.

## Project structure (high level)

```
greenpulse/
├── app/
│   ├── layout.tsx          # Root layout, metadata, global CSS + Leaflet CSS
│   ├── page.tsx            # Main shell: navbar + page components + SOS modal
│   ├── globals.css
│   └── api/                # REST style Route Handlers (mock or in memory data)
│       ├── parks/
│       ├── reports/
│       ├── feedback/
│       ├── ai-recommend/
│       └── leaderboard/
├── components/
│   ├── ui/                 # Home, Navbar
│   ├── map/                # Map page + Leaflet view
│   ├── citizen/            # Citizen hub, QR/nature flows
│   ├── community/
│   ├── rewards/
│   ├── admin/
│   └── safety/             # SOS modal
├── data/
│   └── parks.ts            # Park & plant seed data (Delhi focused)
├── store/
│   └── useStore.ts         # Global UI + gamification state
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## API routes (backend surface)

All routes are **Next.js Route Handlers** under `app/api`. Data is largely **mock or in memory** for demonstration; restart clears data that is not persisted on the server unless you extend storage.

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/parks` | `GET` | List parks. Query: `filter` (`all`, `low`, `safe`, `child`, `accessible`), `zone`. Response includes slight random variation on crowd/AQI for a “live” feel. |
| `/api/reports` | `GET`, `POST` | Citizen reports (anonymous in spirit). |
| `/api/feedback` | `GET`, `POST` | Park feedback submissions. |
| `/api/ai-recommend` | `GET` | AI style park recommendations (demo). |
| `/api/leaderboard` | `GET` | Anonymous leaderboard payload. |

Use your deployed origin for API calls (same host as the live app), e.g. `/api/parks` relative to that domain.

## Data model (parks)

Parks are defined in `data/parks.ts` with rich fields: coordinates, zone, crowd level, AQI, comfort and safety scores, accessibility flags, amenities, historical series for charts, weekly visits, and more. **OpenStreetMap** is used for map tiles; **no map API key** is required for the default setup.

## Getting started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or pnpm or yarn if you adapt commands)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The dev server serves at `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

The production server defaults to port **3000** unless `PORT` is set by your host.

## Deployment checklist (for your real live link)

1. Push the project to your Git host and connect it to a host that supports Next.js (Node or serverless).
2. Build: `npm run build`; start: `npm start` (or your platform’s defaults).
3. Update the **Live demo** link above with your production URL.

No `NEXT_PUBLIC_*` environment variables are required by the current codebase; add them only if you extend integrations (analytics, real AI keys, databases, etc.).

## Feature highlights (extended)

| Area | Details |
|------|---------|
| **Map** | Filter friendly park listing, markers, detail panel with time series charts. |
| **Gamification** | Points, levels (Seedling → Forest Guardian), badges, plant scans, visit tracking. |
| **Favorites** | Heart parks; persisted in localStorage. |
| **Dark mode** | Toggled from the navbar; class on `document.documentElement`. |
| **Hydration** | Client only alias generation after mount to avoid SSR/client mismatches. |
| **Responsive** | Mobile friendly nav patterns and layouts. |

## License & attribution

Specify your license in a `LICENSE` file if you open source the project. Map tiles use OpenStreetMap; follow their attribution guidelines for public deployments.

**GreenPulse**: *Smart parks visibility, community voice, and operator insight in one prototype ready stack.*
