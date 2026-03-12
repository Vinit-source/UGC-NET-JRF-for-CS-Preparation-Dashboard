'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, Target, CalendarDays, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Syllabus Tracker', href: '/syllabus', icon: List },
  { name: 'Scores', href: '/scores', icon: Target },
  { name: 'Calendar & Journal', href: '/calendar', icon: CalendarDays },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">UGC NET Prep</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-slate-200">
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-100 p-3 rounded-lg">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <p>
            <strong className="font-semibold text-slate-700 block mb-0.5">Privacy First</strong>
            Your data is stored safely on your computer.
          </p>
        </div>
      </div>
    </div>
  );
}
