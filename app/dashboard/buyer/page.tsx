'use client';

import { FormEvent, useMemo, useState } from 'react';

const supply = [
  { crop: 'Tomato', location: 'Nashik', window: '3-5 days', qty: 4200 },
  { crop: 'Chilli', location: 'Guntur', window: '5-7 days', qty: 2500 },
  { crop: 'Cabbage', location: 'Ooty', window: '2-4 days', qty: 1900 },
];

export default function BuyerDashboard() {
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [msg, setMsg] = useState('');

  const filtered = useMemo(
    () => supply.filter((s) => s.crop.toLowerCase().includes(crop.toLowerCase()) && s.location.toLowerCase().includes(location.toLowerCase())),
    [crop, location]
  );

  function commit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const existing = JSON.parse(localStorage.getItem('agrisync_commitments') || '[]');
    existing.push(Object.fromEntries(formData.entries()));
    localStorage.setItem('agrisync_commitments', JSON.stringify(existing));
    setMsg('Commitment saved successfully.');
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="card grid gap-3 md:grid-cols-3">
        <input className="rounded-xl border p-3" placeholder="Filter crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Filter location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Harvest window (e.g. 2-5 days)" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {filtered.map((item) => (
          <div className="card" key={`${item.crop}-${item.location}`}>
            <h3 className="font-semibold">{item.crop}</h3>
            <p>{item.location}</p><p>Harvest: {item.window}</p><p>Predicted Qty: {item.qty} kg</p>
          </div>
        ))}
      </div>
      <form className="card grid gap-3 md:grid-cols-4" onSubmit={commit}>
        <input name="buyer" className="rounded-xl border p-3" placeholder="Buyer name" required />
        <input name="crop" className="rounded-xl border p-3" placeholder="Crop" required />
        <input name="quantity" type="number" className="rounded-xl border p-3" placeholder="Quantity (kg)" required />
        <button className="rounded-xl bg-primary p-3 font-semibold text-white">Pre-Harvest Commit</button>
      </form>
      {msg ? <p className="text-green-700">{msg}</p> : null}
    </main>
  );
}
