import { NextRequest, NextResponse } from 'next/server';

const feedbacks: any[] = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { parkId, rating, comment, shareIdentity, alias, category } = body;

  const fb = {
    id: `fb${Date.now()}`,
    parkId,
    rating,
    comment,
    alias: shareIdentity ? alias : 'Anonymous User',
    category: category || 'general',
    time: new Date().toISOString(),
  };

  feedbacks.push(fb);

  return NextResponse.json({ success: true, feedback: fb, pointsEarned: 20 }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ feedbacks, total: feedbacks.length });
}
