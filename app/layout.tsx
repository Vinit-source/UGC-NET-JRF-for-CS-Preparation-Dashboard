import type {Metadata} from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'UGC NET Prep Dashboard',
  description: 'Preparation dashboard for UGC NET JRF examination',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-white text-slate-900" suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white p-8">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
