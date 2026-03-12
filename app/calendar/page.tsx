'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList, SyllabusItem } from '@/lib/syllabus';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, BookOpen, PenTool, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [journalContent, setJournalContent] = useState('');
  const [flatSyllabus, setFlatSyllabus] = useState<SyllabusItem[]>([]);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [scheduledItems, setScheduledItems] = useState<any[]>([]);

  useEffect(() => {
    setFlatSyllabus(getSyllabusFlatList());
    loadData(selectedDate);
  }, [selectedDate]);

  const loadData = async (date: Date) => {
    const db = await getDB();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

    const allJournals = await db.getAll('journal');
    const dayJournals = allJournals.filter(j => j.date >= startOfDay && j.date <= endOfDay);
    setJournalEntries(dayJournals);

    const allSchedules = await db.getAll('schedule');
    const daySchedules = allSchedules.filter(s => s.date >= startOfDay && s.date <= endOfDay);
    setScheduledItems(daySchedules);
  };

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJournalContent(val);
    setCursorPosition(e.target.selectionStart);

    // Check for @ tag
    const lastAt = val.lastIndexOf('@', e.target.selectionStart - 1);
    if (lastAt !== -1) {
      const query = val.substring(lastAt + 1, e.target.selectionStart);
      if (!query.includes(' ')) {
        setTagQuery(query);
        setShowTagMenu(true);
        return;
      }
    }
    setShowTagMenu(false);
  };

  const insertTag = (item: SyllabusItem) => {
    const lastAt = journalContent.lastIndexOf('@', cursorPosition - 1);
    const before = journalContent.substring(0, lastAt);
    const after = journalContent.substring(cursorPosition);
    const newContent = `${before}#${item.id} ${after}`;
    setJournalContent(newContent);
    setShowTagMenu(false);
  };

  const saveJournal = async () => {
    if (!journalContent.trim()) return;

    // Extract tags (anything starting with #p1 or #p2)
    const tags = Array.from(journalContent.matchAll(/#(p[12][\w-]*)/g)).map(m => m[1]);

    const db = await getDB();
    await db.put('journal', {
      id: crypto.randomUUID(),
      date: selectedDate.getTime(),
      content: journalContent,
      tags,
    });

    setJournalContent('');
    loadData(selectedDate);
  };

  const filteredTags = flatSyllabus.filter(item => 
    item.title.toLowerCase().includes(tagQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="h-full w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Calendar & Journal</h1>
        <p className="mt-2 text-slate-500">Plan your study schedule and log daily reflections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="border-0"
            />
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5" />
              Scheduled for {format(selectedDate, 'MMM d')}
            </h3>
            {scheduledItems.length === 0 ? (
              <p className="text-sm text-indigo-500 italic">No topics scheduled for this day.</p>
            ) : (
              <ul className="space-y-3">
                {scheduledItems.map(item => {
                  const syllabusItem = flatSyllabus.find(s => s.id === item.targetId);
                  return (
                    <li key={item.id} className="flex items-start gap-2 text-sm text-indigo-800 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                      <span>{syllabusItem?.title || 'Unknown Topic'}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <PenTool className="h-5 w-5 text-slate-500" />
              Journal Entry
            </h3>
            
            <div className="relative">
              <textarea
                value={journalContent}
                onChange={handleJournalChange}
                onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                placeholder="Write your reflections... Type @ to tag a topic."
                className="w-full min-h-[150px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
              
              {showTagMenu && (
                <div className="absolute z-10 mt-1 w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="p-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                    Tag Topic
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredTags.map(item => (
                      <li
                        key={item.id}
                        onClick={() => insertTag(item)}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-xs text-slate-400 capitalize">{item.type}</div>
                      </li>
                    ))}
                    {filteredTags.length === 0 && (
                      <li className="px-4 py-2 text-sm text-slate-500 italic">No matching topics found.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={saveJournal}
                disabled={!journalContent.trim()}
                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Entries for {format(selectedDate, 'MMM d, yyyy')}</h3>
            {journalEntries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No journal entries for this date.
              </div>
            ) : (
              journalEntries.map(entry => (
                <div key={entry.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {entry.content.split(/(#p[12][\w-]*)/g).map((part: string, i: number) => {
                      if (part.startsWith('#p')) {
                        const tagItem = flatSyllabus.find(s => s.id === part.substring(1));
                        return (
                          <span key={i} className="inline-flex items-center gap-1 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800 mx-0.5">
                            <Hash className="h-3 w-3" />
                            {tagItem?.title || part}
                          </span>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                  <div className="mt-4 text-xs text-slate-400 text-right">
                    {format(entry.date, 'h:mm a')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
