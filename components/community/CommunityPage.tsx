'use client';
import { useStore } from '@/store/useStore';
import { communityPosts, parks } from '@/data/parks';
import { Shield, Heart, MessageCircle, Plus, Camera, Lightbulb, AlertTriangle, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const POST_TYPES = [
  { id: 'all',    label: 'All',     emoji: '📋' },
  { id: 'tip',    label: 'Tips',    emoji: '💡' },
  { id: 'photo',  label: 'Photos',  emoji: '📸' },
  { id: 'event',  label: 'Events',  emoji: '📅' },
  { id: 'report', label: 'Reports', emoji: '🚨' },
];

const TYPE_COLORS: Record<string, string> = {
  tip:    'bg-amber-50 border-amber-200 text-amber-700',
  photo:  'bg-blue-50 border-blue-200 text-blue-700',
  event:  'bg-purple-50 border-purple-200 text-purple-700',
  report: 'bg-red-50 border-red-200 text-red-600',
};

const TYPE_COLORS_DARK: Record<string, string> = {
  tip:    'bg-amber-900/30 border-amber-700/40 text-amber-300',
  photo:  'bg-blue-900/30 border-blue-700/40 text-blue-300',
  event:  'bg-purple-900/30 border-purple-700/40 text-purple-300',
  report: 'bg-red-900/30 border-red-700/40 text-red-300',
};

export default function CommunityPage() {
  const { alias, isAnonymous, addPoints, darkMode } = useStore();
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState(communityPosts);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ content: '', type: 'tip', park: 'p1', shareId: false });
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  const handleLike = (id: string) => {
    if (liked.has(id)) return;
    const n = new Set(liked); n.add(id); setLiked(n);
    setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handlePost = () => {
    if (!form.content.trim()) return;
    const park = parks.find(p => p.id === form.park);
    setPosts(ps => [{
      id: `post${Date.now()}`,
      alias: form.shareId ? alias : 'Anonymous User',
      park: park?.name || '',
      type: form.type,
      content: form.content,
      likes: 0,
      time: 'Just now',
      verified: form.type === 'report',
    }, ...ps]);
    setForm({ content: '', type: 'tip', park: 'p1', shareId: false });
    setShowCompose(false);
    addPoints(30);
  };

  const bg      = darkMode ? 'bg-gray-950' : 'bg-[#f0f7f2]';
  const cardBg  = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text    = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted   = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputCl = darkMode ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-green-500' : 'bg-white border-gray-200 focus:border-green-400';
  const chipIdle = darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:border-green-400';

  return (
    <div className={`min-h-screen ${bg} pt-[60px]`}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,#052e16,#166534)' }} className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-3xl text-white mb-1">Community Board</h1>
          <p className="text-green-300/60 text-sm">Share tips, report issues, join events — always anonymous by default.</p>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setShowCompose(!showCompose)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-green-900/30">
              <Plus size={14} /> Post Something
            </button>
            <span className="text-green-400/50 text-xs flex items-center gap-1"><Shield size={11} /> Posts are anonymous by default</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Compose */}
        {showCompose && (
          <div className={`border rounded-2xl p-5 mb-5 shadow-sm ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={13} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Your identity is protected by default.</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`text-xs font-bold block mb-1 ${muted}`}>Post Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${inputCl}`}>
                  <option value="tip">💡 Park Tip</option>
                  <option value="photo">📸 Nature Photo</option>
                  <option value="event">📅 Event</option>
                  <option value="report">🚨 Issue Report</option>
                </select>
              </div>
              <div>
                <label className={`text-xs font-bold block mb-1 ${muted}`}>Park</label>
                <select value={form.park} onChange={e => setForm(f => ({ ...f, park: e.target.value }))}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${inputCl}`}>
                  {parks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Share a tip, spotted wildlife, event, or report an issue…"
              className={`w-full border rounded-xl p-3 text-sm resize-none focus:outline-none h-24 mb-3 ${inputCl}`} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                <input type="checkbox" checked={form.shareId} onChange={e => setForm(f => ({ ...f, shareId: e.target.checked }))} />
                <span>Post as <span className="font-bold text-green-600">{alias}</span> (optional)</span>
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowCompose(false)} className={`text-xs px-4 py-2 rounded-xl ${muted}`}>Cancel</button>
                <button onClick={handlePost} className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all">
                  Post (+30 pts)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {POST_TYPES.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 border transition-all
                ${filter === t.id ? 'bg-green-600 text-white border-green-600 shadow-sm' : chipIdle}`}>
              {t.emoji} {t.label}
            </button>
          ))}
          <span className={`ml-auto text-xs self-center flex-shrink-0 ${muted}`}>{filtered.length}</span>
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {filtered.map(post => {
            const tc = darkMode ? (TYPE_COLORS_DARK[post.type] || `bg-gray-800 border-gray-700 text-gray-300`) : (TYPE_COLORS[post.type] || 'bg-gray-50 border-gray-200 text-gray-600');
            const initials = post.alias === 'Anonymous User' ? '🔒' : post.alias[0].toUpperCase();
            const avatarBg = post.alias === 'Anonymous User'
              ? (darkMode ? 'bg-gray-700' : 'bg-gray-100')
              : ['bg-green-100 text-green-700','bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-amber-100 text-amber-700'][post.alias.charCodeAt(0) % 4];

            return (
              <div key={post.id} className={`border rounded-2xl p-5 transition-all hover:shadow-sm ${cardBg}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarBg}`}>
                      {initials}
                    </div>
                    <div>
                      <div className={`text-sm font-bold flex items-center gap-1.5 ${text}`}>
                        {post.alias}
                        {post.alias === 'Anonymous User' && <Shield size={10} className="text-green-500" />}
                      </div>
                      <div className={`text-xs ${muted}`}>{post.park} · {post.time}</div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold border rounded-full px-2 py-0.5 ${tc}`}>
                    {post.type === 'tip' ? '💡' : post.type === 'photo' ? '📸' : post.type === 'event' ? '📅' : '🚨'} {post.type}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed mb-3 ${text}`}>{post.content}</p>

                {post.verified && (
                  <div className="text-xs text-green-600 font-medium flex items-center gap-1 mb-2">
                    ✅ Admin acknowledged this report
                  </div>
                )}

                <div className={`flex items-center gap-4 pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
                  <button onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-all ${liked.has(post.id) ? 'text-red-500' : darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
                    <Heart size={14} fill={liked.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="text-xs font-medium">{post.likes}</span>
                  </button>
                  <button className={`flex items-center gap-1.5 text-sm transition-all ${darkMode ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-green-500'}`}>
                    <MessageCircle size={14} />
                    <span className="text-xs font-medium">Reply</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
