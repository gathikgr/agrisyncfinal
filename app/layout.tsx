import './globals.css';
import type { Metadata } from 'next';
import { PwaRegister } from '@/components/PwaRegister';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'AgriSync',
  description: 'Predictive pre-harvest coordination platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
