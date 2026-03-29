'use client';
import { useStore } from '@/store/useStore';
import { parks } from '@/data/parks';
import { Shield, Map, ChevronRight, Star, Phone, Leaf } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let cur = 0; const step = end / 50;
      const t = setInterval(() => { cur = Math.min(cur + step, end); setVal(Math.floor(cur)); if (cur >= end) clearInterval(t); }, 20);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <div ref={ref}>{val.toLocaleString()}{suffix}</div>;
}

function LiveTicker() {
  const msgs = [
    '🟢 Lodhi Garden — Only 22% crowd right now. Great time to visit!',
    '🌸 Garden of Five Senses — AQI 55 (Good). Jasmine walk is blooming!',
    '⚠️ Deer Park — High crowd. AI suggests Nehru Park instead.',
    '🏆 EcoCitizen_4821 just became a Forest Guardian!',
    '🌅 Early Bird Challenge: Visit before 7am to earn +30 bonus points!',
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i+1)%msgs.length); setVis(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-green-900/60 border-b border-green-800/40 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-[10px] font-black tracking-widest uppercase">Live</span>
        </div>
        <span className={`text-green-300/70 text-xs transition-opacity duration-300 ${vis ? 'opacity-100' : 'opacity-0'}`}>{msgs[idx]}</span>
      </div>
    </div>
  );
}

function ParkCard({ park }: { park: typeof parks[0] }) {
  const { setSelectedPark, setActivePage, markVisited, addPoints, toggleFavorite, favoriteParks } = useStore();
  const isFav = favoriteParks.includes(park.id);
  const crowdCls = park.crowd === 'low' ? 'text-green-600 bg-green-50' : park.crowd === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const aqiCls = park.aqi < 50 ? 'text-green-600 bg-green-50' : park.aqi < 100 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const bar = park.crowd === 'low' ? 'bg-green-400' : park.crowd === 'medium' ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div onClick={() => { setSelectedPark(park); setActivePage('map'); markVisited(park.id); addPoints(10); }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-50/80 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden group">
      <div className={`h-1 w-full ${bar}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-2xl">{park.image}</div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{park.name}</h3>
              <p className="text-gray-400 text-[11px]">{park.area} · {park.area_hectares}ha</p>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); toggleFavorite(park.id); }}
            className={`text-base transition-all ${isFav ? 'opacity-100' : 'opacity-20 group-hover:opacity-50'}`}>
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[{l:'Crowd',v:`${park.crowdPct}%`,c:crowdCls},{l:'AQI',v:`${park.aqi}`,c:aqiCls},{l:'Safety',v:`${park.safetyScore}`,c:'text-purple-600 bg-purple-50'}].map(m => (
            <div key={m.l} className={`rounded-xl p-2 text-center ${m.c}`}>
              <div className="font-black text-sm">{m.v}</div>
              <div className="text-[10px] opacity-60">{m.l}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {park.womenSafe && <span className="text-[10px] bg-purple-50 text-purple-600 rounded-full px-1.5 py-0.5 font-semibold">👩 Safe</span>}
            {park.childFriendly && <span className="text-[10px] bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5 font-semibold">👶 Kids</span>}
            {park.darkZones && <span className="text-[10px] bg-red-50 text-red-500 rounded-full px-1.5 py-0.5 font-semibold">⚠️ Dark</span>}
          </div>
          <div className="flex items-center gap-0.5 text-amber-400 text-xs">
            <Star size={10} fill="currentColor" /><span className="text-gray-500 font-bold text-xs ml-0.5">{park.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { setActivePage } = useStore();
  const best = parks.filter(p => p.crowd !== 'high').sort((a,b) => b.safetyScore - a.safetyScore).slice(0, 3);

  return (
    <div className="pt-[60px]">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background:'linear-gradient(150deg,#071912 0%,#0d2818 55%,#0c2218 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:'linear-gradient(rgba(82,191,132,1) 1px,transparent 1px),linear-gradient(90deg,rgba(82,191,132,1) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />
        <div className="absolute top-16 left-8 w-80 h-80 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 right-16 w-60 h-60 bg-green-400/8 rounded-full blur-3xl pointer-events-none" />
        {['🌿','🌳','🍃','🌸','🌱','🦋'].map((e,i) => (
          <div key={i} className="absolute text-3xl opacity-[0.06] animate-float pointer-events-none select-none"
            style={{ left:`${[6,85,45,15,75,55][i]}%`, top:`${[25,20,65,70,50,30][i]}%`, animationDelay:`${i*0.9}s`, animationDuration:`${5+i*0.7}s` }}>
            {e}
          </div>
        ))}
        <LiveTicker />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-800/40 border border-green-700/40 text-green-400 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-7">
            <Leaf size={11} /> DDA Greens Innovation Challenge 2025
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-5">
            Delhi's Parks,<br />
            <em className="not-italic" style={{ background:'linear-gradient(120deg,#52bf84,#7dd4a8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Finally Smart
            </em>
          </h1>
          <p className="text-green-200/55 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto font-light">
            Find the best park near you. See live crowd levels, air quality, and safety — before you even leave home.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-5">
            <button onClick={() => setActivePage('map')}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-green-900/40 active:scale-95">
              <Map size={18} /> Find a Park Now
            </button>
            <button onClick={() => setActivePage('citizen')}
              className="flex items-center gap-2 border-2 border-green-700/50 text-green-300 hover:border-green-500 hover:bg-green-800/20 px-8 py-4 rounded-2xl text-base font-bold transition-all">
              <Leaf size={18} /> Citizen Hub
            </button>
          </div>
          <div className="text-green-600/50 text-xs flex items-center justify-center gap-1.5">
            <Shield size={11} /> No sign-up · 100% anonymous · Free forever
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-green-800/40 max-w-xl mx-auto">
            {[{end:900,suffix:'+',label:'DDA Parks'},{end:14820,suffix:'',label:'Visits Today'},{end:8420,suffix:'',label:'Citizens'},{end:100,suffix:'%',label:'Privacy'}].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white"><Counter end={s.end} suffix={s.suffix} /></div>
                <div className="text-green-500/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 text-xs font-black uppercase tracking-widest mb-2">Simple as 1-2-3</p>
          <h2 className="font-playfair text-3xl text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-7 left-1/3 right-1/3 h-px bg-green-100" />
            {[
              {n:'1',icon:'📍',title:'Find Your Park',desc:'Browse parks near you, filter by crowd level, safety, or child-friendliness.'},
              {n:'2',icon:'📊',title:'Check Live Data',desc:'See real-time crowd %, air quality index, and safety score — all in one place.'},
              {n:'3',icon:'🎮',title:'Visit & Earn',desc:'Go there, scan plant QR codes, report issues, earn points and badges!'},
            ].map(s => (
              <div key={s.n} className="relative text-center">
                <div className="relative w-14 h-14 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {s.icon}
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-green-600 text-white rounded-full text-xs font-black flex items-center justify-center shadow">{s.n}</div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST PARKS RIGHT NOW */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-green-600 text-xs font-black uppercase tracking-widest mb-1">Updated just now</p>
              <h2 className="font-playfair text-3xl text-gray-800">Best Parks Right Now</h2>
              <p className="text-gray-400 text-sm mt-0.5">Low crowd · Good air quality · Safe to visit</p>
            </div>
            <button onClick={() => setActivePage('map')}
              className="flex items-center gap-1 text-green-600 font-bold text-sm hover:text-green-700 transition-colors">
              View all <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {best.map(p => <ParkCard key={p.id} park={p} />)}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 px-6 bg-gradient-to-b from-[#f6fbf8] to-[#edf7f2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 text-xs font-black uppercase tracking-widest mb-2">Everything In One Place</p>
            <h2 className="font-playfair text-3xl text-gray-800">What Can You Do Here?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {e:'🗺️', who:'For Everyone', t:'Find Your Perfect Park', d:'Filter by crowd, air quality, and whether safe for women or kids. Open the map and find your park instantly.', page:'map'},
              {e:'🌿', who:'Nature Lovers', t:'Discover Plants & Trees', d:'Scan QR codes on trees to learn their names, health benefits, and fun facts. Like Pokémon Go — but for nature!', page:'citizen'},
              {e:'🛡️', who:'Women & Families', t:'Safety First', d:'Check safety scores, find well-lit routes, use our SOS button if you need help. Your identity is always protected.', page:'citizen'},
              {e:'🎮', who:'All Citizens', t:'Earn Reward Points', d:'Visit parks, complete eco-challenges, and report issues to earn points. Redeem with local partner shops!', page:'rewards'},
              {e:'💬', who:'Community', t:'Share Tips & Events', d:'Post nature photos, share tips, join yoga groups. Fully anonymous if you prefer — no account needed.', page:'community'},
              {e:'📊', who:'DDA / Park Managers', t:'Admin Intelligence', d:'Real-time footfall data, AI suggestions, anonymous citizen reports, and automated safety alerts.', page:'admin'},
            ].map(f => (
              <div key={f.t}
                onClick={() => setActivePage(f.page as any)}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-green-200 transition-all cursor-pointer group">
                <div className="text-3xl mb-3">{f.e}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">{f.who}</div>
                <h3 className="font-bold text-gray-800 mb-1.5 group-hover:text-green-700 transition-colors">{f.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.d}</p>
                <div className="mt-3 text-green-600 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="py-12 px-6 bg-green-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="text-5xl flex-shrink-0">🔒</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-black text-white text-xl mb-2">Your Privacy is Our Default</h3>
            <p className="text-green-300/70 leading-relaxed text-sm">
              You never need to create an account. Every report, feedback, and activity is anonymous by default. We give you a random alias like <span className="text-green-300 font-bold">EcoCitizen_4821</span> — no email, no phone, no tracking ever.
            </p>
          </div>
          <button onClick={() => setActivePage('citizen')}
            className="flex-shrink-0 bg-white text-green-800 font-black px-6 py-3 rounded-xl hover:bg-green-50 transition-colors whitespace-nowrap">
            Learn More →
          </button>
        </div>
      </section>

      {/* SOS */}
      <section className="py-10 px-6 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-4xl flex-shrink-0">🚨</div>
          <div className="flex-1">
            <h3 className="font-black text-red-700 text-lg mb-1">Need Help in a Park?</h3>
            <p className="text-red-500/70 text-sm">Our SOS button instantly alerts park security with your location. Works without login, identity stays protected.</p>
          </div>
          <button onClick={() => useStore.getState().setShowSOS(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-xl transition-all active:scale-95">
            <Phone size={16} /> SOS Demo
          </button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-6" style={{ background:'linear-gradient(135deg,#061810,#0d2818)' }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-4">🌳</div>
          <h2 className="font-playfair text-3xl text-white mb-3">Ready to Explore Delhi's Parks?</h2>
          <p className="text-green-300/50 mb-7 text-sm leading-relaxed">Free · Anonymous · Smart · Built for every Delhi citizen</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setActivePage('map')} className="bg-green-500 hover:bg-green-400 text-white font-black px-8 py-3.5 rounded-2xl transition-all">🗺️ Open Park Map</button>
            <button onClick={() => setActivePage('citizen')} className="border-2 border-green-700 text-green-300 hover:border-green-500 px-8 py-3.5 rounded-2xl font-bold transition-all">🌿 Citizen Hub</button>
          </div>
        </div>
      </section>

      <footer className="bg-green-950 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><span className="text-xl">🌿</span><span className="text-green-400 font-black">GreenPulse</span><span className="text-green-700 text-xs">— DDA Greens 2025</span></div>
          <div className="flex gap-5 text-green-700 text-xs font-medium">
            {(['map','citizen','community','rewards','admin'] as const).map(p => (
              <button key={p} onClick={() => setActivePage(p)} className="hover:text-green-500 capitalize">{p === 'citizen' ? 'Citizen Hub' : p}</button>
            ))}
          </div>
          <div className="text-green-800 text-xs">Privacy First · Open Platform · Free Forever</div>
        </div>
      </footer>
    </div>
  );
}
