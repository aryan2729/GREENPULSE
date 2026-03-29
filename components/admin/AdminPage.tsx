'use client';
import { useEffect } from 'react';
import { adminStats, parks } from '@/data/parks';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis
} from 'recharts';
import { AlertTriangle, Users, Wind, TreePine, ShieldAlert, Brain, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

function KPICard({ icon, value, label, sub, color, trend }: {
  icon: React.ReactNode; value: string | number; label: string;
  sub?: string; color: string; trend?: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-800">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-0.5">{label}</div>
      {sub && <div className="text-gray-300 dark:text-gray-500 text-[10px] mt-0.5">{sub}</div>}
      {trend && <div className="text-green-600 text-[10px] font-bold mt-1 flex items-center gap-0.5"><TrendingUp size={10} /> {trend}</div>}
    </div>
  );
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-50 border-red-200 text-red-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  low: 'bg-green-50 border-green-200 text-green-700',
};
const TYPE_ICON: Record<string, string> = {
  safety: '🛡️', infra: '🏗️', environment: '🌿',
};

export default function AdminPage() {
  const { darkMode } = useStore();
  const [approvedSuggestions, setApprovedSuggestions] = useState<Set<number>>(new Set());
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [resolvedReports, setResolvedReports] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'parks' | 'ai' | 'reports'>('overview');

  const radarData = adminStats.parkScores.map(p => ({
    park: p.park.split(' ')[0],
    score: p.score,
    visits: Math.round(p.visits / 50),
  }));

  return (
    <div className={`pt-[62px] min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Admin Header */}
      <div className="px-6 py-5 border-b border-green-800/30"
        style={{ background: 'linear-gradient(160deg, #061810, #0d2818)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-white font-black text-xl flex items-center gap-2">
              🏛️ DDA Admin Dashboard
              <span className="text-xs font-medium bg-green-700/50 text-green-300 border border-green-600/40 rounded-full px-2 py-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" /> Live
              </span>
            </h1>
            <p className="text-green-400/50 text-sm mt-0.5">Spatial Intelligence · AI Decision Engine · Risk Monitoring</p>
          </div>
          <div className="text-right text-xs">
            <div className="text-green-300 font-bold">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long'})}</div>
            <div className="text-green-600 mt-0.5">Last updated 2 min ago · Next refresh in 58s</div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className={`${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'} border-b px-6`}>
        <div className="max-w-7xl mx-auto flex gap-0">
          {(['overview','parks','ai','reports'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all border-b-2 ${activeTab === t ? 'text-green-700 border-green-600 bg-green-50/50' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
              {t === 'overview' ? '📊 Overview' : t === 'parks' ? '🌿 Parks' : t === 'ai' ? '🤖 AI Engine' : '📋 Reports'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <KPICard icon={<Users size={18} className="text-blue-600" />} value={adminStats.totalVisits} label="Visits Today" sub="All parks" color="bg-blue-50" trend="+12% vs yesterday" />
              <KPICard icon={<Users size={18} className="text-purple-600" />} value={adminStats.totalUsers} label="Total Users" sub="Active platform" color="bg-purple-50" trend="+340 this week" />
              <KPICard icon={<TreePine size={18} className="text-green-600" />} value={adminStats.activeParks} label="Active Parks" sub="Monitored" color="bg-green-50" />
              <KPICard icon={<Wind size={18} className="text-sky-600" />} value={adminStats.avgAqi} label="Avg AQI" sub="City-wide" color="bg-sky-50" />
              <KPICard icon={<Zap size={18} className="text-amber-600" />} value={adminStats.avgComfort} label="Avg Comfort" sub="Index score" color="bg-amber-50" />
              <KPICard icon={<AlertTriangle size={18} className="text-orange-600" />} value={adminStats.reportsToday} label="Reports Today" sub="Citizen reports" color="bg-orange-50" />
              <KPICard icon={<ShieldAlert size={18} className="text-red-600" />} value={adminStats.safetyAlerts} label="Safety Alerts" sub="Need action" color="bg-red-50" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Visit trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-700 text-sm mb-4 flex items-center gap-2">
                  <Users size={14} className="text-green-600" /> Weekly Footfall Trend
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={adminStats.visitTrend}>
                    <defs>
                      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3a9c67" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3a9c67" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Area type="monotone" dataKey="visits" stroke="#3a9c67" fill="url(#vg)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Safety scores */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-700 text-sm mb-4">Safety Scores</h3>
                <div className="space-y-3">
                  {adminStats.parkScores.map(ps => {
                    const col = ps.score >= 85 ? '#3a9c67' : ps.score >= 75 ? '#f5a623' : '#e05252';
                    return (
                      <div key={ps.park}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 font-medium truncate pr-2">{ps.park}</span>
                          <span className="font-black flex-shrink-0" style={{ color: col }}>{ps.score}</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2">
                          <div className="h-full rounded-full transition-all" style={{ width: `${ps.score}%`, background: col }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AQI + Hourly */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-700 text-sm mb-4 flex items-center gap-2">
                  <Wind size={14} className="text-sky-500" /> City-Wide AQI — 24h
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={adminStats.hourlyAqi}>
                    <XAxis dataKey="h" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                    <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                      {adminStats.hourlyAqi.map((d, i) => (
                        <Cell key={i} fill={d.v < 50 ? '#3a9c67' : d.v < 100 ? '#f5a623' : '#e05252'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-700 text-sm mb-4 flex items-center gap-2">
                  <Wind size={14} className="text-blue-400" /> Weekly AQI Trend
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={adminStats.aqiTrend}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Line type="monotone" dataKey="aqi" stroke="#60b3d4" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── PARKS TAB ── */}
        {activeTab === 'parks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {parks.map(p => {
              const crowdColor = p.crowd === 'low' ? '#3a9c67' : p.crowd === 'medium' ? '#f5a623' : '#e05252';
              const aqiCol = p.aqi < 50 ? 'text-green-600' : p.aqi < 100 ? 'text-amber-600' : 'text-red-600';
              return (
                <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{p.image}</div>
                    <div>
                      <div className="font-black text-gray-800">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.area} · {p.area_hectares} ha</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { l: 'Crowd', v: `${p.crowdPct}%`, c: crowdColor },
                      { l: 'AQI', v: p.aqi, c: p.aqi < 50 ? '#3a9c67' : p.aqi < 100 ? '#f5a623' : '#e05252' },
                      { l: 'Safety', v: p.safetyScore, c: p.safetyScore >= 85 ? '#3a9c67' : p.safetyScore >= 75 ? '#f5a623' : '#e05252' },
                      { l: 'Comfort', v: p.comfortIndex, c: '#9b59b6' },
                    ].map(m => (
                      <div key={m.l} className="bg-gray-50 rounded-xl p-2 text-center">
                        <div className="font-black text-sm" style={{ color: m.c }}>{m.v}</div>
                        <div className="text-[10px] text-gray-400">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.womenSafe ? <span className="text-[10px] bg-purple-50 text-purple-600 rounded-full px-2 py-0.5 font-bold">👩 Safe</span> : <span className="text-[10px] bg-red-50 text-red-500 rounded-full px-2 py-0.5 font-bold">⚠️ Risk</span>}
                    {p.darkZones && <span className="text-[10px] bg-red-50 text-red-600 rounded-full px-2 py-0.5 font-bold">🌙 Dark Zones</span>}
                    {p.accessible && <span className="text-[10px] bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 font-bold">♿ Accessible</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── AI ENGINE TAB ── */}
        {activeTab === 'ai' && (
          <>
            <div className="bg-green-900 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={20} className="text-green-400" />
                <h2 className="font-black text-xl">AI Decision Engine</h2>
                <span className="text-xs bg-green-800 text-green-300 border border-green-700 rounded-full px-2 py-0.5">Powered by Sensor + CCTV + Citizen Data</span>
              </div>
              <p className="text-green-300/60 text-sm">System processes crowd density, lighting, reports, and patterns to suggest actionable improvements for park management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminStats.aiSuggestions.map((s, i) => (
                <div key={i} className={`border rounded-2xl p-5 ${PRIORITY_COLORS[s.priority]}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{TYPE_ICON[s.type]}</span>
                      <div>
                        <div className="font-black text-sm">{s.park}</div>
                        <div className="flex gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 uppercase border ${PRIORITY_COLORS[s.priority]}`}>
                            {s.priority} priority
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 capitalize">{s.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">{s.impact} Impact</span>
                  </div>
                  <p className="text-sm font-medium mb-3 leading-relaxed">{s.msg}</p>
                  {approvedSuggestions.has(i) ? (
                    <div className="flex items-center gap-1 text-green-700 font-bold text-xs">
                      <CheckCircle size={12} /> Approved — Action queued for execution
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setApprovedSuggestions(s => { const n = new Set(s); n.add(i); return n; })}
                        className="flex-1 py-2 rounded-xl font-bold text-xs bg-white border border-current hover:opacity-80 transition-all">
                        ✅ Approve Action
                      </button>
                      <button className="py-2 px-3 rounded-xl font-bold text-xs bg-white/50 border border-current hover:opacity-80 transition-all">
                        ⏸ Later
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── REPORTS TAB ── */}
        {activeTab === 'reports' && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-gray-700 text-sm">Recent Anonymous Reports</h3>
                <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1 flex items-center gap-1">
                  🔒 Identity not visible to admin
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { time:'10 min ago', park:'Deer Park', issue:'Bad lighting in north zone — area completely dark after 6:30pm', type:'safety', emoji:'💡' },
                  { time:'32 min ago', park:'Nehru Park', issue:'Broken water fountain near gate 2, leaking for 3 days', type:'infra', emoji:'🚿' },
                  { time:'1 hr ago', park:'Sanjay Lake', issue:'Feels unsafe on south path after sunset, no lighting or security', type:'safety', emoji:'🔒' },
                  { time:'2 hrs ago', park:'Central Park', issue:'Need more benches near jogging track — nowhere to sit after run', type:'infra', emoji:'🪑' },
                  { time:'3 hrs ago', park:'Garden of Five Senses', issue:'Café restroom needs cleaning urgently', type:'infra', emoji:'🚿' },
                  { time:'5 hrs ago', park:'Lodhi Garden', issue:'Spotted a peacock near sector 3 — beautiful!', type:'general', emoji:'🦚' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-all">
                    <div className="text-xl mt-0.5 flex-shrink-0">{r.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-gray-800">{r.park}</span>
                        <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${r.type === 'safety' ? 'bg-red-100 text-red-600' : r.type === 'infra' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {r.type}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">{r.issue}</div>
                      <div className="text-gray-300 text-xs mt-1 flex items-center gap-1">
                        <Clock size={10} /> {r.time} · by <span className="font-medium text-gray-400 ml-1">Anonymous User</span>
                      </div>
                    </div>
                    {resolvedReports.has(i) ? (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1 flex-shrink-0">
                        <CheckCircle size={12} /> Resolved
                      </span>
                    ) : (
                      <button onClick={() => setResolvedReports(s => { const n = new Set(s); n.add(i); return n; })}
                        className="text-xs font-bold text-green-600 border border-green-300 rounded-lg px-3 py-1.5 hover:bg-green-50 transition-all flex-shrink-0">
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
