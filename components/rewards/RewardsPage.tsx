'use client';
import { useStore } from '@/store/useStore';
import { challenges, leaderboard, plants } from '@/data/parks';
import { Trophy, Shield, Zap, Target, Award, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

/* ── Level progress bar ── */
function LevelBar({ pts, dark }: { pts: number; dark: boolean }) {
  const levels = [
    { name: 'Seedling 🌱',        min: 0,    max: 200,  color: '#86efac' },
    { name: 'Sapling 🌿',         min: 200,  max: 500,  color: '#4ade80' },
    { name: 'Tree 🌳',             min: 500,  max: 1000, color: '#22c55e' },
    { name: 'Elder Tree 🌲',       min: 1000, max: 2000, color: '#16a34a' },
    { name: 'Forest Guardian 🏆', min: 2000, max: 5000, color: '#f5a623' },
  ];
  const cur = levels.find(l => pts < l.max) || levels[levels.length - 1];
  const pct = Math.min(100, ((pts - cur.min) / (cur.max - cur.min)) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-bold text-white">{cur.name}</span>
        <span className="text-green-300/60">{Math.max(0, cur.max - pts)} pts to next</span>
      </div>
      <div className={`rounded-full h-3 ${dark ? 'bg-gray-700' : 'bg-green-900/60'}`}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cur.color}99, ${cur.color})` }} />
      </div>
    </div>
  );
}

/* ── Challenge card with dark mode ── */
function ChallengeCard({ c, dark }: { c: typeof challenges[0]; dark: boolean }) {
  const { addPoints } = useStore();
  const pct = Math.min(100, (c.progress / c.total) * 100);
  const done = c.progress >= c.total;
  const [claimed, setClaimed] = useState(false);

  const catStyles: Record<string, { light: string; dark: string; bar: string }> = {
    explore:   { light: 'bg-blue-50 border-blue-200',   dark: 'bg-blue-900/25 border-blue-700/40',   bar: '#3b82f6' },
    fitness:   { light: 'bg-orange-50 border-orange-200', dark: 'bg-orange-900/25 border-orange-700/40', bar: '#f97316' },
    nature:    { light: 'bg-green-50 border-green-200', dark: 'bg-green-900/25 border-green-700/40',  bar: '#22c55e' },
    community: { light: 'bg-purple-50 border-purple-200', dark: 'bg-purple-900/25 border-purple-700/40', bar: '#a855f7' },
    special:   { light: 'bg-amber-50 border-amber-200', dark: 'bg-amber-900/25 border-amber-700/40',  bar: '#f59e0b' },
  };
  const s = catStyles[c.category] || catStyles.nature;

  let cardCls = dark ? s.dark : s.light;
  if (done && !claimed) cardCls = dark ? 'bg-green-900/40 border-green-600/50 shadow-lg shadow-green-900/20' : 'bg-green-50 border-green-400 shadow-md shadow-green-100';
  if (claimed) cardCls = dark ? 'bg-gray-800/50 border-gray-700 opacity-50' : 'bg-gray-50 border-gray-200 opacity-50';

  return (
    <div className={`border rounded-2xl p-4 transition-all ${cardCls}`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border shadow-sm
          ${dark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
          {c.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className={`font-black text-sm ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{c.title}</h4>
            <span className={`text-xs font-black rounded-full px-2 py-0.5 ${dark ? 'bg-green-800/50 text-green-400' : 'bg-green-100 text-green-700'}`}>
              +{c.pts}
            </span>
          </div>
          <p className={`text-xs mb-2 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{c.desc}</p>
          <div className={`rounded-full h-1.5 mb-1 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.bar }} />
          </div>
          <div className="flex justify-between text-[10px]">
            <span className={dark ? 'text-gray-500' : 'text-gray-400'}>
              {typeof c.progress === 'number' && c.progress % 1 !== 0 ? c.progress.toFixed(1) : c.progress}/{c.total}
            </span>
            <span className={`font-bold capitalize ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{c.category}</span>
          </div>
        </div>
      </div>
      {done && !claimed && (
        <button onClick={() => { addPoints(c.pts); setClaimed(true); }}
          className="mt-3 w-full bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-black py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-900/20">
          🎉 Claim {c.pts} Points!
        </button>
      )}
      {claimed && <div className="mt-2 text-center text-xs text-green-500 font-bold">✅ Reward claimed!</div>}
    </div>
  );
}

/* ── Badge card with dark mode ── */
function BadgeCard({ emoji, label, earned, dark }: { emoji: string; label: string; earned: boolean; dark: boolean }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all
      ${earned
        ? dark ? 'bg-amber-900/30 border-amber-600/40' : 'bg-amber-50 border-amber-200'
        : dark ? 'bg-gray-800/50 border-gray-700/50 opacity-40' : 'bg-gray-50 border-gray-200 opacity-50'
      }`}>
      <div className="text-2xl mb-1 relative">
        {emoji}
        {!earned && <Lock size={11} className="absolute -top-1 -right-1 text-gray-400" />}
      </div>
      <div className={`text-[10px] text-center font-medium leading-tight ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    </div>
  );
}

/* ══════════ MAIN PAGE ══════════ */
export default function RewardsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const {
    alias, points, badges, isAnonymous, toggleAnonymous,
    visitedParks, scannedPlants, level,
    reward500Claimed, reward500FavoritePlantId, claim500Reward,
    darkMode,
  } = useStore();

  const [lbFilter, setLbFilter] = useState<'all' | 'weekly'>('all');
  const [pick, setPick]         = useState(reward500FavoritePlantId || 'pl1');
  const canClaim500 = points >= 500 && !reward500Claimed;

  // Dark mode aliases
  const bg        = darkMode ? 'bg-gray-950'   : 'bg-[#f0f7f2]';
  const card      = darkMode ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-100';
  const cardHover = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const text      = darkMode ? 'text-gray-100'  : 'text-gray-800';
  const muted     = darkMode ? 'text-gray-400'  : 'text-gray-500';
  const divider   = darkMode ? 'divide-gray-800' : 'divide-gray-50';
  const borderDim = darkMode ? 'border-gray-700' : 'border-gray-100';
  const inputCls  = darkMode
    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500'
    : 'bg-white border-gray-200 focus:border-amber-400';

  const allBadges = [
    { emoji: '🌱', label: 'Seedling',    earned: points >= 0 },
    { emoji: '🚶', label: 'First Walk',  earned: visitedParks.length >= 1 },
    { emoji: '🔍', label: 'Explorer',    earned: visitedParks.length >= 3 },
    { emoji: '🌿', label: 'Nature Fan',  earned: scannedPlants.length >= 3 },
    { emoji: '🛡️', label: 'Safety Hero', earned: points >= 300 },
    { emoji: '🌳', label: 'Tree Level',  earned: points >= 500 },
    { emoji: '🏆', label: 'Guardian',   earned: points >= 2000 },
    { emoji: '🌺', label: 'Botanist',   earned: scannedPlants.length >= 8 },
  ];

  const leaderboardData = leaderboard;

  return (
    <div className={`min-h-screen pt-[60px] transition-colors duration-200 ${bg}`}>

      {/* ── PROFILE HEADER ── */}
      <div
        className="px-6 py-10 transition-colors duration-200"
        style={{ background: darkMode
          ? 'linear-gradient(160deg,#030a06 0%,#0a1f12 100%)'
          : 'linear-gradient(160deg,#052e16 0%,#166534 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.25)' }}>
              🌿
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-white font-black text-2xl">{alias}</h2>
                {isAnonymous && (
                  <span className="text-xs bg-green-800/50 border border-green-700/40 text-green-400 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                    <Shield size={10} /> Anonymous 🔒
                  </span>
                )}
              </div>
              <div className="text-green-300/55 text-sm mb-4">
                {level} &nbsp;·&nbsp; {visitedParks.length} parks visited &nbsp;·&nbsp; {scannedPlants.length} plants scanned
              </div>
              <LevelBar pts={points} dark={darkMode} />
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-5xl font-black text-white">{points.toLocaleString()}</div>
              <div className="text-green-400 text-sm font-medium mt-0.5">Green Points</div>
            </div>
          </div>

          {/* Privacy toggle */}
          <div className={`rounded-2xl p-4 flex items-center justify-between ${darkMode ? 'bg-gray-800/60 border border-gray-700' : 'bg-green-900/40 border border-green-700/40'}`}>
            <div>
              <div className="flex items-center gap-2 font-bold text-green-200 text-sm">
                <Shield size={14} className="text-green-400" /> Privacy Control
              </div>
              <div className="text-green-400/50 text-xs mt-0.5">
                {isAnonymous ? 'Your identity is fully protected. Activity shown as alias only.' : 'Identity sharing enabled.'}
              </div>
            </div>
            <div onClick={toggleAnonymous}
              className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${isAnonymous ? 'bg-green-500' : 'bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── MILESTONE REWARD ── */}
        <div className={`border rounded-2xl p-5 shadow-sm transition-colors duration-200 ${darkMode ? 'bg-gray-900 border-amber-700/40' : 'bg-white border-amber-200'}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">🎁 Milestone Reward</div>
              <h3 className={`font-black text-lg ${text}`}>Reach 500 points → Get 1 free plant + seeds</h3>
              <p className={`text-sm mt-1 ${muted}`}>Demo redemption — your selection is saved on your device.</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black text-amber-500">{Math.min(points, 500)}/500</div>
              <div className={`text-[10px] ${muted}`}>points</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className={`rounded-full h-2.5 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-amber-100'}`}>
            <div className="h-full rounded-full transition-all duration-500 bg-amber-500"
              style={{ width: `${Math.min(100, (points / 500) * 100)}%` }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className={`text-xs font-bold block mb-1.5 ${muted}`}>Choose your favorite plant</label>
              <select
                value={pick}
                onChange={e => setPick(e.target.value)}
                disabled={reward500Claimed}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-60 transition-colors ${inputCls}`}
              >
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name} — {p.category}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => claim500Reward(pick)}
              disabled={!canClaim500}
              className={`w-full rounded-xl py-3 text-sm font-black transition-all active:scale-95
                ${canClaim500
                  ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-200/50'
                  : darkMode ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {reward500Claimed ? '✅ Redeemed!' : canClaim500 ? '🌱 Redeem Now' : '🔒 Locked'}
            </button>
          </div>

          {reward500Claimed && (
            <div className={`mt-3 rounded-xl p-3 flex items-center gap-2 text-sm ${darkMode ? 'bg-amber-900/30 border border-amber-700/40 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
              🎉 Redeemed: <span className="font-black">{plants.find(p => p.id === reward500FavoritePlantId)?.icon} {plants.find(p => p.id === reward500FavoritePlantId)?.name || 'Plant'}</span> + extra seeds dispatched!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: Badges + Challenges ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Badges */}
            <div>
              <h3 className={`font-black text-lg mb-3 flex items-center gap-2 ${text}`}>
                <Award size={18} className="text-amber-500" /> Badges
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {allBadges.map(b => <BadgeCard key={b.label} {...b} dark={darkMode} />)}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className={`font-black text-lg mb-3 flex items-center gap-2 ${text}`}>
                <Target size={18} className="text-green-500" /> Active Challenges
              </h3>
              <div className="space-y-3">
                {challenges.map(c => <ChallengeCard key={c.id} c={c} dark={darkMode} />)}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Leaderboard + How to earn + Stats ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Leaderboard */}
            <div>
              <h3 className={`font-black text-lg flex items-center gap-2 mb-3 ${text}`}>
                <Trophy size={18} className="text-amber-500" /> Leaderboard
              </h3>
              <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors duration-200 ${card}`}>
                {/* Tab toggle */}
                <div className={`flex border-b ${borderDim}`}>
                  {(['all', 'weekly'] as const).map(f => (
                    <button key={f} onClick={() => setLbFilter(f)}
                      className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all
                        ${lbFilter === f
                          ? darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-green-700'
                          : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                      {f === 'all' ? 'All Time' : 'This Week'}
                    </button>
                  ))}
                </div>

                {/* Privacy note */}
                <div className={`px-3 py-2 border-b ${borderDim}`}>
                  <div className={`text-[10px] rounded-lg p-1.5 flex items-center gap-1 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'}`}>
                    <Shield size={10} /> All entries shown by alias — no real identity visible
                  </div>
                </div>

                {/* Entries */}
                <div className={`divide-y ${divider}`}>
                  {leaderboardData.map((u) => (
                    <div key={u.rank}
                      className={`flex items-center gap-3 px-4 py-3 transition-all
                        ${u.alias === alias
                          ? darkMode ? 'bg-green-900/30 border-l-2 border-l-green-500' : 'bg-green-50 border-l-2 border-l-green-600'
                          : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                      <span className="text-lg w-6 text-center flex-shrink-0">{u.badge}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${text}`}>
                          {u.alias}
                          {u.alias === alias && <span className="text-xs text-green-500 font-normal ml-1">(you)</span>}
                        </div>
                        <div className={`text-[10px] ${muted}`}>{u.level} · {u.parksVisited} parks</div>
                      </div>
                      <span className="text-xs font-black text-green-500 flex-shrink-0">{u.pts.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How to earn */}
            <div className={`border rounded-2xl p-4 shadow-sm transition-colors duration-200 ${card}`}>
              <h4 className={`font-black text-sm mb-3 flex items-center gap-1.5 ${text}`}>
                <Zap size={14} className="text-amber-500" /> How to Earn Points
              </h4>
              <div className="space-y-0.5">
                {[
                  ['📍', 'Visit a park',         '10 pts'],
                  ['🔍', 'Scan a plant QR',       '20 pts'],
                  ['💬', 'Submit feedback',        '20 pts'],
                  ['🚨', 'Report an issue',        '25 pts'],
                  ['📢', 'Community post',         '30 pts'],
                  ['🌅', 'Early morning visit',    '30 pts'],
                  ['🎯', 'Complete challenge',     '90–250 pts'],
                  ['🗺️', 'Visit 3 parks/week',    '150 pts'],
                ].map(([icon, act, pts]) => (
                  <div key={act} className={`flex items-center justify-between py-1.5 border-b last:border-0 ${borderDim}`}>
                    <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {icon} {act}
                    </span>
                    <span className="text-xs font-black text-green-500">{pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: visitedParks.length, label: 'Parks Visited',    icon: '📍', light: 'bg-green-50 border-green-200 text-green-700',   dark: 'bg-green-900/30 border-green-700/40 text-green-400' },
                { val: scannedPlants.length, label: 'Plants Scanned',  icon: '🌿', light: 'bg-blue-50 border-blue-200 text-blue-700',       dark: 'bg-blue-900/30 border-blue-700/40 text-blue-400' },
                { val: Math.floor(points/10), label: 'Park Visits Est.', icon: '🚶', light: 'bg-amber-50 border-amber-200 text-amber-700',   dark: 'bg-amber-900/30 border-amber-700/40 text-amber-400' },
                { val: badges.length,        label: 'Badges Earned',   icon: '🏅', light: 'bg-purple-50 border-purple-200 text-purple-700', dark: 'bg-purple-900/30 border-purple-700/40 text-purple-400' },
              ].map(s => (
                <div key={s.label} className={`border rounded-xl p-3 text-center transition-colors ${darkMode ? s.dark : s.light}`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-black text-xl">{s.val}</div>
                  <div className="text-[10px] opacity-70 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}