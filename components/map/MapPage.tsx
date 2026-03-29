'use client';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { parks } from '@/data/parks';
import ParkPanel from '@/components/park/ParkPanel';
import { Search, X, Navigation, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#e8f0e8]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
        <div className="text-green-700 font-bold">Loading Smart Map…</div>
        <div className="text-green-500 text-sm mt-1">Delhi · OpenStreetMap</div>
      </div>
    </div>
  ),
});

const FILTERS = [
  { id: 'all',        emoji: '🌿', label: 'All Parks' },
  { id: 'low',        emoji: '🟢', label: 'Low Crowd' },
  { id: 'safe',       emoji: '👩', label: 'Women Safe' },
  { id: 'child',      emoji: '👶', label: 'Child Friendly' },
  { id: 'accessible', emoji: '♿', label: 'Accessible' },
];

export default function MapPage() {
  const { mapFilter, setMapFilter, selectedPark, setSelectedPark, darkMode } = useStore();
  const [search, setSearch] = useState('');
  const [showLocBanner, setShowLocBanner] = useState(false);
  const [locGranted, setLocGranted] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(r => {
        if (r.state === 'granted') { setLocGranted(true); setShowLocBanner(false); }
        else if (r.state === 'prompt') setShowLocBanner(true);
      });
    } else {
      setShowLocBanner(true);
    }
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => { setLocGranted(true); setShowLocBanner(false); },
      () => setShowLocBanner(false),
    );
  };

  let filtered = parks.filter(p => {
    if (mapFilter === 'low') return p.crowd === 'low';
    if (mapFilter === 'safe') return p.womenSafe;
    if (mapFilter === 'child') return p.childFriendly;
    if (mapFilter === 'accessible') return p.accessible;
    return true;
  });

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q)
    );
  }

  const filterBg   = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const sidebarBg  = darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const panelBg    = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textMuted   = darkMode ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className="flex flex-col" style={{ height: '100dvh', paddingTop: 60 }}>

      {/* Location banner */}
      {showLocBanner && (
        <div className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 flex items-center justify-between gap-3 z-50">
          <div className="flex items-center gap-2 text-sm">
            <Navigation size={14} className="flex-shrink-0" />
            <span className="font-medium">Allow location to see your position on the map.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={requestLocation} className="bg-white text-blue-700 font-black px-4 py-1 rounded-full text-xs hover:bg-blue-50 transition-colors">Allow</button>
            <button onClick={() => setShowLocBanner(false)}><X size={16} className="text-blue-200" /></button>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className={`flex-shrink-0 border-b shadow-sm z-40 ${filterBg}`}>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="relative hidden sm:flex items-center">
            <Search size={13} className="absolute left-3 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search parks…"
              className={`pl-8 pr-3 py-1.5 text-xs border rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200 w-36 ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200'}`}
            />
          </div>
          {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400" /></button>}

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block flex-shrink-0" />

          <div className="flex items-center gap-1.5 overflow-x-auto flex-1 scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setMapFilter(f.id)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all
                  ${mapFilter === f.id
                    ? 'bg-green-600 text-white shadow-md'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200'}`}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400 hidden sm:block">{filtered.length}/{parks.length}</span>
            {locGranted && (
              <span className="flex items-center gap-1 text-blue-500 text-[11px] font-bold">
                <Navigation size={11} /> Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map area — fills ALL remaining space */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Left sidebar */}
        <div className={`hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 border-r overflow-y-auto ${sidebarBg}`}>
          <div className={`px-3 py-2 border-b text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            {filtered.length} Parks
          </div>
          {filtered.map(p => {
            const dotColor = p.crowd === 'low' ? 'bg-green-500' : p.crowd === 'medium' ? 'bg-amber-500' : 'bg-red-500';
            const isSelected = selectedPark?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  useStore.getState().setSelectedPark(p);
                  useStore.getState().markVisited(p.id);
                  useStore.getState().addPoints(10);
                }}
                className={`w-full text-left px-3 py-3 border-b transition-all flex items-center gap-2.5 group
                  ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-green-50'}
                  ${isSelected ? (darkMode ? 'bg-green-900/40 border-l-[3px] border-l-green-500' : 'bg-green-50 border-l-[3px] border-l-green-600') : ''}`}
              >
                <div className="text-xl w-8 text-center flex-shrink-0">{p.image}</div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs truncate ${isSelected ? 'text-green-600' : textPrimary}`}>{p.name}</div>
                  <div className={`text-[10px] truncate ${textMuted}`}>{p.area}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span className={`text-[10px] font-semibold ${textMuted}`}>{p.crowdPct}% crowd</span>
                    <span className={`text-[10px] font-bold ${p.aqi < 50 ? 'text-green-600' : p.aqi < 100 ? 'text-amber-600' : 'text-red-500'}`}>AQI {p.aqi}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* MAP — fills 100% of remaining space */}
        <div className="relative flex-1 min-w-0" style={{ minHeight: 0 }}>
          <MapView parks={filtered} />

          {/* Legend */}
          <div className={`absolute bottom-5 left-4 z-[1000] rounded-2xl shadow-xl border px-4 py-3 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-100'}`}>
            <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${textMuted}`}>Crowd Level</div>
            {[['#16a34a','Low crowd (< 40%)'],['#d97706','Moderate (40–70%)'],['#dc2626','High crowd (> 70%)'],['#3b82f6','Your location']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className={`text-[10px] font-medium ${textMuted}`}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Park panel — fixed width overlay from right */}
        {selectedPark && (
          <div className={`
            absolute lg:relative right-0 top-0 bottom-0 z-[900]
            w-full sm:w-[400px] lg:w-[420px] xl:w-[450px]
            flex-shrink-0 overflow-y-auto
            border-l-2 shadow-2xl
            ${panelBg} ${darkMode ? 'border-gray-700' : 'border-gray-100'}
          `}
            style={{ maxHeight: '100%' }}
          >
            <ParkPanel />
          </div>
        )}
      </div>
    </div>
  );
}
