'use client';

import { useEffect, useState } from 'react';
import { PriceChart } from '@/components/PriceChart';
import { storage } from '@/lib/localStore';

interface DashboardData {
  forecast: Array<{ day: string; price: number }>;
  recommendation: string;
  risk_score: number;
  demand_index: string;
  weather: string;
}

export default function FarmerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const cache = storage.getCache<DashboardData>();
      try {
        const [predictions, recommendation] = await Promise.all([
          fetch('/api/predictions').then((r) => r.json()),
          fetch('/api/recommendation').then((r) => r.json()),
        ]);
        const merged = { ...predictions, ...recommendation };
        setData(merged);
        storage.setCache(merged);
      } catch {
        if (cache) setData(cache);
      }
    }
    load();
  }, []);

  if (!data) return <main className="p-8">Loading dashboard...</main>;

  const profit = data.forecast[data.forecast.length - 1].price * 1000;

  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-6 md:grid-cols-3">
      <div className="md:col-span-2"><PriceChart data={data.forecast} /></div>
      <div className="card space-y-3">
        <h3 className="text-lg font-semibold">AI Harvest Recommendation</h3>
        <p className="text-2xl font-bold text-primary">{data.recommendation}</p>
        <p>Risk Score: <strong>{data.risk_score}/100</strong></p>
        <p>Demand: <strong>{data.demand_index}</strong></p>
        <p>Weather: <strong>{data.weather}</strong></p>
      </div>

      <div className="card"><h4 className="font-semibold">Nearby Storage</h4><p>GreenCold Hub - 120 tons free - ₹2.4/kg/day</p></div>
      <div className="card"><h4 className="font-semibold">Transport Availability</h4><p>8 reefer trucks available in 30km radius.</p></div>
      <div className="card"><h4 className="font-semibold">Estimated Profit</h4><p className="text-2xl font-bold text-emerald-600">₹{profit.toLocaleString()}</p></div>
    </main>
  );
}
