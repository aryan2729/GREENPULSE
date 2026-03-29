'use client';
import { useStore } from '@/store/useStore';
import { parks, plants, challenges } from '@/data/parks';
import { Shield, Map, QrCode, AlertCircle, Heart, Trophy, Leaf, ChevronRight, Star, Phone, Navigation, Wind, Users, Thermometer, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import QrScannerModal from './QrScannerModal';

function useThemeTokens() {
  const darkMode = useStore(s => s.darkMode);
  return {
    darkMode,
    pageBg: darkMode ? 'bg-gray-950' : 'bg-[#f6fbf8]',
    surface: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100',
    surfaceSoft: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    muted: darkMode ? 'text-gray-400' : 'text-gray-400',
    muted2: darkMode ? 'text-gray-500' : 'text-gray-500',
  };
}

/* ─── Section header ─── */
function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  const t = useThemeTokens();
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${t.darkMode ? 'bg-green-900/30 border border-green-800/40' : 'bg-green-50 border border-green-100'}`}>{emoji}</div>
      <div>
        <h2 className={`font-black text-lg ${t.text}`}>{title}</h2>
        {subtitle && <p className={`text-sm ${t.muted}`}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─── Live Park Finder ─── */
function ParkFinderCard() {
  const { setActivePage, setMapFilter } = useStore();
  const t = useThemeTokens();
  const quickFilters = [
    { label: 'Near Me (Low Crowd)', filter: 'low', icon: '🟢', desc: 'Parks with less than 40% crowd right now' },
    { label: 'Safe for Women', filter: 'safe', icon: '👩', desc: 'Well-lit, patrolled parks with good safety scores' },
    { label: 'Child Friendly', filter: 'child', icon: '👶', desc: 'Parks with play areas and family amenities' },
    { label: 'Accessible', filter: 'accessible', icon: '♿', desc: 'Parks with wheelchair access and easy paths' },
  ];
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${t.surface}`}>
      <SectionHeader emoji="🗺️" title="Find Your Perfect Park" subtitle="Choose what matters most to you" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickFilters.map(f => (
          <button key={f.filter}
            onClick={() => { setMapFilter(f.filter); setActivePage('map'); }}
            className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all group border
              ${t.darkMode ? 'bg-green-900/20 hover:bg-green-900/30 border-green-800/40 hover:border-green-700/60' : 'bg-green-50 hover:bg-green-100 border-green-100 hover:border-green-300'}`}>
            <span className="text-2xl">{f.icon}</span>
            <div className="flex-1">
              <div className={`font-bold text-sm transition-colors ${t.darkMode ? 'text-gray-100 group-hover:text-green-300' : 'text-gray-800 group-hover:text-green-700'}`}>{f.label}</div>
              <div className={`text-xs ${t.muted}`}>{f.desc}</div>
            </div>
            <ChevronRight size={14} className="text-green-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
      <button onClick={() => setActivePage('map')}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all text-sm">
        <Map size={15} /> Open Full Map
      </button>
    </div>
  );
}

/* ─── Live Park Status mini cards ─── */
function LiveStatusCard({ park }: { park: typeof parks[0] }) {
  const { setSelectedPark, setActivePage, toggleFavorite, favoriteParks } = useStore();
  const t = useThemeTokens();
  const isFav = favoriteParks.includes(park.id);
  const crowdColor = park.crowd === 'low' ? 'text-green-600' : park.crowd === 'medium' ? 'text-amber-600' : 'text-red-600';
  const crowdBg   = park.crowd === 'low' ? 'bg-green-50'  : park.crowd === 'medium' ? 'bg-amber-50'  : 'bg-red-50';
  return (
    <div onClick={() => { setSelectedPark(park); setActivePage('map'); }}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:shadow-sm transition-all group border
        ${t.darkMode ? 'bg-gray-900 border-gray-800 hover:border-green-900/60' : 'bg-white border-gray-100 hover:border-green-200'}`}>
      <div className="text-2xl">{park.image}</div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm truncate ${t.text}`}>{park.name}</div>
        <div className={`text-xs ${t.muted}`}>{park.area}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${crowdColor} ${t.darkMode ? 'bg-gray-800' : crowdBg}`}>{park.crowdPct}%</div>
        <div className={`text-xs font-bold ${park.aqi<50?'text-green-500':park.aqi<100?'text-amber-500':'text-red-500'}`}>AQI {park.aqi}</div>
      </div>
      <button onClick={e => { e.stopPropagation(); toggleFavorite(park.id); }}
        className={`text-sm flex-shrink-0 ${isFav ? '' : 'opacity-30 group-hover:opacity-60'}`}>
        {isFav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

/* ─── QR Nature Explorer ─── */
function NatureExplorer() {
  const { scannedPlants, markPlantScanned, addPoints } = useStore();
  const t = useThemeTokens();
  const [selected, setSelected] = useState<typeof plants[0] | null>(null);
  const [scanOpen, setScanOpen] = useState(false);

  const handleScan = (plant: typeof plants[0]) => {
    if (!scannedPlants.includes(plant.id)) {
      markPlantScanned(plant.id);
      addPoints(20);
    }
    setSelected(plant);
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${t.surface}`}>
      <SectionHeader emoji="🌿" title="QR Nature Explorer" subtitle="Tap a plant to learn about it. In the park, scan QR codes on trees!" />

      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => setScanOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all border
            ${t.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-gray-100' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
        >
          <QrCode size={16} className="text-green-500" /> Scan QR
        </button>
        <div className={`text-xs ${t.muted}`}>Scanning gives <span className="font-black text-green-600">+20 pts</span> per plant</div>
      </div>

      {selected && (
        <div className={`mb-4 rounded-xl p-4 border ${t.darkMode ? 'bg-green-900/20 border-green-800/40' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selected.icon}</div>
              <div>
                <div className={`font-black ${t.text}`}>{selected.name}</div>
                <div className={`text-xs italic ${t.muted}`}>{selected.scientific}</div>
                <div className="text-[10px] text-green-600 font-bold mt-0.5">{selected.category}{selected.endemic ? ' · Native to India' : ''}{selected.medicinal ? ' · Medicinal' : ''}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className={`${t.muted} hover:text-gray-300`}><X size={16}/></button>
          </div>
          <div className="mt-3 space-y-2">
            <div className={`text-xs flex items-start gap-2 ${t.darkMode ? 'text-gray-200' : 'text-gray-600'}`}><span className="text-green-500 flex-shrink-0">✅</span> {selected.benefits}</div>
            <div className={`text-xs rounded-lg px-3 py-2 flex items-start gap-2 ${t.darkMode ? 'text-amber-200 bg-amber-900/30' : 'text-amber-700 bg-amber-50'}`}>
              <span className="flex-shrink-0">💡</span> {selected.funFact}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className={`border rounded-lg p-2 text-center ${t.darkMode ? 'bg-gray-900 border-green-900/40' : 'bg-white border-green-100'}`}>
                <div className="font-black text-green-700 text-sm">{selected.co2_per_year_kg}kg</div>
                <div className={`text-[10px] ${t.muted}`}>CO₂/year</div>
              </div>
              <div className={`border rounded-lg p-2 text-center ${t.darkMode ? 'bg-gray-900 border-blue-900/40' : 'bg-white border-blue-100'}`}>
                <div className="font-black text-blue-700 text-sm">{selected.category}</div>
                <div className={`text-[10px] ${t.muted}`}>Type</div>
              </div>
              <div className={`border rounded-lg p-2 text-center ${t.darkMode ? 'bg-gray-900 border-purple-900/40' : 'bg-white border-purple-100'}`}>
                <div className="font-black text-purple-700 text-sm">{selected.medicinal ? 'Yes':'No'}</div>
                <div className={`text-[10px] ${t.muted}`}>Medicinal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`text-xs font-bold mb-2 ${t.muted2}`}>
        {scannedPlants.length}/{plants.length} plants discovered · Tap to learn
      </div>
      <div className={`rounded-full h-1.5 mb-4 ${t.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="bg-green-500 h-full rounded-full transition-all" style={{ width:`${(scannedPlants.length/plants.length)*100}%` }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {plants.map(p => {
          const done = scannedPlants.includes(p.id);
          return (
            <button key={p.id} onClick={() => handleScan(p)}
              className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all border
                ${done
                  ? (t.darkMode ? 'bg-green-900/20 border-green-800/40' : 'bg-green-50 border-green-200')
                  : (t.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-green-900/20 hover:border-green-800/40' : 'bg-gray-50 border-gray-100 hover:bg-green-50 hover:border-green-200')}`}>
              <span className="text-xl">{p.icon}</span>
              <div className="min-w-0">
                <div className={`font-bold text-xs truncate ${t.text}`}>{p.name}</div>
                <div className={`text-[10px] ${t.muted}`}>{done ? '✅ +20 pts' : 'Tap to scan'}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className={`mt-3 rounded-xl p-3 text-xs flex items-center gap-2 border ${t.darkMode ? 'bg-amber-900/30 border-amber-700/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
        <span className="text-lg">🔭</span>
        <span><b>AR Mode coming soon!</b> Point camera at any plant for instant ID. For now, tap here to learn.</span>
      </div>

      <QrScannerModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onScannedPlantId={(plantId) => {
          const plant = plants.find(p => p.id === plantId);
          if (plant) handleScan(plant);
        }}
        darkMode={t.darkMode}
      />
    </div>
  );
}

/* ─── Safety Hub ─── */
function SafetyHub() {
  const { setShowSOS, setActivePage, setMapFilter } = useStore();
  const t = useThemeTokens();
  const safestParks = parks.filter(p => p.womenSafe).sort((a,b) => b.safetyScore - a.safetyScore).slice(0,3);

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${t.surface}`}>
      <SectionHeader emoji="🛡️" title="Safety Hub" subtitle="Your safety is our highest priority" />

      {/* SOS button */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 text-center">
        <div className="text-3xl mb-2">🚨</div>
        <div className="font-black text-red-700 text-base mb-1">Emergency SOS</div>
        <p className="text-red-500/80 text-xs mb-4">One tap → Park security gets your location instantly. Anonymous & safe.</p>
        <button onClick={() => setShowSOS(true)}
          className="flex items-center gap-2 mx-auto bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg">
          <Phone size={16} /> Send SOS Alert
        </button>
        <div className="text-[10px] text-red-400/60 mt-2">Your identity is never revealed</div>
      </div>

      {/* Safety tips */}
      <div className="mb-4">
        <div className={`font-bold text-sm mb-2 ${t.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Quick Safety Tips</div>
        <div className="space-y-2">
          {[
            {icon:'💡', tip:'Always visit parks with good lighting. Check the Safety Score before going.'},
            {icon:'📱', tip:'Save the SOS button to your home screen for quick access in emergencies.'},
            {icon:'👥', tip:'Prefer parks with higher crowd density for added safety after dark.'},
            {icon:'🗺️', tip:'Share your park plans with a friend or family member before visiting.'},
          ].map((t, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${useThemeTokens().darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <span className="text-base flex-shrink-0">{t.icon}</span>
              <span className={`text-xs leading-relaxed ${useThemeTokens().darkMode ? 'text-gray-200' : 'text-gray-600'}`}>{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safest parks */}
      <div>
        <div className={`font-bold text-sm mb-2 ${t.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>🏆 Safest Parks for Women Right Now</div>
        <div className="space-y-2">
          {safestParks.map(p => (
            <div key={p.id} onClick={() => { useStore.getState().setSelectedPark(p); setActivePage('map'); }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                ${t.darkMode ? 'bg-purple-900/20 border-purple-800/40 hover:bg-purple-900/30' : 'bg-purple-50 border-purple-100 hover:bg-purple-100'}`}>
              <span className="text-xl">{p.image}</span>
              <div className="flex-1">
                <div className={`font-bold text-sm ${t.text}`}>{p.name}</div>
                <div className={`text-xs ${t.muted}`}>{p.area}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-purple-700 text-sm">{p.safetyScore}/100</div>
                <div className={`text-[10px] ${t.muted}`}>Safety</div>
              </div>
              <ChevronRight size={14} className="text-purple-400" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => { setMapFilter('safe'); setActivePage('map'); }}
        className="mt-3 w-full flex items-center justify-center gap-2 border border-purple-300 text-purple-600 font-bold py-2.5 rounded-xl hover:bg-purple-50 transition-all text-sm">
        <Map size={14} /> View All Safe Parks on Map
      </button>
    </div>
  );
}

/* ─── Mini Challenges ─── */
function ChallengesWidget() {
  const { addPoints } = useStore();
  const t = useThemeTokens();
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${t.surface}`}>
      <SectionHeader emoji="🎮" title="Challenges & Rewards" subtitle="Complete challenges, earn points, win rewards" />
      <div className="space-y-3 mb-4">
        {challenges.slice(0, 5).map(c => {
          const pct = Math.min(100, (c.progress / c.total) * 100);
          const done = c.progress >= c.total;
          const isClaimed = claimed.has(c.id);
          return (
            <div key={c.id} className={`p-3 rounded-xl border transition-all ${done && !isClaimed
              ? (t.darkMode ? 'bg-green-900/20 border-green-800/40' : 'bg-green-50 border-green-300')
              : (t.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${t.text}`}>{c.title}</span>
                    <span className="text-xs font-black text-green-600">+{c.pts} pts</span>
                  </div>
                  <div className={`text-xs ${t.muted}`}>{c.desc}</div>
                </div>
              </div>
              <div className={`rounded-full h-1.5 border ${t.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="bg-green-500 h-full rounded-full transition-all" style={{ width:`${pct}%` }} />
              </div>
              <div className={`flex justify-between text-[10px] mt-1 ${t.muted}`}>
                <span>{c.progress}/{c.total}</span>
                {done && !isClaimed && (
                  <button onClick={() => { addPoints(c.pts); setClaimed(s => { const n = new Set(s); n.add(c.id); return n; }); }}
                    className="text-green-600 font-black text-xs">🎉 Claim!</button>
                )}
                {isClaimed && <span className="text-green-600 font-bold">✅ Claimed</span>}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => useStore.getState().setActivePage('rewards')}
        className="w-full flex items-center justify-center gap-2 border border-amber-300 text-amber-700 font-bold py-2.5 rounded-xl hover:bg-amber-50 transition-all text-sm">
        <Trophy size={14} /> View All Rewards & Leaderboard
      </button>
    </div>
  );
}

/* ─── Anonymous ID card ─── */
function PrivacyCard() {
  const { alias, isAnonymous, toggleAnonymous, points, visitedParks, level } = useStore();
  return (
    <div className="bg-green-800 rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-green-400" />
        <span className="font-black text-base">Your Anonymous Identity</span>
        <span className="ml-auto text-[10px] bg-green-700/50 border border-green-600/40 text-green-300 rounded-full px-2 py-0.5">🔒 Protected</span>
      </div>
      <div className="bg-green-900/50 rounded-xl p-4 mb-4">
        <div className="text-3xl font-black text-white mb-0.5">{alias}</div>
        <div className="text-green-400/70 text-sm">{level} · {visitedParks.length} parks visited</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-amber-400 font-black text-xl">⚡ {points}</span>
          <span className="text-green-400/50 text-xs">Green Points</span>
        </div>
      </div>
      <div className="space-y-2 text-xs text-green-300/70 mb-4">
        <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-400" /> No email or phone number required</div>
        <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-400" /> Your alias is randomly generated</div>
        <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-400" /> Reports show as "Anonymous User"</div>
        <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-400" /> Points stored only on your device</div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-green-200">Anonymous Mode</div>
          <div className="text-[10px] text-green-400/50">{isAnonymous ? 'Active — identity protected' : 'Disabled — identity shared'}</div>
        </div>
        <div onClick={toggleAnonymous}
          className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${isAnonymous ? 'bg-green-500' : 'bg-gray-500'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    </div>
  );
}

/* ─── Report Issue ─── */
function ReportIssue() {
  const { alias, isAnonymous, addPoints } = useStore();
  const [form, setForm] = useState({ park:'p1', type:'safety', issue:'', shareId:false });
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!form.issue.trim()) return;
    try {
      await fetch('/api/reports', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ parkId:form.park, parkName: parks.find(p=>p.id===form.park)?.name, type:form.type, issue:form.issue, shareIdentity:form.shareId, alias }),
      });
    } catch(_) {}
    addPoints(25);
    setDone(true);
    setTimeout(() => { setDone(false); setForm(f => ({...f, issue:''})); }, 3000);
  };

  if (done) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
      <div className="text-4xl mb-3">✅</div>
      <div className="font-black text-green-700 text-lg">Report Submitted!</div>
      <div className="text-gray-400 text-sm mt-1">+25 points earned. DDA admin has been notified anonymously.</div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <SectionHeader emoji="📢" title="Report a Park Issue" subtitle="Help improve Delhi's parks — anonymously" />
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 text-xs text-green-700 mb-4">
        <Shield size={13} className="flex-shrink-0 mt-0.5 text-green-500" />
        <span><b>Safe Reporting:</b> Your identity is never revealed to park admins. Reports appear as "Anonymous User".</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Park</label>
          <select value={form.park} onChange={e => setForm(f=>({...f,park:e.target.value}))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white">
            {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Issue Type</label>
          <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white">
            <option value="safety">🛡️ Safety</option>
            <option value="lighting">💡 Lighting</option>
            <option value="cleanliness">🧹 Cleanliness</option>
            <option value="infra">🏗️ Infrastructure</option>
            <option value="nature">🌿 Plants/Trees</option>
            <option value="other">📝 Other</option>
          </select>
        </div>
      </div>

      {/* Quick report buttons */}
      <div className="mb-3">
        <div className="text-xs font-bold text-gray-500 mb-2">Quick Report (tap to fill)</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['💡 Bad Lighting','🚿 Dirty Restroom','🔒 Unsafe Area','🪑 No Seating','🚮 Litter Problem','🌿 Fallen Tree'].map(q => (
            <button key={q} onClick={() => setForm(f=>({...f, issue:q.slice(3)}))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-left hover:border-green-300 hover:bg-green-50 transition-all text-gray-600">
              {q}
            </button>
          ))}
        </div>
      </div>

      <textarea value={form.issue} onChange={e => setForm(f=>({...f,issue:e.target.value}))}
        placeholder="Describe the issue in detail..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-green-400 h-20 mb-3" />

      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500">
          <input type="checkbox" checked={form.shareId} onChange={e => setForm(f=>({...f,shareId:e.target.checked}))} className="rounded" />
          <span>Optionally share as <span className="font-bold">{alias}</span></span>
        </label>
        <span className="text-green-600 text-xs font-black">+25 pts</span>
      </div>

      <button onClick={submit}
        className="w-full bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
        <Shield size={14} /> Submit Report (Anonymous)
      </button>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function CitizenPage() {
  const t = useThemeTokens();
  const [tab, setTab] = useState<'dashboard'|'nature'|'safety'|'report'>('dashboard');

  const tabs = [
    { id:'dashboard', emoji:'🏠', label:'Dashboard' },
    { id:'nature',    emoji:'🌿', label:'Nature' },
    { id:'safety',    emoji:'🛡️', label:'Safety' },
    { id:'report',    emoji:'📢', label:'Report' },
  ] as const;

  return (
    <div className={`pt-[60px] min-h-screen ${t.pageBg}`}>
      {/* Header */}
      <div className="px-6 py-8" style={{ background:'linear-gradient(160deg,#061810,#1a3d28)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 mb-2">
            <Leaf size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h1 className="font-playfair text-3xl text-white mb-0.5">Citizen Hub</h1>
              <p className="text-green-300/55 text-sm">Your personal park companion — everything you need as a Delhi park citizen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b sticky top-[60px] z-30 ${t.darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 flex-1 justify-center py-3.5 text-xs sm:text-sm font-bold transition-all border-b-2
                ${tab === t.id
                  ? (useThemeTokens().darkMode ? 'text-green-300 border-green-500 bg-green-900/20' : 'text-green-700 border-green-600 bg-green-50/50')
                  : (useThemeTokens().darkMode ? 'text-gray-500 border-transparent hover:text-gray-200 hover:bg-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600')}`}>
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <>
            <PrivacyCard />
            <ParkFinderCard />
            {/* Live status */}
            <div className={`rounded-2xl border p-5 shadow-sm ${t.surface}`}>
              <SectionHeader emoji="📊" title="Live Park Status" subtitle="All parks right now — click to open on map" />
              <div className="space-y-2">
                {parks.map(p => <LiveStatusCard key={p.id} park={p} />)}
              </div>
            </div>
            <ChallengesWidget />
          </>
        )}

        {/* NATURE */}
        {tab === 'nature' && <NatureExplorer />}

        {/* SAFETY */}
        {tab === 'safety' && <SafetyHub />}

        {/* REPORT */}
        {tab === 'report' && <ReportIssue />}
      </div>
    </div>
  );
}
