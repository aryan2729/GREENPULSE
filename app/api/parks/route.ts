import { NextRequest, NextResponse } from 'next/server';
import { parks } from '@/data/parks';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const zone = searchParams.get('zone');

  let result = [...parks];

  if (filter === 'low') result = result.filter(p => p.crowd === 'low');
  if (filter === 'safe') result = result.filter(p => p.womenSafe);
  if (filter === 'child') result = result.filter(p => p.childFriendly);
  if (filter === 'accessible') result = result.filter(p => p.accessible);
  if (zone) result = result.filter(p => p.zone === zone);

  // Simulate slight random variation in crowd/AQI for "live" feel
  const live = result.map(p => ({
    ...p,
    crowdPct: Math.max(5, Math.min(99, p.crowdPct + Math.floor(Math.random() * 6) - 3)),
    aqi: Math.max(30, p.aqi + Math.floor(Math.random() * 8) - 4),
  }));

  return NextResponse.json({ parks: live, total: live.length, timestamp: new Date().toISOString() });
}
