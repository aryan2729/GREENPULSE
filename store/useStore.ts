import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Park } from '@/data/parks';

const PREFIXES = ['EcoCitizen','GreenUser','NatureWalker','ParkHero','EcoGuard','TreeLover','DelhiGreen','ForestFriend'];

// Deterministic alias from a seed so SSR and client match
function genAlias(seed?: string): string {
  if (typeof window === 'undefined') return 'GreenUser_0000'; // SSR placeholder
  // Check localStorage first
  try {
    const stored = localStorage.getItem('greenpulse-alias');
    if (stored) return stored;
  } catch (_) {}
  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  const alias = `${p}_${n}`;
  try { localStorage.setItem('greenpulse-alias', alias); } catch (_) {}
  return alias;
}

export type PageId = 'home' | 'map' | 'citizen' | 'community' | 'rewards' | 'admin';

function calcLevel(pts: number) {
  if (pts < 200) return 'Seedling 🌱';
  if (pts < 500) return 'Sapling 🌿';
  if (pts < 1000) return 'Tree 🌳';
  if (pts < 2000) return 'Elder Tree 🌲';
  return 'Forest Guardian 🏆';
}

interface AppState {
  alias: string;
  isAnonymous: boolean;
  points: number;
  badges: string[];
  level: string;
  visitedParks: string[];
  scannedPlants: string[];
  favoriteParks: string[];
  reward500Claimed: boolean;
  reward500FavoritePlantId: string | null;
  activePage: PageId;
  selectedPark: Park | null;
  mapFilter: string;
  showSOS: boolean;
  darkMode: boolean;
  _hydrated: boolean;
  // actions
  setActivePage: (p: PageId) => void;
  setSelectedPark: (p: Park | null) => void;
  setMapFilter: (f: string) => void;
  setShowSOS: (v: boolean) => void;
  addPoints: (n: number) => void;
  markVisited: (id: string) => void;
  markPlantScanned: (id: string) => void;
  toggleFavorite: (id: string) => void;
  claim500Reward: (favoritePlantId: string) => boolean;
  toggleAnonymous: () => void;
  toggleDarkMode: () => void;
  setHydrated: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      alias: 'GreenUser_0000', // will be replaced after hydration
      isAnonymous: true,
      points: 340,
      badges: ['🌱', '🚶', '🔍'],
      level: calcLevel(340),
      visitedParks: ['p1'],
      scannedPlants: [],
      favoriteParks: [],
      reward500Claimed: false,
      reward500FavoritePlantId: null,
      activePage: 'home',
      selectedPark: null,
      mapFilter: 'all',
      showSOS: false,
      darkMode: false,
      _hydrated: false,
      setActivePage: (p) => set({ activePage: p }),
      setSelectedPark: (p) => set({ selectedPark: p }),
      setMapFilter: (f) => set({ mapFilter: f }),
      setShowSOS: (v) => set({ showSOS: v }),
      addPoints: (n) => set((s) => { const pts = s.points + n; return { points: pts, level: calcLevel(pts) }; }),
      markVisited: (id) => set((s) => ({ visitedParks: s.visitedParks.includes(id) ? s.visitedParks : [...s.visitedParks, id] })),
      markPlantScanned: (id) => set((s) => ({ scannedPlants: s.scannedPlants.includes(id) ? s.scannedPlants : [...s.scannedPlants, id] })),
      toggleFavorite: (id) => set((s) => ({
        favoriteParks: s.favoriteParks.includes(id) ? s.favoriteParks.filter(x => x !== id) : [...s.favoriteParks, id],
      })),
      claim500Reward: (favoritePlantId) => {
        const s = get();
        if (s.reward500Claimed) return false;
        if (s.points < 500) return false;
        set({ reward500Claimed: true, reward500FavoritePlantId: favoritePlantId });
        return true;
      },
      toggleAnonymous: () => set((s) => ({ isAnonymous: !s.isAnonymous })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setHydrated: () => set({ _hydrated: true, alias: genAlias() }),
    }),
    {
      name: 'greenpulse-v4',
      partialize: (s) => ({
        alias: s.alias,
        isAnonymous: s.isAnonymous,
        points: s.points,
        badges: s.badges,
        level: s.level,
        visitedParks: s.visitedParks,
        scannedPlants: s.scannedPlants,
        favoriteParks: s.favoriteParks,
        reward500Claimed: s.reward500Claimed,
        reward500FavoritePlantId: s.reward500FavoritePlantId,
        darkMode: s.darkMode,
      }),
    }
  )
);
