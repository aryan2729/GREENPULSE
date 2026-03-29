import { NextRequest, NextResponse } from 'next/server';

// In-memory store simulating a database
const reports: any[] = [
  { id:'r1', parkId:'p3', parkName:'Deer Park', type:'safety', issue:'Bad lighting in north zone', alias:'Anonymous User', time: new Date(Date.now()-600000).toISOString(), status:'pending', location:'North Zone' },
  { id:'r2', parkId:'p2', parkName:'Nehru Park', type:'infra', issue:'Broken water fountain near gate 2', alias:'Anonymous User', time: new Date(Date.now()-1800000).toISOString(), status:'in-progress', location:'Gate 2' },
  { id:'r3', parkId:'p4', parkName:'Sanjay Lake', type:'safety', issue:'Feels unsafe after 6pm on south path', alias:'Anonymous User', time: new Date(Date.now()-3600000).toISOString(), status:'pending', location:'South Path' },
  { id:'r4', parkId:'p6', parkName:'Central Park', type:'infra', issue:'Needs more benches near jogging track', alias:'Anonymous User', time: new Date(Date.now()-7200000).toISOString(), status:'resolved', location:'Jogging Track' },
];

export async function GET() {
  return NextResponse.json({ reports, total: reports.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { parkId, parkName, type, issue, shareIdentity, alias } = body;

  const newReport = {
    id: `r${Date.now()}`,
    parkId,
    parkName,
    type: type || 'general',
    issue,
    alias: shareIdentity ? alias : 'Anonymous User',
    time: new Date().toISOString(),
    status: 'pending',
    location: body.location || 'General Area',
  };

  reports.unshift(newReport);

  return NextResponse.json({ success: true, report: newReport, pointsEarned: 25 }, { status: 201 });
}
