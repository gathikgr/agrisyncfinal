'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/localStore';
import { BuyerProfile, FarmerProfile } from '@/lib/types';

const cropSuggestions = {
  loamy: 'Tomato',
  clay: 'Cabbage',
  sandy: 'Chilli',
};

export default function ProfileSetup() {
  const session = typeof window !== 'undefined' ? storage.getSession() : null;
  const router = useRouter();
  const [name, setName] = useState('');
  const [soilType, setSoilType] = useState('loamy');
  const [cropPlanted, setCropPlanted] = useState(true);

  const recommendation = useMemo(() => cropSuggestions[soilType as keyof typeof cropSuggestions], [soilType]);

  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const common = {
      id: crypto.randomUUID(),
      name,
      role: session.role,
      language: session.language,
    } as const;

    if (session.role === 'farmer') {
      const profile: FarmerProfile = {
        ...common,
        role: 'farmer',
        kisaanId: String(formData.get('kisaanId')),
        landSize: Number(formData.get('landSize')),
        soilType,
        location: String(formData.get('location')),
        cropPlanted,
        cropName: cropPlanted ? String(formData.get('cropName')) : recommendation,
        sowingDate: cropPlanted ? String(formData.get('sowingDate')) : undefined,
      };
      storage.setProfile(profile);
      router.push('/dashboard/farmer');
      return;
    }

    const profile: BuyerProfile = {
      ...common,
      role: 'buyer',
      fssaiNumber: String(formData.get('fssaiNumber')),
      preferredCrops: String(formData.get('preferredCrops')),
      demandVolume: Number(formData.get('demandVolume')),
    };
    storage.setProfile(profile);
    router.push('/dashboard/buyer');
  }

  if (!session) return <main className="p-10">Session missing. Start from landing page.</main>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <form className="card grid gap-4" onSubmit={save}>
        <h2 className="text-2xl font-bold">Profile Setup ({session.role})</h2>
        <input className="rounded-xl border p-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />

        {session.role === 'farmer' ? (
          <>
            <input className="rounded-xl border p-3" name="kisaanId" placeholder="Kisaan Pehchan Patra" required />
            <input className="rounded-xl border p-3" type="number" name="landSize" placeholder="Land Size (acres)" required />
            <select className="rounded-xl border p-3" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
              <option value="loamy">Loamy</option><option value="clay">Clay</option><option value="sandy">Sandy</option>
            </select>
            <input className="rounded-xl border p-3" name="location" placeholder="Location" required />
            <label className="flex items-center gap-2"><input type="checkbox" checked={cropPlanted} onChange={(e) => setCropPlanted(e.target.checked)} /> Crop already planted</label>
            {cropPlanted ? (
              <>
                <input className="rounded-xl border p-3" name="cropName" placeholder="Crop name" required />
                <input className="rounded-xl border p-3" type="date" name="sowingDate" required />
              </>
            ) : (
              <p className="rounded-xl bg-green-50 p-3 text-green-700">Recommended crop for {soilType} soil: {recommendation}</p>
            )}
          </>
        ) : (
          <>
            <input className="rounded-xl border p-3" name="fssaiNumber" placeholder="FSSAI Number" required />
            <input className="rounded-xl border p-3" name="preferredCrops" placeholder="Preferred Crops" required />
            <input className="rounded-xl border p-3" type="number" name="demandVolume" placeholder="Demand Volume (kg)" required />
          </>
        )}

        <button className="rounded-xl bg-primary p-3 font-semibold text-white">Save and Continue</button>
      </form>
    </main>
  );
}
