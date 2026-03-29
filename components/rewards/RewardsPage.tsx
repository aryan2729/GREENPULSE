'use client';
import { useStore } from '@/store/useStore';
import { challenges, leaderboard, parks } from '@/data/parks';
import { Trophy, Shield, Star, Zap, Target, Award, ChevronRight, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { plants } from '@/data/parks';

function LevelBar({ pts }: { pts: number }) {
  const levels = [
    { name: 'Seedling 🌱', min: 0, max: 200, color: '#86efac' },
    { name: 'Sapling 🌿', min: 200, max: 500, color: '#4ade80' },
    { name: 'Tree 🌳', min: 500, max: 1000, color: '#3a9c67' },
    { name: 'Elder Tree 🌲', min: 1000, max: 2000, color: '#166534' },
    { name: 'Forest Guardian 🏆', min: 2000, max: 5000, color: '#f5a623' },
  ];
  const cur = levels.find(l => pts < l.max) || levels[levels.length - 1];
  const pct = Math.min(100, ((pts - cur.min) / (cur.max - cur.min)) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold text-white">{cur.name}</span>
        <span className="text-green-300/60">{cur.max - pts} pts to next</span>
      </div>
      <div className="bg-green-900/60 rounded-full h-2.5">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cur.color }} />
      </div>
    </div>
  );
}

function ChallengeCard({ c }: { c: typeof challenges[0] }) {
  const { addPoints } = useStore();
  const pct = Math.min(100, (c.progress / c.total) * 100);
  const done = c.progress >= c.total;
  const [claimed, setClaimed] = useState(false);
  const catColor: Record<string, string> = {
    explore: 'bg-blue-50 border-blue-200',
    fitness: 'bg-orange-50 border-orange-200',
    nature: 'bg-green-50 border-green-200',
    community: 'bg-purple-50 border-purple-200',
    special: 'bg-amber-50 border-amber-200',
  };

  return (
    <div className={`border rounded-2xl p-4 transition-all ${claimed ? 'opacity-50' : done ? 'border-green-400 bg-green-50 shadow-md shadow-green-100' : catColor[c.category] || 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
          {c.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="font-black text-gray-800 text-sm">{c.title}</h4>
            <span className="text-xs font-black text-green-600 bg-green-100 rounded-full px-2 py-0.5">+{c.pts}</span>
          </div>
          <p className="text-gray-400 text-xs mb-2">{c.desc}</p>
          <div className="bg-gray-200 rounded-full h-1.5 mb-1">
            <div className="h-full rounded-full transition-all bg-green-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>{typeof c.progress === 'number' && c.progress % 1 !== 0 ? c.progress.toFixed(1) : c.progress}/{c.total}</span>
            <span className="font-bold capitalize text-gray-400">{c.category}</span>
          </div>
        </div>
      </div>
      {done && !claimed && (
        <button onClick={() => { addPoints(c.pts); setClaimed(true); }}
          className="mt-3 w-full bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-black py-2 rounded-xl text-sm transition-all">
          🎉 Claim {c.pts} Points!
        </button>
      )}
      {claimed && (
        <div className="mt-2 text-center text-xs text-green-600 font-bold">✅ Reward claimed!</div>
      )}
    </div>
  );
}

function BadgeCard({ emoji, label, earned }: { emoji: string; label: string; earned: boolean }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all ${earned ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
      <div className="text-2xl mb-1 relative">
        {emoji}
        {!earned && <Lock size={12} className="absolute -top-1 -right-1 text-gray-400" />}
      </div>
      <div className="text-[10px] text-gray-500 text-center font-medium leading-tight">{label}</div>
    </div>
  );
}

export default function RewardsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { alias, points, badges, isAnonymous, toggleAnonymous, visitedParks, scannedPlants, level, reward500Claimed, reward500FavoritePlantId, claim500Reward } = useStore();
  const [lbFilter, setLbFilter] = useState<'all' | 'weekly'>('all');
  const [pick, setPick] = useState(reward500FavoritePlantId || 'pl1');
  const canClaim500 = points >= 500 && !reward500Claimed;

  const allBadges = [
    { emoji: '🌱', label: 'Seedling', earned: points >= 0 },
    { emoji: '🚶', label: 'First Walk', earned: visitedParks.length >= 1 },
    { emoji: '🔍', label: 'Explorer', earned: visitedParks.length >= 3 },
    { emoji: '🌿', label: 'Nature Fan', earned: scannedPlants.length >= 3 },
    { emoji: '🛡️', label: 'Safety Hero', earned: points >= 300 },
    { emoji: '🌳', label: 'Tree Level', earned: points >= 500 },
    { emoji: '🏆', label: 'Guardian', earned: points >= 2000 },
    { emoji: '🌺', label: 'Botanist', earned: scannedPlants.length >= 8 },
  ];

  const myRank = leaderboard.findIndex(u => u.alias === alias);

  return (
    <div className="pt-[62px] min-h-screen" style={{ background: 'linear-gradient(180deg, #f5fcf8 0%, #ffffff 100%)' }}>
      {/* Profile header */}
      <div className="px-6 py-10" style={{ background: 'linear-gradient(160deg, #061810 0%, #1a3d28 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ background: 'rgba(82,191,132,0.15)', border: '2px solid rgba(82,191,132,0.3)' }}>
              🌿
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-white font-black text-2xl">{alias}</h2>
                {isAnonymous && (
                  <span className="text-xs bg-green-800/50 border border-green-700/40 text-green-400 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Shield size={10} /> Anonymous 🔒
                  </span>
                )}
              </div>
              <div className="text-green-300/60 text-sm mb-4">
                {level} · {visitedParks.length} parks visited · {scannedPlants.length} plants scanned
              </div>
              <LevelBar pts={points} />
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-4xl font-black text-white">{points.toLocaleString()}</div>
              <div className="text-green-400 text-xs">Green Points</div>
              {myRank >= 0 && <div className="text-green-500/60 text-xs mt-1">Rank #{myRank + 1}</div>}
            </div>
          </div>

          {/* Privacy toggle */}
          <div className="bg-green-900/50 border border-green-700/40 rounded-2xl p-4 flex items-center justify-between">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 500 points reward */}
        <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-amber-600">Milestone Reward</div>
              <div className="font-black text-gray-800 text-lg mt-1">Reach 500 points → Get 1 free favorite plant + extra seeds</div>
              <div className="text-gray-400 text-sm mt-1">This is demo redemption (frontend-only). Your selection is saved on device.</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black text-amber-600">{Math.min(points, 500)}/500</div>
              <div className="text-[10px] text-gray-400">points</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 block mb-1">Choose your favorite plant</label>
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                disabled={reward500Claimed}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white disabled:opacity-60"
              >
                {plants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => claim500Reward(pick)}
              disabled={!canClaim500}
              className={`w-full rounded-xl py-2.5 text-sm font-black transition-all
                ${canClaim500 ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {reward500Claimed ? '✅ Redeemed' : canClaim500 ? 'Redeem Reward' : 'Locked'}
            </button>
          </div>

          {reward500Claimed && (
            <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Reward redeemed: <span className="font-black">{plants.find(p => p.id === reward500FavoritePlantId)?.name || 'Plant'}</span> + extra seeds.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Challenges */}
          <div className="lg:col-span-3 space-y-5">
            {/* Badges */}
            <div>
              <h3 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
                <Award size={18} className="text-amber-500" /> Badges
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {allBadges.map(b => <BadgeCard key={b.label} {...b} />)}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
                <Target size={18} className="text-green-600" /> Active Challenges
              </h3>
              <div className="space-y-3">
                {challenges.map(c => <ChallengeCard key={c.id} c={c} />)}
              </div>
            </div>
          </div>

          {/* RIGHT: Leaderboard + earn guide */}
          <div className="lg:col-span-2 space-y-5">
            {/* Leaderboard */}
            <div>
              <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 mb-3">
                <Trophy size={18} className="text-amber-500" /> Leaderboard
              </h3>
              <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex border-b border-green-50">
                  {(['all','weekly'] as const).map(f => (
                    <button key={f} onClick={() => setLbFilter(f)}
                      className={`flex-1 py-2 text-xs font-bold capitalize transition-all
                        ${lbFilter === f ? 'bg-green-50 text-green-700' : 'text-gray-400'}`}>
                      {f === 'all' ? 'All Time' : 'This Week'}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-b border-green-50">
                  <div className="text-[10px] text-green-600 bg-green-50 rounded-lg p-1.5 flex items-center gap-1">
                    <Shield size={10} /> All entries shown by alias — no real identity visible
                  </div>
                </div>

                <div className="divide-y divide-gray-50">
                  {leaderboard.map((u, i) => (
                    <div key={u.rank}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-all
                        ${u.alias === alias ? 'bg-green-50 border-l-2 border-l-green-500' : 'hover:bg-gray-50'}`}>
                      <span className="text-lg w-6 text-center flex-shrink-0">{u.badge}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate">
                          {u.alias}
                          {u.alias === alias && <span className="text-xs text-green-600 font-normal ml-1">(you)</span>}
                        </div>
                        <div className="text-[10px] text-gray-400">{u.level} · {u.parksVisited} parks</div>
                      </div>
                      <span className="text-xs font-black text-green-600 flex-shrink-0">{u.pts.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How to earn */}
            <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm">
              <h4 className="font-black text-gray-700 text-sm mb-3 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" /> How to Earn Points
              </h4>
              <div className="space-y-2">
                {[
                  ['Visit a park', '10 pts', '📍'],
                  ['Scan a plant QR', '20 pts', '🔍'],
                  ['Submit feedback', '20 pts', '💬'],
                  ['Report an issue', '25 pts', '🚨'],
                  ['Community post', '30 pts', '📢'],
                  ['Complete challenge', '90–250 pts', '🎯'],
                  ['Early morning visit', '30 pts', '🌅'],
                  ['Visit 3 parks/week', '150 pts', '🗺️'],
                ].map(([act, pts, icon]) => (
                  <div key={act as string} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                    <span className="text-xs text-gray-600 flex items-center gap-1.5">{icon} {act}</span>
                    <span className="text-xs font-black text-green-600">{pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: visitedParks.length, label: 'Parks Visited', icon: '📍', color: 'bg-green-50 border-green-200 text-green-700' },
                { val: scannedPlants.length, label: 'Plants Scanned', icon: '🌿', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { val: Math.floor(points / 10), label: 'Park Visits Est.', icon: '🚶', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { val: badges.length, label: 'Badges Earned', icon: '🏅', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              ].map(s => (
                <div key={s.label} className={`border rounded-xl p-3 text-center ${s.color}`}>
                  <div className="text-2xl">{s.icon}</div>
                  <div className="font-black text-xl">{s.val}</div>
                  <div className="text-[10px] opacity-70 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
