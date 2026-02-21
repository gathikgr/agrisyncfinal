export type UserRole = 'farmer' | 'buyer';

export interface BaseProfile {
  id: string;
  name: string;
  role: UserRole;
  language: 'en' | 'hi' | 'te';
}

export interface FarmerProfile extends BaseProfile {
  role: 'farmer';
  kisaanId: string;
  landSize: number;
  soilType: string;
  location: string;
  cropPlanted: boolean;
  cropName?: string;
  sowingDate?: string;
}

export interface BuyerProfile extends BaseProfile {
  role: 'buyer';
  fssaiNumber: string;
  preferredCrops: string;
  demandVolume: number;
}

export type Profile = FarmerProfile | BuyerProfile;
