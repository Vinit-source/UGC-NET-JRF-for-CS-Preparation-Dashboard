'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { syllabus, SyllabusItem, getSyllabusFlatList } from '@/lib/syllabus';
import { calculateConfidence, ConfidenceData } from '@/lib/calculations';
import { ChevronRight, ChevronDown, CalendarPlus, Target, Hash, X, Edit2, Check, Clock, AtSign, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CountdownWidget } from '@/components/countdown-widget';

export default function SyllabusPage() {
  const [confidenceMap, setConfidenceMap] = useState<Map<string, ConfidenceData>>(new Map());
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [selectedTopicForJournal, setSelectedTopicForJournal] = useState<SyllabusItem | null>(null);

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

  const handleUpdateEntry = async (id: string, newContent: string) => {
    const db = await getDB();
    const entry = await db.get('journal', id);
    if (entry) {
      entry.content = newContent;
      
      const flatSyllabus = getSyllabusFlatList();
      const extractedTags = Array.from(newContent.matchAll(/@([a-zA-Z0-9_-]+)/g)).map(m => m[1]);
      const tags = extractedTags.map(tagText => {
        const matchedByTitle = flatSyllabus.find(s => 
          s.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') === tagText
        );
        if (matchedByTitle) return matchedByTitle.id;
        const matchedById = flatSyllabus.find(s => s.id === tagText);
        if (matchedById) return matchedById.id;
        return null;
      }).filter(Boolean) as string[];
      
      entry.tags = tags;
      await db.put('journal', entry);
      setJournalEntries(prev => prev.map(j => j.id === id ? { ...j, content: newContent, tags } : j));
    }
  };

  return (
    <div className="h-full w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Syllabus Tracker</h1>
          <p className="mt-2 text-slate-500">Track your progress and focus areas across the entire syllabus.</p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {syllabus.map((item) => (
          <SyllabusNode 
            key={item.id} 
            item={item} 
            level={0} 
            confidenceMap={confidenceMap} 
            journalEntries={journalEntries}
            onTopicClick={(item) => setSelectedTopicForJournal(item)}
          />
        ))}
      </div>

      {selectedTopicForJournal && (
        <JournalModal 
          item={selectedTopicForJournal} 
          onClose={() => setSelectedTopicForJournal(null)} 
          journalEntries={journalEntries.filter(j => j.tags.includes(selectedTopicForJournal.id)).sort((a, b) => b.date - a.date)}
          onUpdateEntry={handleUpdateEntry}
        />
      )}
    </div>
  );
}

function JournalModal({ item, onClose, journalEntries, onUpdateEntry }: { item: SyllabusItem, onClose: () => void, journalEntries: any[], onUpdateEntry: (id: string, content: string) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
    setCursorPosition(entry.content.length);
  };

  const saveEdit = (id: string) => {
    onUpdateEntry(id, editContent);
    setEditingId(null);
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const before = editContent.substring(0, cursorPosition);
    const after = editContent.substring(cursorPosition);
    const newContent = before + emojiData.emoji + after;
    setEditContent(newContent);
    setCursorPosition(cursorPosition + emojiData.emoji.length);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="text-sm text-slate-500 mt-1">Journal Entries</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No journal entries found for this topic.
            </div>
          ) : (
            <div className="space-y-4">
              {journalEntries.map(entry => {
                const isEditable = now > 0 && now - entry.date <= 60 * 60 * 1000;
                const isEditing = editingId === entry.id;
                
                return (
                  <div key={entry.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
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
                        <div className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="Add Emoji"
                            >
                              <Smile className="h-4 w-4" />
                            </button>
                            {showEmojiPicker && (
                              <div className="absolute right-0 top-8 z-50 shadow-xl rounded-xl border border-slate-200">
                                <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                              </div>
                            )}
                          </div>
                          <textarea 
                            value={editContent}
                            onChange={(e) => {
                              setEditContent(e.target.value);
                              setCursorPosition(e.target.selectionStart);
                            }}
                            onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                            onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                            className="w-full min-h-[100px] p-3 pr-10 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingId(null);
                              setShowEmojiPicker(false);
                            }}
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
                      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {entry.content.split(/(@[a-zA-Z0-9_-]+)/g).map((part: string, i: number) => {
                          if (part.startsWith('@')) {
                            const tagText = part.substring(1);
                            const flatSyllabus = getSyllabusFlatList();
                            
                            let tagItem = flatSyllabus.find(s => 
                              s.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') === tagText
                            );
                            
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SyllabusNode({ item, level, confidenceMap, journalEntries, onTopicClick }: { item: SyllabusItem; level: number; confidenceMap: Map<string, ConfidenceData>; journalEntries: any[]; onTopicClick: (item: SyllabusItem) => void }) {
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-start md:items-center gap-2 flex-1">
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
                    "font-medium text-slate-900 cursor-pointer hover:text-indigo-600 hover:underline transition-colors",
                    level === 0 && "text-lg font-bold",
                    level === 1 && "text-base font-semibold",
                    level === 2 && "text-sm text-slate-700"
                  )}
                  onClick={() => onTopicClick(item)}
                  >
                    {item.title}
                  </span>
                  {relatedJournals.length > 0 && (
                    <span 
                      className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-indigo-200 transition-colors"
                      onClick={() => onTopicClick(item)}
                      title={`${relatedJournals.length} journal entries`}
                    >
                      {relatedJournals.length}
                    </span>
                  )}
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

          <div className="flex items-center gap-2 md:gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-2 md:mt-0 flex-wrap">
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
      </div>

      {isExpandable && isOpen && (
        <div className="flex flex-col gap-1">
          {item.children!.map((child) => (
            <SyllabusNode key={child.id} item={child} level={level + 1} confidenceMap={confidenceMap} journalEntries={journalEntries} onTopicClick={onTopicClick} />
          ))}
        </div>
      )}
    </div>
  );
}
