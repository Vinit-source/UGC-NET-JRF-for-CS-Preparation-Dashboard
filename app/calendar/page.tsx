'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList, SyllabusItem } from '@/lib/syllabus';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, BookOpen, PenTool, Hash, Edit2, Check, Clock, AtSign, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [journalContent, setJournalContent] = useState('');
  const [flatSyllabus] = useState<SyllabusItem[]>(() => getSyllabusFlatList());
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [scheduledItems, setScheduledItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData(selectedDate);
  }, [selectedDate]);

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
        setSelectedIndex(0);
        return;
      }
    }
    setShowTagMenu(false);
  };

  const filteredTags = flatSyllabus.filter(item => 
    item.title.toLowerCase().includes(tagQuery.toLowerCase())
  ).slice(0, 5);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showTagMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredTags.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTags[selectedIndex]) {
          insertTag(filteredTags[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowTagMenu(false);
      }
    }
  };

  const insertTag = (item: SyllabusItem) => {
    const lastAt = journalContent.lastIndexOf('@', cursorPosition - 1);
    const before = journalContent.substring(0, lastAt);
    const after = journalContent.substring(cursorPosition);
    const tagText = item.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const newContent = `${before}@${tagText} ${after}`;
    setJournalContent(newContent);
    setShowTagMenu(false);
    setSelectedIndex(0);
  };

  const extractTags = (content: string) => {
    const extractedTags = Array.from(content.matchAll(/@([a-zA-Z0-9_-]+)/g)).map(m => m[1]);
    return extractedTags.map(tagText => {
      const matchedByTitle = flatSyllabus.find(s => 
        s.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') === tagText
      );
      if (matchedByTitle) return matchedByTitle.id;
      const matchedById = flatSyllabus.find(s => s.id === tagText);
      if (matchedById) return matchedById.id;
      return null;
    }).filter(Boolean) as string[];
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const before = journalContent.substring(0, cursorPosition);
    const after = journalContent.substring(cursorPosition);
    const newContent = before + emojiData.emoji + after;
    setJournalContent(newContent);
    setCursorPosition(cursorPosition + emojiData.emoji.length);
    setShowEmojiPicker(false);
  };

  const saveJournal = async () => {
    if (!journalContent.trim()) return;

    const tags = extractTags(journalContent);

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

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
  };

  const saveEdit = async (id: string) => {
    const db = await getDB();
    const entry = await db.get('journal', id);
    if (entry) {
      entry.content = editContent;
      entry.tags = extractTags(editContent);
      await db.put('journal', entry);
      setJournalEntries(prev => prev.map(j => j.id === id ? { ...j, content: editContent, tags: entry.tags } : j));
    }
    setEditingId(null);
  };

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
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="Add Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute right-0 top-10 z-50 shadow-xl rounded-xl border border-slate-200">
                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                  </div>
                )}
              </div>
              <textarea
                value={journalContent}
                onChange={handleJournalChange}
                onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                onKeyDown={handleKeyDown}
                placeholder="Write your reflections... Type @ to tag a topic."
                className="w-full min-h-[150px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
              
              {showTagMenu && (
                <div className="absolute z-10 mt-1 w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="p-2 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                    Tag Topic
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredTags.map((item, index) => (
                      <li
                        key={item.id}
                        onClick={() => insertTag(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "cursor-pointer px-4 py-2 text-sm transition-colors",
                          index === selectedIndex ? "bg-indigo-50 text-indigo-700" : "hover:bg-indigo-50 hover:text-indigo-700"
                        )}
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
              journalEntries.map(entry => {
                const isEditable = Date.now() - entry.date <= 60 * 60 * 1000;
                const isEditing = editingId === entry.id;
                
                return (
                  <div key={entry.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {format(entry.date, 'MMM d, yyyy - h:mm a')}
                      </div>
                      {isEditable && !isEditing && (
                        <button 
                          onClick={() => startEdit(entry)}
                          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea 
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full min-h-[100px] p-3 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => saveEdit(entry.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {entry.content.split(/(@[a-zA-Z0-9_-]+)/g).map((part: string, i: number) => {
                          if (part.startsWith('@')) {
                            const tagText = part.substring(1);
                            
                            // Try to find by formatted title
                            let tagItem = flatSyllabus.find(s => 
                              s.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') === tagText
                            );
                            
                            // Fallback: try to find by ID (legacy support)
                            if (!tagItem) {
                              tagItem = flatSyllabus.find(s => s.id === tagText);
                            }

                            if (tagItem) {
                              return (
                                <span key={i} className="inline-flex items-center gap-1 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800 mx-0.5">
                                  <AtSign className="h-3 w-3" />
                                  {tagItem.title}
                                </span>
                              );
                            }
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
