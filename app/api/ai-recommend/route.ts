import { NextRequest, NextResponse } from 'next/server';
import { parks } from '@/data/parks';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '28.5800');
  const lng = parseFloat(searchParams.get('lng') || '77.2100');
  const preference = searchParams.get('preference') || 'balanced';

  // Score parks based on preference
  const scored = parks.map(p => {
    const dist = Math.sqrt((p.lat - lat) ** 2 + (p.lng - lng) ** 2) * 111; // km approx
    let score = 0;

    if (preference === 'safe') {
      score = p.safetyScore * 0.5 + (100 - p.crowdPct) * 0.3 + (100 - p.aqi) * 0.2;
    } else if (preference === 'nature') {
      score = p.plants.length * 5 + p.comfortIndex * 0.4 + (100 - p.aqi) * 0.4;
    } else if (preference === 'crowd') {
      score = (100 - p.crowdPct) * 0.6 + p.comfortIndex * 0.4;
    } else {
      // balanced
      score = p.safetyScore * 0.3 + (100 - p.crowdPct) * 0.25 + p.comfortIndex * 0.25 + (100 - p.aqi) * 0.2;
    }

    // Distance penalty
    score -= dist * 2;

    return { ...p, score: Math.round(score), distanceKm: Math.round(dist * 10) / 10 };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const best = sorted[0];

  // Best time calculation
  const hour = new Date().getHours();
  const bestTime = best.crowdHistory.reduce((min, cur) => cur.value < min.value ? cur : min, best.crowdHistory[0]);

  const recommendation = {
    bestPark: best,
    reason: preference === 'safe'
      ? `Highest safety score (${best.safetyScore}/100) with ${best.crowdPct}% crowd — well-lit and secure.`
      : preference === 'nature'
      ? `${best.plants.length} plant species to discover! AQI of ${best.aqi} — great air quality for nature walks.`
      : preference === 'crowd'
      ? `Only ${best.crowdPct}% crowded right now — perfect for a peaceful visit.`
      : `Best overall score: safety ${best.safetyScore}, AQI ${best.aqi}, comfort ${best.comfortIndex}.`,
    bestTimeToVisit: bestTime.time,
    alternatives: sorted.slice(1, 3).map(p => ({ id: p.id, name: p.name, score: p.score, crowdPct: p.crowdPct })),
    avoidParks: sorted.filter(p => p.crowdPct > 75 || p.aqi > 90).map(p => ({ id: p.id, name: p.name, reason: p.crowdPct > 75 ? 'High crowd' : 'Poor air quality' })),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(recommendation);
}
