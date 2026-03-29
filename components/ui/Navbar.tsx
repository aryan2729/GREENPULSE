'use client';
import { useStore, PageId } from '@/store/useStore';
import { Map, Trophy, LayoutDashboard, Leaf, AlertCircle, MessageCircle, Home, Moon, Sun, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { activePage, setActivePage, alias, points, isAnonymous, setShowSOS, darkMode, toggleDarkMode, _hydrated } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home',      label: 'Home',      icon: <Home size={14} /> },
    { id: 'map',       label: 'Find Parks', icon: <Map size={14} /> },
    { id: 'citizen',   label: 'My Park',   icon: <Leaf size={14} /> },
    { id: 'community', label: 'Community', icon: <MessageCircle size={14} /> },
    { id: 'rewards',   label: 'Rewards',   icon: <Trophy size={14} /> },
    { id: 'admin',     label: 'Admin',     icon: <LayoutDashboard size={14} /> },
  ];

  const go = (id: PageId) => { setActivePage(id); setMobileOpen(false); };

  // Light mode navbar must work on light pages (no white-on-white).
  const navBg = darkMode
    ? 'bg-gray-950/98 border-gray-800'
    : 'bg-white/92 border-gray-200';

  const linkActive = darkMode
    ? 'bg-green-900/40 text-green-400 border border-green-800/60'
    : 'bg-green-600/10 text-green-700 border border-green-600/20';

  const linkIdle = darkMode
    ? 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] border-b backdrop-blur-xl transition-colors duration-200 ${navBg}`}
        style={{ height: 60 }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-3">

          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2 flex-shrink-0 group">
            <div className={`w-8 h-8 rounded-xl transition-colors flex items-center justify-center shadow-lg
              ${darkMode ? 'bg-green-600 group-hover:bg-green-500 shadow-green-900/40' : 'bg-green-700 group-hover:bg-green-600 shadow-green-900/10'}`}>
              <span className="text-white text-base">🌿</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-black text-[15px] tracking-tight`}>GreenPulse</span>
              <span className={`${darkMode ? 'text-green-600' : 'text-green-700'} text-[9px] font-bold tracking-widest`}>DELHI SMART PARKS</span>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${activePage === l.id ? linkActive : linkIdle}`}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Points */}
            <button onClick={() => go('rewards')}
              className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/25 rounded-full px-3 py-1 hover:bg-amber-500/25 transition-colors">
              <span className="text-amber-400 text-xs">⚡</span>
              <span className="text-amber-300 text-xs font-black">{_hydrated ? points : '—'}</span>
              <span className="text-amber-600/70 text-[10px]">pts</span>
            </button>

            {/* Alias chip */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 max-w-[120px]">
              <Shield size={9} className="text-green-500 flex-shrink-0" />
              <span className="text-green-400/80 text-[10px] truncate">{_hydrated ? alias : '—'}</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-yellow-400"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} className="text-yellow-300" /> : <Moon size={15} className="text-gray-400 hover:text-yellow-300" />}
            </button>

            {/* SOS */}
            <button
              onClick={() => setShowSOS(true)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-[11px] font-black px-3 py-1.5 rounded-full transition-all shadow-lg shadow-red-900/30"
            >
              <AlertCircle size={11} /> SOS
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-5 space-y-[5px]">
                <div className={`h-0.5 bg-green-300/70 rounded transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <div className={`h-0.5 bg-green-300/70 rounded transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 bg-green-300/70 rounded transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[998] lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className={`absolute top-[60px] left-0 right-0 border-b shadow-2xl ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-[#071912] border-green-900'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-2 space-y-0.5">
              {links.map(l => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${activePage === l.id ? 'bg-green-700/30 text-green-300' : 'text-green-200/40 hover:bg-white/5 hover:text-green-200'}`}
                >
                  {l.icon} {l.label}
                </button>
              ))}
            </div>
            <div className="border-t border-green-900/50 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-green-500" />
                <span className="text-green-400 text-xs">{_hydrated ? alias : '—'} · {_hydrated ? points : '—'} pts</span>
              </div>
              <button onClick={toggleDarkMode} className="text-gray-400 hover:text-yellow-300 transition-colors">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
