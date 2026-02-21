'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriceChart } from '@/components/PriceChart';
import { storage } from '@/lib/localStore';

interface DashboardData {
  forecast: Array<{ day: string; price: number }>;
  recommendation: string;
  risk_score: number;
  demand_index: string;
  weather: string;
}

const storageFacilities = [
  { name: 'GreenCold Hub', freeTons: 120, cost: 2.4, location: 'Nashik' },
  { name: 'FreshVault', freeTons: 75, cost: 2.0, location: 'Pune' },
];

const transportFleet = [
  { provider: 'CoolMove Logistics', trucks: 8, radiusKm: 30 },
  { provider: 'AgriTransit', trucks: 5, radiusKm: 45 },
];

export default function FarmerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const session = storage.getSession();
    if (!session || session.role !== 'farmer') {
      router.push('/auth');
      return;
    }

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
  }, [router]);

  const bestStorage = useMemo(
    () => [...storageFacilities].sort((a, b) => a.cost - b.cost)[0],
    []
  );

  const bestTransport = useMemo(
    () => [...transportFleet].sort((a, b) => b.trucks - a.trucks)[0],
    []
  );

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

      <div className="card">
        <h4 className="font-semibold">Nearby Storage</h4>
        <p>{bestStorage.name} ({bestStorage.location})</p>
        <p>{bestStorage.freeTons} tons free • ₹{bestStorage.cost}/kg/day</p>
      </div>
      <div className="card">
        <h4 className="font-semibold">Transport Availability</h4>
        <p>{bestTransport.provider}</p>
        <p>{bestTransport.trucks} reefer trucks in {bestTransport.radiusKm} km radius</p>
      </div>
      <div className="card"><h4 className="font-semibold">Estimated Profit</h4><p className="text-2xl font-bold text-emerald-600">₹{profit.toLocaleString()}</p></div>
    </main>
  );
}
