'use client';
import { useStore } from '@/store/useStore';
import { parks, plants } from '@/data/parks';
import { Shield, Map, ChevronRight, Star, Phone, Leaf, Wind, Users, TreePine, Droplets, Sun, Bird, Flower2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── Animated counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let cur = 0;
      const step = end / 60;
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        setVal(Math.floor(cur));
        if (cur >= end) clearInterval(t);
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <div ref={ref}>{val.toLocaleString()}{suffix}</div>;
}

/* ── Live ticker ── */
function LiveTicker() {
  const msgs = [
    '🟢 Lodhi Garden — Only 22% crowd right now. Perfect time to visit',
    '🌸 Garden of Five Senses — AQI 55(Good). Jasmine walk is blooming',
    '⚠️ Deer Park — High crowd detected. AI suggests Nehru Park instead.',
    '🏆 EcoCitizen_48 just became a Forest Guardian with 2,840 points!',
    '🌅 Early Bird Challenge: Visit before 7am to earn +30 bonus points',
    '🌿 New plant added: Peepal tree at Lodhi Garden. Scan QR to earn 20 points',
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % msgs.length); setVis(true); }, 350);
    }, 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-green-950/80 border-b border-green-800/50 py-2.5 px-4 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-400 text-[10px] font-black tracking-[0.15em] uppercase">Live</span>
        </div>
        <div className="h-3.5 w-px bg-green-800" />
        <span className={`text-green-300/75 text-xs font-medium transition-opacity duration-300 ${vis ? 'opacity-100' : 'opacity-0'}`}>
          {msgs[idx]}
        </span>
      </div>
    </div>
  );
}

/* ── Park quick card ── */
function ParkCard({ park }: { park: typeof parks[0] }) {
  const { setSelectedPark, setActivePage, markVisited, addPoints, toggleFavorite, favoriteParks } = useStore();
  const isFav = favoriteParks.includes(park.id);
  const crowdCls = park.crowd === 'low'
    ? 'text-green-700 bg-green-100 border-green-200'
    : park.crowd === 'medium'
    ? 'text-amber-700 bg-amber-100 border-amber-200'
    : 'text-red-700 bg-red-100 border-red-200';
  const aqiCls = park.aqi < 50
    ? 'text-green-700 bg-green-100 border-green-200'
    : park.aqi < 100
    ? 'text-amber-700 bg-amber-100 border-amber-200'
    : 'text-red-700 bg-red-100 border-red-200';
  const barColor = park.crowd === 'low' ? '#22c55e' : park.crowd === 'medium' ? '#f59e0b' : '#ef4444';

  return (
    <div
      onClick={() => { setSelectedPark(park); setActivePage('map'); markVisited(park.id); addPoints(10); }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-green-300 hover:shadow-xl hover:shadow-green-100/60 hover:-translate-y-1.5 transition-all duration-250 cursor-pointer overflow-hidden group"
    >
      {/* Color bar top */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${barColor}, ${barColor}88)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-2xl shadow-sm border border-green-100">
              {park.image}
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-base leading-tight">{park.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{park.area} · {park.area_hectares} ha · {park.zone}</p>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(park.id); }}
            className={`text-lg transition-all hover:scale-110 active:scale-95 ${isFav ? 'opacity-100' : 'opacity-20 group-hover:opacity-60'}`}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`rounded-xl p-2.5 text-center border ${crowdCls}`}>
            <div className="font-black text-sm">{park.crowdPct}%</div>
            <div className="text-[10px] font-medium opacity-70 mt-0.5">Crowd</div>
          </div>
          <div className={`rounded-xl p-2.5 text-center border ${aqiCls}`}>
            <div className="font-black text-sm">{park.aqi}</div>
            <div className="text-[10px] font-medium opacity-70 mt-0.5">AQI</div>
          </div>
          <div className="rounded-xl p-2.5 text-center border text-purple-700 bg-purple-50 border-purple-200">
            <div className="font-black text-sm">{park.safetyScore}</div>
            <div className="text-[10px] font-medium opacity-70 mt-0.5">Safety</div>
          </div>
        </div>

        {/* AQI label */}
        <div className="flex items-center gap-1.5 mb-3">
          <Wind size={11} className="text-gray-400" />
          <span className="text-xs text-gray-400">{park.aqiLabel}</span>
          <span className="text-gray-200 mx-1">·</span>
          <TreePine size={11} className="text-green-400" />
          <span className="text-xs text-gray-400">{park.plants.length} species</span>
        </div>

        {/* Tags */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {park.womenSafe     && <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2 py-0.5 font-semibold">👩 Safe</span>}
            {park.childFriendly && <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5 font-semibold">👶 Kids</span>}
            {park.accessible    && <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5 font-semibold">♿</span>}
            {park.darkZones     && <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5 font-semibold">⚠️</span>}
          </div>
          <div className="flex items-center gap-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-gray-600 font-bold text-xs">{park.rating}</span>
          </div>
        </div>

        {/* Open times */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">⏰ {park.openTime} – {park.closeTime}</span>
          <span className="text-green-600 text-xs font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
            View details <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Floating nature element ── */
function FloatingElement({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none select-none animate-float"
      style={{
        fontSize: '2.5rem',
        opacity: 0.18,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        ...style,
      }}
    >
      {emoji}
    </div>
  );
}

/* ── Plant spotlight card ── */
function PlantSpotlight({ plant }: { plant: typeof plants[0] }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
      <div className="text-4xl mb-2">{plant.icon}</div>
      <div className="font-bold text-white text-sm">{plant.name}</div>
      <div className="text-green-300/60 text-[10px] italic mb-2">{plant.scientific}</div>
      <div className="text-green-200/80 text-xs leading-relaxed">{plant.benefits.split(',')[0]}</div>
      <div className="mt-2 inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-[10px] font-bold rounded-full px-2 py-0.5">
        🌱 {plant.co2_per_year_kg}kg CO₂/yr
      </div>
    </div>
  );
}

/* ── Live park stat pill ── */
function LiveStatPill({ park }: { park: typeof parks[0] }) {
  const color = park.crowd === 'low' ? 'bg-green-500' : park.crowd === 'medium' ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
      <div className={`w-2 h-2 rounded-full ${color} animate-pulse`} />
      <span className="text-white/80 text-xs font-medium">{park.name}</span>
      <span className="text-white/40 text-xs">·</span>
      <span className="text-white/60 text-xs">{park.crowdPct}% crowd</span>
    </div>
  );
}

/* ── Eco stat card ── */
function EcoStat({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="font-black text-gray-800 text-xl">{value}</div>
      <div className="text-gray-400 text-xs mt-0.5">{label}</div>
    </div>
  );
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function HomePage() {
  const { setActivePage } = useStore();

  // Best parks: not high crowd, sorted by safety
  const best = parks
    .filter(p => p.crowd !== 'high')
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .slice(0, 3);

  // Featured plants
  const featuredPlants = plants.slice(0, 4);

  return (
    <div className="pt-[60px]">

      {/* ══ HERO ══ */}
      <section
        className="relative overflow-hidden min-h-[95vh] flex flex-col"
        style={{ background: 'linear-gradient(150deg,#061410 0%,#0a2116 30%,#0d2c1c 60%,#071a0e 100%)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glowing radial blobs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(22,163,74,0.06) 0%, transparent 70%)' }} />

        {/* Floating nature elements — VISIBLE NOW */}
        <FloatingElement emoji="🌿" style={{ left: '4%',  top: '18%', animationDelay: '0s',   animationDuration: '6s',  fontSize: '3rem'   }} />
        <FloatingElement emoji="🌳" style={{ left: '88%', top: '15%', animationDelay: '1.2s', animationDuration: '7s',  fontSize: '3.5rem' }} />
        <FloatingElement emoji="🍃" style={{ left: '48%', top: '8%',  animationDelay: '2.4s', animationDuration: '5.5s',fontSize: '2rem'   }} />
        <FloatingElement emoji="🌸" style={{ left: '12%', top: '68%', animationDelay: '0.8s', animationDuration: '8s',  fontSize: '2.5rem' }} />
        <FloatingElement emoji="🌺" style={{ left: '78%', top: '62%', animationDelay: '3s',   animationDuration: '6.5s',fontSize: '2.2rem' }} />
        <FloatingElement emoji="🦋" style={{ left: '60%', top: '78%', animationDelay: '1.5s', animationDuration: '9s',  fontSize: '2rem'   }} />
        <FloatingElement emoji="🐦" style={{ left: '22%', top: '35%', animationDelay: '4s',   animationDuration: '7.5s',fontSize: '1.8rem' }} />
        <FloatingElement emoji="🌱" style={{ left: '93%', top: '40%', animationDelay: '2s',   animationDuration: '6s',  fontSize: '2.2rem' }} />
        <FloatingElement emoji="🍀" style={{ left: '35%', top: '85%', animationDelay: '3.5s', animationDuration: '8.5s',fontSize: '1.8rem' }} />

        <LiveTicker />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 w-full text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] mb-8 backdrop-blur-sm">
              <Leaf size={11} />
              DDA Greens Innovation Challenge 2025
            </div>

            {/* Headline */}
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] mb-6">
              Delhi's Parks,{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(120deg,#4ade80 0%,#22c55e 40%,#86efac 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Finally Smart
              </span>
            </h1>

            <p className="text-green-100/50 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light">
              Real-time crowd levels, air quality &amp; safety scores for all 900+ DDA parks.
              Find your perfect park before you leave home.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button
                onClick={() => setActivePage('map')}
                className="flex items-center gap-2 text-white font-black px-8 py-4 rounded-2xl text-base transition-all active:scale-95 shadow-2xl"
                style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 8px 32px rgba(22,163,74,0.4)' }}
              >
                <Map size={18} /> Find a Park Now
              </button>
              <button
                onClick={() => setActivePage('citizen')}
                className="flex items-center gap-2 border-2 border-green-600/40 text-green-300 hover:border-green-400 hover:bg-green-800/20 px-8 py-4 rounded-2xl text-base font-bold transition-all backdrop-blur-sm"
              >
                <Leaf size={18} /> Citizen Hub
              </button>
            </div>

            {/* Trust line */}
            <div className="flex items-center justify-center gap-2 text-white  text-xs mb-12">
              <Shield size={11} /> No sign-up required &nbsp;·&nbsp; 100% anonymous &nbsp;·&nbsp; Completely free
            </div>

            {/* Live park pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {parks.map(p => <LiveStatPill key={p.id} park={p} />)}
            </div>

            {/* Stats bar */}
            <div className="border-t border-green-800/40 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { end: 900,   suffix: '+',  label: 'DDA Parks' },
                { end: 14820, suffix: '',   label: 'Visits Today' },
                { end: 8420,  suffix: '',   label: 'Active Citizens' },
                { end: 100,   suffix: '%',  label: 'Privacy Safe' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    <Counter end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="text-green-500/45 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center ">
          <p className="text-green-600 text-xs font-black uppercase tracking-[0.15em] mb-3">Simple as 1‑2‑3</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-gray-800 mb-12">How GreenPulse Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-7 left-[33%] right-[33%] h-px bg-gradient-to-r from-green-200 to-green-200" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#bbf7d0 0px,#bbf7d0 8px,transparent 8px,transparent 16px)' }} />
            {[
              { n: '1', icon: '📍', title: 'Find Your Park',    desc: 'Browse parks near you. Filter by crowd level, women safety, child-friendliness, or air quality.' },
              { n: '2', icon: '📊', title: 'Check Live Data',   desc: 'See real-time crowd %, AQI, safety score, and best visiting time — all in one view.' },
              { n: '3', icon: '🎮', title: 'Visit & Earn',      desc: 'Scan plant QR codes, report issues, complete eco-challenges and earn reward points!' },
            ].map(s => (
              <div key={s.n} className="relative group">
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-sm">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-green-600 text-white rounded-full text-xs font-black flex items-center justify-center shadow-lg">
                    {s.n}
                  </div>
                </div>
                <h3 className="font-black text-gray-800 text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ECO IMPACT STATS ══ */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7,#f0fdf4)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-600 text-xs font-black uppercase tracking-[0.15em] mb-2">Environmental Impact</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-gray-800">Delhi's Green Lungs</h2>
            <p className="text-gray-400 text-sm mt-2">Real data from Delhi's DDA-managed parks</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <EcoStat icon={<TreePine size={22} className="text-green-600" />} value="2.4L+" label="Trees in DDA Parks" color="bg-green-100" />
            <EcoStat icon={<Wind size={22} className="text-blue-600" />} value="38T" label="CO₂ Absorbed/Year" color="bg-blue-100" />
            <EcoStat icon={<Droplets size={22} className="text-cyan-600" />} value="60+" label="Bird Species" color="bg-cyan-100" />
            <EcoStat icon={<Sun size={22} className="text-amber-600" />} value="5°C" label="Cooler Than Roads" color="bg-amber-100" />
          </div>

          {/* Plant spotlight */}
          <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Flower2 size={18} className="text-green-300" />
              <h3 className="font-black text-white text-lg">Featured Plants in Delhi Parks</h3>
              <span className="ml-auto text-xs text-green-300/60 bg-green-900/40 border border-green-700/40 rounded-full px-3 py-1">Tap on map QR codes to earn 20 pts each</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPlants.map(p => <PlantSpotlight key={p.id} plant={p} />)}
            </div>
            <div className="mt-5 text-center">
              <button onClick={() => setActivePage('citizen')}
                className="text-xs text-green-300 border border-green-600/40 rounded-full px-5 py-2 hover:bg-green-700/50 transition-all font-bold">
                Explore All {plants.length} Plants in QR Explorer →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BEST PARKS RIGHT NOW ══ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <p className="text-green-600 text-xs font-black uppercase tracking-[0.15em]">Updated just now</p>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl text-gray-800">Best Parks Right Now</h2>
              <p className="text-gray-400 text-sm mt-1">Low crowd · Good air quality · Safe to visit</p>
            </div>
            <button
              onClick={() => setActivePage('map')}
              className="flex items-center gap-1 text-green-600 font-bold text-sm hover:text-green-700 transition-colors"
            >
              View all on map <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {best.map(p => <ParkCard key={p.id} park={p} />)}
          </div>
        </div>
      </section>

      {/* ══ ALL PARKS QUICK VIEW ══ */}
      <section className="py-16 px-6 " style={{ background: 'linear-gradient(180deg,#f8fffe,#f0f7f2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8  ">
            <p className="text-green-600 text-xs font-black uppercase tracking-[0.15em] mb-2">Live Status</p>
            <h2 className="font-playfair text-3xl text-gray-800">All 6 Monitored Parks</h2>
            <p className="text-gray-400 text-sm mt-1">Click any park to open details on the map</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parks.map(p => {
              const cc = p.crowd === 'low' ? 'text-green-600 bg-green-100' : p.crowd === 'medium' ? 'text-amber-600 bg-amber-100' : 'text-red-600 bg-red-100';
              const aqc = p.aqi < 50 ? '#16a34a' : p.aqi < 100 ? '#d97706' : '#dc2626';
              return (
                <div
                  key={p.id}
                  onClick={() => { useStore.getState().setSelectedPark(p); setActivePage('map'); }}
                  className="flex items-center gap-3 bg-white border border-gray-100 hover:border-green-300 hover:shadow-md rounded-2xl p-4 cursor-pointer transition-all group"
                >
                  <div className="text-3xl w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">{p.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.area}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cc}`}>{p.crowdPct}% crowd</span>
                      <span className="text-[10px] font-bold" style={{ color: aqc }}>AQI {p.aqi}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-lg font-black text-purple-600">{p.safetyScore}</span>
                    <span className="text-[10px] text-gray-400">safety</span>
                    <ChevronRight size={14} className="text-green-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <button onClick={() => setActivePage('map')}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-green-200">
              <Map size={16} /> Open Full Interactive Map
            </button>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 text-xs font-black uppercase tracking-[0.15em] mb-2">Everything In One Place</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-gray-800">What Can You Do Here?</h2>
            <p className="text-gray-400 text-sm mt-2">Built for every Delhi citizen — simple, free, and anonymous</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { e: '🗺️', who: 'For Everyone',      bg: 'from-green-50 to-emerald-50',   border: 'border-green-200',   accent: 'text-green-700',  t: 'Find Your Perfect Park',       d: 'Filter by crowd, air quality, women safety, or child-friendliness. Find the best park right now.', page: 'map' },
              { e: '🌿', who: 'Nature Lovers',       bg: 'from-teal-50 to-cyan-50',       border: 'border-teal-200',    accent: 'text-teal-700',   t: 'Discover Plants & Trees',       d: 'Scan QR codes on trees. Learn names, CO₂ absorbed, health benefits, and ecological fun facts.', page: 'citizen' },
              { e: '🛡️', who: 'Women & Families',   bg: 'from-purple-50 to-violet-50',   border: 'border-purple-200',  accent: 'text-purple-700', t: 'Safety First',                  d: 'Check safety scores, see well-lit routes, use SOS in emergencies. Identity always protected.', page: 'citizen' },
              { e: '🎮', who: 'All Citizens',        bg: 'from-amber-50 to-yellow-50',    border: 'border-amber-200',   accent: 'text-amber-700',  t: 'Earn Reward Points',            d: 'Visit parks, complete eco-challenges, report issues. Earn points and redeem with local partners.', page: 'rewards' },
              { e: '💬', who: 'Community',           bg: 'from-blue-50 to-indigo-50',     border: 'border-blue-200',    accent: 'text-blue-700',   t: 'Share Tips & Events',           d: 'Post nature photos, share park tips, announce yoga groups. Fully anonymous — no account needed.', page: 'community' },
              { e: '📊', who: 'DDA / Managers',      bg: 'from-red-50 to-rose-50',        border: 'border-red-200',     accent: 'text-red-700',    t: 'Admin Intelligence',            d: 'Real-time footfall, AI-driven suggestions, anonymous citizen reports, and safety alerts.', page: 'admin' },
            ].map(f => (
              <div
                key={f.t}
                onClick={() => setActivePage(f.page as any)}
                className={`bg-gradient-to-br ${f.bg} border ${f.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group`}
              >
                <div className="text-4xl mb-4">{f.e}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${f.accent}`}>{f.who}</div>
                <h3 className={`font-black text-gray-800 text-base mb-2 group-hover:${f.accent} transition-colors`}>{f.t}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.d}</p>
                <div className={`mt-3 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${f.accent}`}>
                  Try it <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRIVACY BANNER ══ */}
      <section className="py-14 px-6" style={{ background: 'linear-gradient(135deg,#14532d,#166534,#15803d)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl flex-shrink-0 animate-float" style={{ animationDuration: '5s' }}>🔒</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-black text-white text-2xl mb-3">Your Privacy is Our Default</h3>
            <p className="text-green-200/70 leading-relaxed">
              You never need to create an account. Every report, feedback, and activity is anonymous by default.
              We give you a random alias like <span className="text-green-300 font-black">EcoCitizen_4821</span> — no email, no phone number, no data stored on our servers.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {['No login required','No personal data','Anonymous by default','Identity never revealed'].map(t => (
                <span key={t} className="text-xs bg-green-800/50 border border-green-700/40 text-green-300 rounded-full px-3 py-1 font-medium">✅ {t}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActivePage('citizen')}
            className="flex-shrink-0 bg-white text-green-800 font-black px-7 py-3.5 rounded-2xl hover:bg-green-50 transition-colors shadow-xl whitespace-nowrap"
          >
            Learn More →
          </button>
        </div>
      </section>

      {/* ══ SOS SECTION ══ */}
      <section className="py-12 px-6 bg-gradient-to-r from-red-50 to-rose-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-5xl flex-shrink-0 animate-float" style={{ animationDelay: '1s', animationDuration: '6s' }}>🚨</div>
          <div className="flex-1">
            <h3 className="font-black text-red-700 text-xl mb-2">Need Help in a Park?</h3>
            <p className="text-red-500/80 text-sm leading-relaxed">
              Our one-tap SOS button instantly alerts park security with your location. No login, no form — just one press.
              Your identity stays completely protected even when sending SOS.
            </p>
          </div>
          <button
            onClick={() => useStore.getState().setShowSOS(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-7 py-3.5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-200"
          >
            <Phone size={16} /> Try SOS Demo
          </button>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg,#052e16 0%,#064e3b 50%,#052e16 100%)' }}
      >
        {/* Floating emojis in CTA too */}
        <FloatingElement emoji="🌳" style={{ left: '5%',  top: '20%', opacity: 0.12, animationDuration: '7s' }} />
        <FloatingElement emoji="🌿" style={{ right: '6%', top: '30%', opacity: 0.12, animationDuration: '6s', animationDelay: '2s' }} />
        <FloatingElement emoji="🌸" style={{ left: '10%', bottom: '20%', opacity: 0.1, animationDuration: '8s', animationDelay: '1s' }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-5">🌳</div>
          <h2 className="font-playfair text-4xl text-white mb-4">Ready to Explore Delhi's Parks?</h2>
          <p className="text-green-300/50 mb-8 leading-relaxed">
            Free · Anonymous · Smart · Built for every Delhi citizen.<br />
            Join 8,420+ citizens already using GreenPulse.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActivePage('map')}
              className="flex items-center gap-2 text-white font-black px-9 py-4 rounded-2xl transition-all shadow-2xl active:scale-95"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 8px 32px rgba(22,163,74,0.35)' }}
            >
              <Map size={18} /> Open Park Map
            </button>
            <button
              onClick={() => setActivePage('citizen')}
              className="flex items-center gap-2 border-2 border-green-700/50 text-green-300 hover:border-green-400 hover:bg-green-800/20 px-9 py-4 rounded-2xl font-bold transition-all"
            >
              <Leaf size={18} /> Citizen Hub
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-gray-950 py-10 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <span className="text-green-400 font-black text-lg">GreenPulse</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Intelligent citizen platform for Delhi's public green spaces. Built for DDA Greens Innovation Challenge 2025.
              </p>
            </div>
            <div>
              <div className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Quick Links</div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: '🗺️ Park Map', page: 'map' },
                  { label: '🌿 Citizen Hub', page: 'citizen' },
                  { label: '💬 Community', page: 'community' },
                  { label: '🏆 Rewards', page: 'rewards' },
                  { label: '🛡️ Safety SOS', page: 'citizen' },
                  { label: '📊 Admin', page: 'admin' },
                ].map(l => (
                  <button key={l.label} onClick={() => setActivePage(l.page as any)}
                    className="text-gray-500 hover:text-green-400 text-sm text-left transition-colors py-0.5">
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Built With</div>
              <div className="flex flex-wrap gap-2">
                {['Next.js 14','TypeScript','Tailwind CSS','Leaflet.js','Recharts','Zustand'].map(t => (
                  <span key={t} className="text-xs bg-gray-800 text-gray-400 rounded-full px-2.5 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-gray-600 text-xs">© 2025 GreenPulse · DDA Greens Innovation Challenge</div>
            <div className="text-gray-600 text-xs">Privacy First · Open Platform · Anonymous by Default · Free Forever</div>
          </div>
        </div>
      </footer>
    </div>
  );
}