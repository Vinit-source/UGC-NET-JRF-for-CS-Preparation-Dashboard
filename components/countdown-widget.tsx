'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Calendar as CalendarIcon, Edit2, Check } from 'lucide-react';

export function CountdownWidget() {
  const [targetDate, setTargetDate] = useState<string>('2026-06-28');
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) setIsMounted(true);
    });
    async function loadDate() {
      const db = await getDB();
      const savedDate = await db.get('keyval', 'targetDate');
      if (savedDate) {
        setTargetDate(savedDate);
      }
    }
    loadDate();
    return () => { mounted = false; };
  }, []);

  const today = new Date();
  const target = parseISO(targetDate);
  const daysRemaining = isMounted ? differenceInDays(target, today) : null;

  const handleSave = async () => {
    setIsEditing(false);
    const db = await getDB();
    await db.put('keyval', targetDate, 'targetDate');
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f2f5ff] p-6 shadow-sm border border-indigo-50 w-full h-full">
      <div className="flex items-center gap-2 text-indigo-600 mb-4">
        <CalendarIcon className="h-5 w-5 shrink-0" />
        <span className="font-medium text-base">
          UGC NET JRF Exam
        </span>
      </div>
      
      <div className="text-6xl font-black tracking-tighter text-indigo-900 mb-1">
        {daysRemaining !== null ? Math.max(0, daysRemaining) : '...'}
      </div>
      <div className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-4">
        Days Remaining
      </div>

      <div className="group flex items-center gap-2 text-indigo-600 mt-auto">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="rounded-md border-indigo-200 bg-white px-2 py-1 text-sm text-indigo-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSave}
              className="rounded-md bg-indigo-600 p-1 text-white hover:bg-indigo-700 transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Target: {format(parseISO(targetDate), 'MMM d, yyyy')}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
