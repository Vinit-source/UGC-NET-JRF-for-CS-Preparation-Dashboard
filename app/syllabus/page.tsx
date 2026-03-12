'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { syllabus, SyllabusItem, getSyllabusFlatList } from '@/lib/syllabus';
import { calculateConfidence, ConfidenceData } from '@/lib/calculations';
import { ChevronRight, ChevronDown, CalendarPlus, Target, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function SyllabusPage() {
  const [confidenceMap, setConfidenceMap] = useState<Map<string, ConfidenceData>>(new Map());
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const conf = await calculateConfidence();
      setConfidenceMap(conf);
      
      const db = await getDB();
      const allJournals = await db.getAll('journal');
      setJournalEntries(allJournals);
    }
    loadData();
  }, []);

  return (
    <div className="h-full w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Syllabus Tracker</h1>
        <p className="mt-2 text-slate-500">Track your progress and focus areas across the entire syllabus.</p>
      </div>
      
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {syllabus.map((item) => (
          <SyllabusNode key={item.id} item={item} level={0} confidenceMap={confidenceMap} journalEntries={journalEntries} />
        ))}
      </div>
    </div>
  );
}

function SyllabusNode({ item, level, confidenceMap, journalEntries }: { item: SyllabusItem; level: number; confidenceMap: Map<string, ConfidenceData>; journalEntries: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusLevel, setFocusLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  
  const confidenceData = confidenceMap.get(item.id);
  const confidence = confidenceData?.finalScore;
  const isExpandable = item.children && item.children.length > 0;
  const relatedJournals = journalEntries.filter(j => j.tags.includes(item.id));

  useEffect(() => {
    async function loadState() {
      const db = await getDB();
      const state = await db.get('keyval', `collapse-${item.id}`);
      if (state !== undefined) {
        setIsOpen(state);
      } else {
        setIsOpen(level === 0);
      }

      const focus = await db.get('focus', item.id);
      if (focus) {
        setFocusLevel(focus.level);
      }
    }
    loadState();
  }, [item.id, level]);

  const toggleOpen = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    const db = await getDB();
    await db.put('keyval', newState, `collapse-${item.id}`);
  };

  const handleFocusChange = async (newLevel: 'low' | 'medium' | 'high') => {
    const levelToSet = focusLevel === newLevel ? null : newLevel;
    setFocusLevel(levelToSet as any);
    const db = await getDB();
    if (levelToSet) {
      await db.put('focus', { targetId: item.id, level: levelToSet });
    } else {
      await db.delete('focus', item.id);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) return;
    const db = await getDB();
    await db.put('schedule', {
      id: crypto.randomUUID(),
      targetId: item.id,
      date: new Date(scheduleDate).getTime()
    });
    setIsScheduling(false);
    setScheduleDate('');
    alert('Scheduled successfully!');
  };

  const getConfidenceColor = (conf: number | undefined) => {
    if (conf === undefined) return 'bg-slate-200';
    if (conf === 0) return 'bg-red-900';
    if (conf < 20) return 'bg-red-500';
    if (conf < 40) return 'bg-orange-500';
    if (conf < 60) return 'bg-yellow-500';
    if (conf < 80) return 'bg-green-500';
    return 'bg-blue-600';
  };

  return (
    <div className={cn("flex flex-col", level > 0 && "ml-6 mt-2 border-l-2 border-slate-100 pl-4")}>
      <div className="group flex flex-col py-2 hover:bg-slate-50 rounded-lg px-2 -ml-2 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {isExpandable ? (
              <button onClick={toggleOpen} className="p-1 text-slate-400 hover:text-slate-900 transition-colors">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            <div className="flex items-center gap-3 flex-1">
              <div className={cn("h-3 w-3 rounded-full shrink-0", getConfidenceColor(confidence))} title={`Confidence: ${confidence !== undefined ? Math.round(confidence) + '%' : 'N/A'}`} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium text-slate-900",
                    level === 0 && "text-lg font-bold",
                    level === 1 && "text-base font-semibold",
                    level === 2 && "text-sm text-slate-700"
                  )}>
                    {item.title}
                  </span>
                  {confidence !== undefined && (
                    <span className="text-xs font-semibold text-slate-400">{Math.round(confidence)}%</span>
                  )}
                </div>
                {(confidenceData?.directScore !== undefined || confidenceData?.averageScore !== undefined) && (
                  <div className="flex gap-3 text-[10px] text-slate-400 mt-0.5">
                    {confidenceData.directScore !== undefined && (
                      <span title="Score from tests taken directly on this topic">Direct: {Math.round(confidenceData.directScore)}%</span>
                    )}
                    {confidenceData.averageScore !== undefined && (
                      <span title="Average score from sub-topics">Avg from sub-topics: {Math.round(confidenceData.averageScore)}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
              <button
                onClick={() => handleFocusChange('low')}
                className={cn("px-2 py-1 text-xs font-medium rounded-full transition-colors", focusLevel === 'low' ? 'bg-green-200 text-green-800' : 'text-slate-500 hover:bg-slate-200')}
                title="Low Focus"
              >
                L
              </button>
              <button
                onClick={() => handleFocusChange('medium')}
                className={cn("px-2 py-1 text-xs font-medium rounded-full transition-colors", focusLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'text-slate-500 hover:bg-slate-200')}
                title="Medium Focus"
              >
                M
              </button>
              <button
                onClick={() => handleFocusChange('high')}
                className={cn("px-2 py-1 text-xs font-medium rounded-full transition-colors", focusLevel === 'high' ? 'bg-red-200 text-red-800' : 'text-slate-500 hover:bg-slate-200')}
                title="High Focus"
              >
                H
              </button>
            </div>
            
            <button 
              onClick={() => setIsScheduling(!isScheduling)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" 
              title="Schedule Study"
            >
              <CalendarPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isScheduling && (
          <div className="mt-2 ml-8 flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            <input 
              type="date" 
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="text-sm rounded border-indigo-200 px-2 py-1"
            />
            <button onClick={handleSchedule} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 font-medium">
              Schedule
            </button>
            <button onClick={() => setIsScheduling(false)} className="text-xs text-indigo-600 px-2 py-1 hover:bg-indigo-100 rounded">
              Cancel
            </button>
          </div>
        )}

        {relatedJournals.length > 0 && isOpen && (
          <div className="mt-2 ml-8 space-y-2">
            {relatedJournals.map(j => (
              <div key={j.id} className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-2">
                <Hash className="h-3 w-3 mt-0.5 text-indigo-400 shrink-0" />
                <div>
                  <span className="font-medium text-slate-900 mr-2">{format(j.date, 'MMM d, yyyy')}:</span>
                  {j.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isExpandable && isOpen && (
        <div className="flex flex-col gap-1">
          {item.children!.map((child) => (
            <SyllabusNode key={child.id} item={child} level={level + 1} confidenceMap={confidenceMap} journalEntries={journalEntries} />
          ))}
        </div>
      )}
    </div>
  );
}
