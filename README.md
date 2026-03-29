# 🌿 GreenPulse — Delhi Smart Parks Platform

**DDA Greens Innovation Challenge 2025**

## Quick Start
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (custom green design system)
- **Leaflet.js** + OpenStreetMap (free maps)
- **Recharts** (charts)
- **Zustand** (state management + localStorage)

## Pages
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` → Home tab | Landing page — simple, welcoming |
| Park Map | Map tab | Live Leaflet map with all parks |
| Citizen Hub | Citizen tab | Full citizen feature dashboard |
| Community | Community tab | Anonymous posts, tips, events |
| Rewards | Rewards tab | Points, challenges, leaderboard |
| Admin | Admin tab | DDA dashboard, AI suggestions |

## API Routes (Backend)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/parks` | GET | All parks (filter params: filter, zone) |
| `/api/reports` | GET/POST | Citizen reports (anonymous) |
| `/api/feedback` | GET/POST | Park feedback submissions |
| `/api/ai-recommend` | GET | AI park recommendations |
| `/api/leaderboard` | GET | Anonymous leaderboard |

## What Was Added Extra
- ✅ **Citizen Hub** — dedicated citizen-facing dashboard (park finder, nature explorer, safety hub, report form)
- ✅ **QR Nature Explorer** — learn about 10 plant species, earn points
- ✅ **Favorite Parks** — heart-tap any park to save it
- ✅ **Live ticker** — scrolling live updates on every page
- ✅ **Community Page** — anonymous posts, tips, photo reports, event announcements
- ✅ **Privacy card** — shows your anonymous alias and toggle
- ✅ **SOS Modal** — 3-step confirm → sending → sent flow
- ✅ **Admin tabs** — Overview / Parks / AI Engine / Reports
- ✅ **API backend** — 5 REST endpoints with mock in-memory data
- ✅ **Counter animations** — hero stats count up on scroll
- ✅ **Responsive** — works on mobile, tablet, desktop
- ✅ **Favorite parks** persist across sessions (localStorage)

## Privacy Design
- No login required — ever
- Auto-generated alias (e.g. EcoCitizen_4821)
- All reports show as "Anonymous User" to admin
- Points stored in localStorage only
- SOS alert is anonymous
# GREENPULSE
