'use client';
import { useStore } from '@/store/useStore';
import { plants, parks, Park } from '@/data/parks';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { X, MapPin, Clock, Shield, Leaf, Wind, Thermometer, Users, QrCode, AlertTriangle, Star, ChevronRight, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── Colored stat box ── */
function StatBox({ val, label, color, bg }: { val: string | number; label: string; color: string; bg: string }) {
  return (
    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: bg }}>
      <div className="font-black text-xl leading-none mb-1" style={{ color }}>{val}</div>
      <div className="text-xs font-medium opacity-60" style={{ color }}>{label}</div>
    </div>
  );
}

/* ── Expandable plant card ── */
function PlantCard({ name }: { name: string }) {
  const plant = plants.find(p => p.name === name) || {
    id: name, name, scientific: '', benefits: 'Natural greenery supporting local ecology.',
    icon: '🌿', funFact: 'Part of Delhi\'s urban forest ecosystem.',
    category: 'Plant', co2_per_year_kg: 8, medicinal: false, endemic: false,
  };
  const { scannedPlants, markPlantScanned, addPoints } = useStore();
  const scanned = scannedPlants.includes(plant.id);
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`border rounded-xl p-3 cursor-pointer transition-all ${open ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-green-200 hover:bg-green-50/40'}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white border border-gray-100">{plant.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-800 truncate">{plant.name}</div>
          {plant.scientific && <div className="text-[10px] text-gray-400 italic">{plant.scientific}</div>}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); if (!scanned) { markPlantScanned(plant.id); addPoints(20); } }}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${scanned ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
          >
            {scanned ? '✅ Done' : '📷 +20'}
          </button>
          <ChevronRight size={12} className={`text-gray-300 transition-transform ${open ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-green-100 space-y-2">
          <p className="text-xs text-gray-600 flex gap-2"><span className="text-green-500 flex-shrink-0">✅</span>{plant.benefits}</p>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 flex gap-2">
            <span className="flex-shrink-0">💡</span>{plant.funFact}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: `${plant.co2_per_year_kg}kg`, l: 'CO₂/year', c: '#16a34a', bg: '#f0fdf4' },
              { v: plant.category, l: 'Type', c: '#2563eb', bg: '#eff6ff' },
              { v: plant.medicinal ? 'Yes' : 'No', l: 'Medicinal', c: '#7c3aed', bg: '#f5f3ff' },
            ].map(s => (
              <div key={s.l} className="rounded-lg p-2 text-center" style={{ background: s.bg }}>
                <div className="text-xs font-black" style={{ color: s.c }}>{s.v}</div>
                <div className="text-[9px] text-gray-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Feedback form ── */
function FeedbackTab({ park }: { park: Park }) {
  const { alias, addPoints } = useStore();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [shareId, setShareId] = useState(false);
  const [cat, setCat] = useState('general');
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!text.trim() && rating === 0) return;
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkId: park.id, rating, comment: text || cat, shareIdentity: shareId, alias, category: cat }),
      });
    } catch (_) {}
    addPoints(20);
    setDone(true);
    setTimeout(() => { setDone(false); setText(''); setRating(0); }, 3500);
  };

  if (done) return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-3">✅</div>
      <div className="font-black text-green-700 text-xl mb-1">Thank You!</div>
      <div className="text-gray-400 text-sm">+20 points earned. Your feedback helps improve Delhi's parks.</div>
      <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-600 flex items-center gap-2 justify-center">
        <Shield size={12} /> Submitted as Anonymous User
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 text-xs text-green-700">
        <Shield size={13} className="flex-shrink-0 mt-0.5 text-green-500" />
        <div><span className="font-bold">End-to-end safe.</span> Your identity is never shown to park admins. Reports appear as "Anonymous User".</div>
      </div>

      {/* Star rating */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">Rate your experience at {park.name}</div>
        <div className="flex gap-1.5">
          {[1,2,3,4,5].map(s => (
            <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
              className="text-2xl transition-transform hover:scale-110 active:scale-95">
              {s <= (hover || rating) ? '⭐' : '☆'}
            </button>
          ))}
          {rating > 0 && <span className="text-xs text-gray-400 self-center ml-1">{['','Poor','Fair','Good','Great','Excellent'][rating]}</span>}
        </div>
      </div>

      {/* Category */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">What's your feedback about?</div>
        <div className="flex gap-2 flex-wrap">
          {[['general','🌿','General'],['safety','🛡️','Safety'],['cleanliness','🧹','Cleanliness'],['infra','🏗️','Facilities'],['nature','🌸','Nature']].map(([id,e,l]) => (
            <button key={id} onClick={() => setCat(id)}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-all border
                ${cat === id ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
              {e} {l}
            </button>
          ))}
        </div>
      </div>

      {/* Quick reports */}
      <div>
        <div className="text-xs font-bold text-gray-500 mb-2">Quick Issue Report (tap to fill)</div>
        <div className="grid grid-cols-2 gap-2">
          {[['💡','Bad Lighting','safety'],['🚿','Dirty Restroom','cleanliness'],['🔒','Feels Unsafe','safety'],['🪑','No Seating','infra'],['🚮','Litter/Trash','cleanliness'],['🌿','Fallen Tree','nature']].map(([e,l,c]) => (
            <button key={l as string} onClick={() => { setText(`${l}`); setCat(c as string); }}
              className="text-xs border border-gray-200 rounded-xl px-2.5 py-2 text-left hover:border-green-300 hover:bg-green-50 transition-all text-gray-600 font-medium flex items-center gap-1.5">
              {e} {l}
            </button>
          ))}
        </div>
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Add more details about your experience or the issue…"
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 h-[90px] transition-all" />

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500">
          <input type="checkbox" checked={shareId} onChange={e => setShareId(e.target.checked)} className="rounded w-3.5 h-3.5" />
          <span>Share identity (optional)</span>
        </label>
        <span className="text-green-600 text-xs font-black">+20 pts</span>
      </div>

      <button onClick={submit}
        className="w-full bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-black py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-green-200">
        <Shield size={14} /> Submit Anonymously
      </button>
    </div>
  );
}

/* ══════════════════ MAIN PANEL ══════════════════ */
export default function ParkPanel() {
  const { selectedPark, setSelectedPark, scannedPlants, favoriteParks, toggleFavorite } = useStore();
  const [tab, setTab] = useState<'overview' | 'nature' | 'safety' | 'feedback'>('overview');
  const scrollRef = useRef<HTMLDivElement>(null);
  const p = selectedPark!;
  const isFav = favoriteParks.includes(p.id);

  const crowdColor   = p.crowd === 'low' ? '#16a34a' : p.crowd === 'medium' ? '#d97706' : '#dc2626';
  const crowdBg      = p.crowd === 'low' ? '#f0fdf4' : p.crowd === 'medium' ? '#fffbeb' : '#fef2f2';
  const aqiColor     = p.aqi < 50 ? '#16a34a' : p.aqi < 100 ? '#d97706' : '#dc2626';
  const aqiBg        = p.aqi < 50 ? '#f0fdf4' : p.aqi < 100 ? '#fffbeb' : '#fef2f2';
  const safetyColor  = p.safetyScore >= 85 ? '#16a34a' : p.safetyScore >= 70 ? '#d97706' : '#dc2626';
  const safetyBg     = p.safetyScore >= 85 ? '#f0fdf4' : p.safetyScore >= 70 ? '#fffbeb' : '#fef2f2';
  const temp         = p.crowd === 'low' ? 32 : p.crowd === 'medium' ? 37 : 43;
  const humidity     = p.crowd === 'low' ? 52 : p.crowd === 'medium' ? 63 : 72;
  const nearbyParks  = p.nearbyParks.map(id => parks.find(pk => pk.id === id)).filter(Boolean);

  const TABS = [
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'nature',   label: 'Nature',   emoji: '🌿' },
    { id: 'safety',   label: 'Safety',   emoji: '🛡️' },
    { id: 'feedback', label: 'Feedback', emoji: '💬' },
  ] as const;

  // When switching tabs, always show the top of the new section.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [tab]);

  return (
    <div className="h-full flex flex-col bg-white">

      {/* ── HEADER ── */}
      <div className="flex-shrink-0"
        style={{ background: 'linear-gradient(145deg,#064e3b 0%,#065f46 50%,#047857 100%)' }}>
        <div className="p-5">
          {/* Top row: close + fav */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">{p.image}</div>
              <div>
                <h2 className="text-white font-black text-xl leading-tight">{p.name}</h2>
                <div className="flex items-center gap-1.5 text-green-300/70 text-xs mt-0.5">
                  <MapPin size={10} />{p.area} · {p.zone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleFavorite(p.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-base
                  ${isFav ? 'bg-red-400/20 text-red-300' : 'bg-white/10 text-white/50 hover:text-white/80'}`}>
                {isFav ? '❤️' : '🤍'}
              </button>
              <button onClick={() => setSelectedPark(null)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Rating + timing */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.floor(p.rating) ? 'text-amber-400' : 'text-white/20'}`}>★</span>
              ))}
              <span className="text-green-200/60 text-xs ml-1.5">{p.rating} · {p.reviews.toLocaleString()} reviews</span>
            </div>
            <span className="text-green-700">·</span>
            <div className="flex items-center gap-1 text-green-300/60 text-xs">
              <Clock size={10} /> {p.openTime}–{p.closeTime}
            </div>
            <span className="text-green-700">·</span>
            <span className="text-green-300/60 text-xs">{p.area_hectares} ha</span>
          </div>

          {/* 4 stat boxes */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="rounded-xl p-2.5 text-center" style={{ background: crowdBg }}>
              <div className="font-black text-base leading-none" style={{ color: crowdColor }}>{p.crowdPct}%</div>
              <div className="text-[9px] mt-1 font-medium" style={{ color: crowdColor }}>Crowd</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: aqiBg }}>
              <div className="font-black text-base leading-none" style={{ color: aqiColor }}>{p.aqi}</div>
              <div className="text-[9px] mt-1 font-medium" style={{ color: aqiColor }}>AQI</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: '#f5f0ff' }}>
              <div className="font-black text-base leading-none text-purple-700">{p.comfortIndex}</div>
              <div className="text-[9px] mt-1 font-medium text-purple-500">Comfort</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: safetyBg }}>
              <div className="font-black text-base leading-none" style={{ color: safetyColor }}>{p.safetyScore}</div>
              <div className="text-[9px] mt-1 font-medium" style={{ color: safetyColor }}>Safety</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {p.womenSafe     && <span className="text-[10px] font-bold bg-purple-400/20 text-purple-200 border border-purple-400/30 rounded-full px-2 py-0.5">👩 Women Safe</span>}
            {p.childFriendly && <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30 rounded-full px-2 py-0.5">👶 Child Friendly</span>}
            {p.accessible    && <span className="text-[10px] font-bold bg-blue-400/20 text-blue-200 border border-blue-400/30 rounded-full px-2 py-0.5">♿ Accessible</span>}
            {p.darkZones     && <span className="text-[10px] font-bold bg-red-400/20 text-red-200 border border-red-400/30 rounded-full px-2 py-0.5">⚠️ Dark Zones</span>}
            <span className="text-[10px] font-bold bg-green-400/20 text-green-200 border border-green-400/30 rounded-full px-2 py-0.5">{p.zone}</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex-shrink-0 flex bg-white border-b border-gray-100">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-bold transition-all border-b-2
              ${tab === t.id ? 'text-green-700 border-green-600 bg-green-50/60' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
            <span>{t.emoji}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">

          {/* ════ OVERVIEW ════ */}
          {tab === 'overview' && (
            <>
              {/* Description */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="text-xs font-black text-green-700 uppercase tracking-wider mb-2">About this Park</div>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white rounded-xl p-2.5">
                    <div className="text-xs text-gray-400 mb-0.5">Area</div>
                    <div className="font-black text-gray-800">{p.area_hectares} hectares</div>
                  </div>
                  <div className="bg-white rounded-xl p-2.5">
                    <div className="text-xs text-gray-400 mb-0.5">Open Hours</div>
                    <div className="font-black text-gray-800">{p.openTime} – {p.closeTime}</div>
                  </div>
                </div>
              </div>

              {/* Microclimate */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="text-xs font-black text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Thermometer size={12} /> Microclimate Index
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <Users size={14} />, val: `${p.crowdPct}%`, label: 'Crowd', c: crowdColor, bg: crowdBg },
                    { icon: <Thermometer size={14} />, val: `${temp}°C`, label: 'Temp', c: '#dc2626', bg: '#fef2f2' },
                    { icon: <Wind size={14} />, val: `${humidity}%`, label: 'Humidity', c: '#2563eb', bg: '#eff6ff' },
                    { icon: <Leaf size={14} />, val: `${p.aqi}`, label: 'AQI', c: aqiColor, bg: aqiBg },
                  ].map((m, i) => (
                    <div key={i} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1" style={{ background: m.bg }}>
                      <div style={{ color: m.c }}>{m.icon}</div>
                      <div className="font-black text-sm leading-none" style={{ color: m.c }}>{m.val}</div>
                      <div className="text-[9px] font-medium" style={{ color: m.c, opacity: 0.7 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                {p.crowd === 'high' && (
                  <div className="mt-3 bg-amber-100 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-700 flex items-center gap-2">
                    <AlertTriangle size={12} className="flex-shrink-0" />
                    High crowd! Nearby: <strong>{nearbyParks[0]?.name || 'Lodhi Garden'}</strong> has only {nearbyParks[0]?.crowdPct || 22}% crowd.
                  </div>
                )}
              </div>

              {/* Crowd chart */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Crowd Level Today</div>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={p.crowdHistory} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                    <defs>
                      <linearGradient id={`cg${p.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={crowdColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={crowdColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke={crowdColor} fill={`url(#cg${p.id})`} strokeWidth={2.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AQI chart */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Air Quality (AQI) Today</div>
                <ResponsiveContainer width="100%" height={90}>
                  <BarChart data={p.aqiHistory} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {p.aqiHistory.map((d, i) => (
                        <Cell key={i} fill={d.value < 50 ? '#16a34a' : d.value < 100 ? '#d97706' : '#dc2626'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly footfall */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Weekly Footfall</div>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={p.weeklyVisits} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }} />
                    <Bar dataKey="value" fill="#3a9c67" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Recommendation */}
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#064e3b,#065f46)' }}>
                <div className="text-green-400 text-xs font-black mb-2 flex items-center gap-1.5">🤖 AI Recommendation</div>
                <div className="text-white text-sm font-medium leading-relaxed">
                  {p.crowd === 'low'
                    ? `✅ Great time to visit! Crowd at just ${p.crowdPct}% — well below average. AQI is ${p.aqiLabel.toLowerCase()}.`
                    : p.crowd === 'medium'
                    ? `⏰ Best visit times today: before 9am or after 4:30pm when crowd drops below 30%.`
                    : `⚠️ Very crowded right now (${p.crowdPct}%). We suggest ${nearbyParks[0]?.name || 'Lodhi Garden'} — only ${nearbyParks[0]?.crowdPct || 22}% crowd.`}
                </div>
                <div className="text-green-400/60 text-xs mt-2">
                  Best time today: {p.crowdHistory.reduce((m, c) => c.value < m.value ? c : m).time}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map(a => (
                    <span key={a} className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1 font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ════ NATURE ════ */}
          {tab === 'nature' && (
            <>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-white">QR Nature Explorer</div>
                  <div className="text-green-200/80 text-xs mt-0.5">Scan QR codes on trees in {p.name} · earn +20 pts each</div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-600">{p.plants.length} plant species here</span>
                  <span className="text-xs font-bold text-green-600">{p.plants.filter(pl => scannedPlants.includes(pl)).length}/{p.plants.length} discovered</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 mb-1">
                  <div className="bg-green-500 h-full rounded-full transition-all"
                    style={{ width: `${(p.plants.filter(pl => scannedPlants.includes(pl)).length / p.plants.length) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-400 text-right">
                  {p.plants.filter(pl => scannedPlants.includes(pl)).length === p.plants.length ? '🎉 All found!' : 'Keep exploring!'}
                </div>
              </div>

              <div className="space-y-2">
                {p.plants.map(pl => <PlantCard key={pl} name={pl} />)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                  <div className="font-black text-2xl text-green-700">
                    {p.plants.reduce((s, n) => s + (plants.find(pl => pl.name === n)?.co2_per_year_kg || 8), 0)}kg
                  </div>
                  <div className="text-xs text-gray-400 mt-1">CO₂ absorbed per year</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                  <div className="font-black text-2xl text-blue-700">{p.plants.length}</div>
                  <div className="text-xs text-gray-400 mt-1">Plant species found</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <span className="text-2xl flex-shrink-0">🔭</span>
                <div>
                  <div className="font-bold text-amber-800 text-sm">AR Mode — Coming Soon!</div>
                  <div className="text-amber-700/80 text-xs mt-1">Point your phone camera at any plant or tree for instant identification, facts, and points.</div>
                </div>
              </div>
            </>
          )}

          {/* ════ SAFETY ════ */}
          {tab === 'safety' && (
            <>
              {/* Big safety score */}
              <div className={`rounded-2xl p-5 flex items-center gap-4 ${p.safetyScore >= 85 ? 'bg-green-50 border border-green-200' : p.safetyScore >= 70 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="text-5xl">{p.safetyScore >= 85 ? '🛡️' : p.safetyScore >= 70 ? '⚠️' : '🔴'}</div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: safetyColor }}>Overall Safety Score</div>
                  <div className="font-black" style={{ fontSize: 40, lineHeight: 1, color: safetyColor }}>{p.safetyScore}<span className="text-lg text-gray-400">/100</span></div>
                  <div className="text-sm mt-1" style={{ color: safetyColor, opacity: 0.8 }}>
                    {p.safetyScore >= 85 ? 'Excellent — well lit, patrolled & monitored.' : p.safetyScore >= 70 ? 'Moderate — exercise normal caution.' : 'Low — avoid isolated areas after dark.'}
                  </div>
                </div>
              </div>

              {/* Safety checklist */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Safety Checklist</div>
                <div className="space-y-2">
                  {[
                    ['👩', 'Women Safe Zone', p.womenSafe],
                    ['📹', 'CCTV Coverage', p.safetyScore > 80],
                    ['👮', 'Security Personnel', p.safetyScore > 75],
                    ['💡', 'Adequate Lighting', !p.darkZones],
                    ['🌙', 'No Dark Zones', !p.darkZones],
                    ['👶', 'Child Safe', p.childFriendly],
                    ['♿', 'Accessible Paths', p.accessible],
                  ].map(([icon, label, val]) => (
                    <div key={label as string} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{icon}</span> {label}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                        {val ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dark zone alert */}
              {p.darkZones && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="font-bold text-red-700 flex items-center gap-2 mb-2"><AlertTriangle size={15} /> Dark Zones Detected</div>
                  <p className="text-red-600/90 text-sm leading-relaxed">This park has areas with insufficient lighting after sunset. AI has flagged this to DDA admin for urgent review. Avoid isolated paths after 6pm.</p>
                </div>
              )}

              {/* Safe route */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="font-bold text-blue-700 text-sm mb-2 flex items-center gap-2">🗺️ Recommended Safe Route</div>
                <p className="text-blue-600/80 text-xs mb-3 leading-relaxed">AI-generated path based on lighting coverage, crowd density, and CCTV monitoring zones.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-blue-700"><span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" /> Start at main entrance → follow central lit path</div>
                  <div className="flex items-center gap-2 text-xs text-blue-700"><span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" /> Stay near fountain/activity areas in evenings</div>
                  <div className="flex items-center gap-2 text-xs text-amber-600"><span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" /> Avoid: north-east corner and isolated trails after dark</div>
                </div>
              </div>

              {/* SOS */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">🚨</div>
                <div className="font-black text-red-700 text-base mb-1">Need Immediate Help?</div>
                <p className="text-red-500/80 text-sm mb-4 leading-relaxed">One tap sends your location to park security + emergency contact. Fully anonymous.</p>
                <button onClick={() => useStore.getState().setShowSOS(true)}
                  className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg text-sm">
                  🚨 Send SOS Alert
                </button>
                <div className="text-[10px] text-red-400/60 mt-2">Your identity is never revealed</div>
              </div>

              {/* Nearby safer parks */}
              {nearbyParks.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Safer Nearby Options</div>
                  {nearbyParks.map(np => np && (
                    <div key={np.id}
                      onClick={() => useStore.getState().setSelectedPark(np)}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100 transition-all mb-2">
                      <span className="text-xl">{np.image}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-800">{np.name}</div>
                        <div className="text-xs text-gray-400">Safety {np.safetyScore} · {np.crowdPct}% crowd · {np.area}</div>
                      </div>
                      <ChevronRight size={14} className="text-green-500" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ════ FEEDBACK ════ */}
          {tab === 'feedback' && <FeedbackTab park={p} />}

        </div>
      </div>
    </div>
  );
}
