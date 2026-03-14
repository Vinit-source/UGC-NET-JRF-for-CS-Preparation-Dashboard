'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList, SyllabusItem } from '@/lib/syllabus';
import { format } from 'date-fns';
import { Plus, Save, Target } from 'lucide-react';

export default function ScoresPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [flatSyllabus] = useState<SyllabusItem[]>(() => getSyllabusFlatList());

  // Form state
  const [targetId, setTargetId] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  const loadScores = async () => {
    const db = await getDB();
    const allScores = await db.getAll('scores');
    setScores(allScores.sort((a, b) => b.date - a.date));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadScores();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !score || !maxScore) return;

    const targetItem = flatSyllabus.find(item => item.id === targetId);
    if (!targetItem) return;

    const db = await getDB();
    const newScore = {
      id: crypto.randomUUID(),
      targetId,
      targetType: targetItem.type,
      score: Number(score),
      maxScore: Number(maxScore),
      date: Date.now(),
    };

    await db.put('scores', newScore);
    
    setIsAdding(false);
    setTargetId('');
    setScore('');
    setMaxScore('');
    loadScores();
  };

  return (
    <div className="h-full w-full max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Scores & Practice</h1>
          <p className="mt-2 text-slate-500">Log your test marks and track your performance.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Score
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Log New Score</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Topic/Unit</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>Select a topic...</option>
                {flatSyllabus.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.type === 'unit' ? '📚 ' : item.type === 'topic' ? '  📄 ' : '    - '}
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="md:col-span-4 flex justify-end mt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Score
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Previous Scores
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {scores.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No scores logged yet. Start by adding a new score above.
            </div>
          ) : (
            scores.map((s) => {
              const item = flatSyllabus.find(i => i.id === s.targetId);
              const percentage = Math.round((s.score / s.maxScore) * 100);
              return (
                <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50 transition-colors gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                        {s.targetType}
                      </span>
                      <span className="text-sm text-slate-500">{format(s.date, 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    <h4 className="font-medium text-slate-900">{item?.title || 'Unknown Topic'}</h4>
                  </div>
                  <div className="flex items-center gap-6 self-start md:self-auto">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {s.score} <span className="text-sm font-normal text-slate-500">/ {s.maxScore}</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
