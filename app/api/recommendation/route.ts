import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const base = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${base}/harvest-recommendation`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ml unavailable');
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({
      recommendation: 'Wait',
      risk_score: 42,
      demand_index: 'Medium',
      weather: 'Partly cloudy, 28°C'
    });
  }
}
