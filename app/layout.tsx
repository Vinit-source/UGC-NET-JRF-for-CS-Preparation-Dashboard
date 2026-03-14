import type {Metadata} from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'UGC NET Prep Dashboard',
  description: 'Preparation dashboard for UGC NET JRF examination',
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsOHReqhtyAaBeHuSxjVVOTZ_yTZdqWerR5A&s',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col md:flex-row h-screen overflow-hidden bg-white text-slate-900" suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
