'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/localStore';
import { saveCommitmentRecord } from '@/lib/db';

const supply = [
  { crop: 'Tomato', location: 'Nashik', windowStart: 3, windowEnd: 5, qty: 4200 },
  { crop: 'Chilli', location: 'Guntur', windowStart: 5, windowEnd: 7, qty: 2500 },
  { crop: 'Cabbage', location: 'Ooty', windowStart: 2, windowEnd: 4, qty: 1900 },
];

function parseWindow(text: string): [number, number] | null {
  const m = text.match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [windowFilter, setWindowFilter] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const session = storage.getSession();
    if (!session || session.role !== 'buyer') router.push('/auth');
  }, [router]);

  const filtered = useMemo(() => {
    const parsed = parseWindow(windowFilter);
    return supply.filter((s) => {
      const cropOk = s.crop.toLowerCase().includes(crop.toLowerCase());
      const locationOk = s.location.toLowerCase().includes(location.toLowerCase());
      const windowOk = !parsed || (s.windowStart <= parsed[1] && s.windowEnd >= parsed[0]);
      return cropOk && locationOk && windowOk;
    });
  }, [crop, location, windowFilter]);

  async function commit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const session = storage.getSession();
    if (!session || session.role !== 'buyer') {
      router.push('/auth');
      return;
    }

    const payload = {
      buyer: String(formData.get('buyer')),
      crop: String(formData.get('crop')),
      quantity: String(formData.get('quantity')),
      harvest_window: String(formData.get('harvestWindow') || ''),
    };

    const existing = JSON.parse(localStorage.getItem('agrisync_commitments') || '[]');
    existing.push(payload);
    localStorage.setItem('agrisync_commitments', JSON.stringify(existing));

    await saveCommitmentRecord({
      buyer_email: session.email,
      crop: payload.crop,
      quantity_kg: Number(payload.quantity),
      harvest_window: payload.harvest_window,
    });

    setMsg('Commitment saved successfully.');
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="card grid gap-3 md:grid-cols-3">
        <input className="rounded-xl border p-3" placeholder="Filter crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Filter location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Harvest window (e.g. 2-5 days)" value={windowFilter} onChange={(e) => setWindowFilter(e.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {filtered.map((item) => (
          <div className="card" key={`${item.crop}-${item.location}`}>
            <h3 className="font-semibold">{item.crop}</h3>
            <p>{item.location}</p><p>Harvest: {item.windowStart}-{item.windowEnd} days</p><p>Predicted Qty: {item.qty} kg</p>
          </div>
        ))}
      </div>
      <form className="card grid gap-3 md:grid-cols-4" onSubmit={commit}>
        <input name="buyer" className="rounded-xl border p-3" placeholder="Buyer name" required />
        <input name="crop" className="rounded-xl border p-3" placeholder="Crop" required />
        <input name="quantity" type="number" className="rounded-xl border p-3" placeholder="Quantity (kg)" required />
        <input name="harvestWindow" className="rounded-xl border p-3" placeholder="Window (e.g. 3-6 days)" />
        <button className="rounded-xl bg-primary p-3 font-semibold text-white md:col-span-4">Pre-Harvest Commit</button>
      </form>
      {msg ? <p className="text-green-700">{msg}</p> : null}
    </main>
  );
}
