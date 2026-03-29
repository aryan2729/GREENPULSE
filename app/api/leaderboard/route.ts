import { NextResponse } from 'next/server';
import { leaderboard } from '@/data/parks';

export async function GET() {
  return NextResponse.json({ leaderboard, updatedAt: new Date().toISOString() });
}
