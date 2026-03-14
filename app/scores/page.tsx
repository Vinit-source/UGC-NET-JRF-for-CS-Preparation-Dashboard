'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList, SyllabusItem } from '@/lib/syllabus';
import { format } from 'date-fns';
import { Plus, Save, Target, ChevronDown, ChevronRight, BrainCircuit, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoogleGenAI } from '@google/genai';
import { cn } from '@/lib/utils';

export default function ScoresPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isScoresOpen, setIsScoresOpen] = useState(true);
  const [flatSyllabus] = useState<SyllabusItem[]>(() => getSyllabusFlatList());

  // Form state
  const [targetId, setTargetId] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  // AI Analysis state
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasScores, setHasScores] = useState(false);

  const loadScores = async () => {
    const db = await getDB();
    const allScores = await db.getAll('scores');
    setScores(allScores.sort((a, b) => b.date - a.date));
    if (allScores.length > 0) setHasScores(true);
  };

  const loadAnalysis = async (forceUpdate = false) => {
    const db = await getDB();
    const allScores = await db.getAll('scores');
    if (allScores.length === 0) {
      setHasScores(false);
      return;
    }
    setHasScores(true);

    const today = new Date().toDateString();

    if (!forceUpdate) {
      const cached = await db.get('keyval', 'ai-analysis');
      const lastUpdate = await db.get('keyval', 'ai-analysis-date');

      if (cached && lastUpdate === today) {
        setAnalysis(cached);
        return;
      }
    }

    setIsLoading(true);
    try {
      const allFocus = await db.getAll('focus');
      
      const mappedScores = allScores.map(s => ({
        topic: flatSyllabus.find(i => i.id === s.targetId)?.title || s.targetId,
        score: s.score,
        maxScore: s.maxScore,
        percentage: Math.round((s.score / s.maxScore) * 100)
      }));

      const mappedFocus = allFocus.map(f => ({
        topic: flatSyllabus.find(i => i.id === f.targetId)?.title || f.targetId,
        level: f.level
      }));

      const apiKey = localStorage.getItem('GEMINI_API_KEY_PRIMARY') || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAnalysis('API Key not found. Please add your Gemini API Key in the Settings page.');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an expert, highly motivating tutor and mentor for the UGC NET JRF examination.
        Analyze the student's current progress based on their test scores and focus areas.
        
        Scores data: ${JSON.stringify(mappedScores)}
        Focus areas: ${JSON.stringify(mappedFocus)}
        
        Provide a concise, encouraging, and actionable analysis (max 3 paragraphs).
        Identify 2-3 specific topics they should focus on next, considering their low scores and high focus marks.
        Include a motivating persona, and end with one inspiring quote from a great successful person.
        Include emojis in your response to make it lively and engaging! 🚀✨
        Do not use markdown formatting like bold or headers, just plain text paragraphs separated by newlines.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        setAnalysis(response.text);
        await db.put('keyval', response.text, 'ai-analysis');
        await db.put('keyval', today, 'ai-analysis-date');
      }
    } catch (e: any) {
      console.error(e);
      setAnalysis(`Failed to generate analysis. Error: ${e.message || 'Unknown error'}. Please check your API key or try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScores().then(() => loadAnalysis());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    await loadScores();
    loadAnalysis(true); // Refresh analysis after new score
  };

  // Prepare data for line chart (trends over time)
  const trendData = [...scores].reverse().map(s => {
    const item = flatSyllabus.find(i => i.id === s.targetId);
    return {
      date: format(s.date, 'MMM d'),
      percentage: Math.round((s.score / s.maxScore) * 100),
      topic: item?.title || 'Unknown'
    };
  });

  // Prepare data for bar chart (average score per topic)
  const topicScores: Record<string, { totalPercentage: number, count: number }> = scores.reduce((acc: Record<string, { totalPercentage: number, count: number }>, s: any) => {
    const item = flatSyllabus.find(i => i.id === s.targetId);
    const title = item?.title || 'Unknown';
    if (!acc[title]) {
      acc[title] = { totalPercentage: 0, count: 0 };
    }
    acc[title].totalPercentage += (s.score / s.maxScore) * 100;
    acc[title].count += 1;
    return acc;
  }, {});

  const barData = Object.entries(topicScores).map(([topic, data]) => ({
    topic: topic.length > 15 ? topic.substring(0, 15) + '...' : topic,
    fullTopic: topic,
    average: Math.round(data.totalPercentage / data.count)
  }));

  return (
    <div className="h-full w-full max-w-6xl mx-auto">
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

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
        <div 
          className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => setIsScoresOpen(!isScoresOpen)}
        >
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Previous Scores
          </h3>
          {isScoresOpen ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
        </div>
        
        {isScoresOpen && (
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
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
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-6">Score Trends Over Time</h3>
            {trendData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="percentage" name="Score %" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
                Not enough data to show trends
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-6">Average Score by Topic</h3>
            {barData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="average" name="Avg Score %" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
                Not enough data to show topic averages
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm h-full">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Analysis</h2>
              </div>
              {hasScores && (
                <button
                  onClick={() => loadAnalysis(true)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  Update
                </button>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Based on your recent test scores, here are some suggestions on where to focus your efforts.
            </p>
            <div className="rounded-xl bg-slate-50 p-6 border border-slate-100 h-[calc(100%-120px)] overflow-y-auto">
              {!hasScores ? (
                <p className="text-sm text-slate-500 italic">
                  AI suggestions will appear here once you start logging test scores.
                </p>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
              ) : (
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  {analysis.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
