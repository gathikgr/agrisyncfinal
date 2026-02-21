import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const base = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${base}/predict-price`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ml unavailable');
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({
      forecast: [
        { day: 'D1', price: 18 },
        { day: 'D2', price: 20 },
        { day: 'D3', price: 23 },
        { day: 'D4', price: 21 },
        { day: 'D5', price: 24 }
      ]
    });
  }
}
