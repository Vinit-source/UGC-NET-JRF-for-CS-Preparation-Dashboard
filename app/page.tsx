'use client';

import { useState, useEffect } from 'react';
import { CountdownWidget } from '@/components/countdown-widget';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList } from '@/lib/syllabus';

export default function Home() {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasScores, setHasScores] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      const db = await getDB();
      const allScores = await db.getAll('scores');
      if (allScores.length === 0) {
        setHasScores(false);
        return;
      }
      setHasScores(true);

      // Check if we already have a cached analysis for today
      const cached = await db.get('keyval', 'ai-analysis');
      const lastUpdate = await db.get('keyval', 'ai-analysis-date');
      const today = new Date().toDateString();

      if (cached && lastUpdate === today) {
        setAnalysis(cached);
        return;
      }

      setIsLoading(true);
      try {
        const allFocus = await db.getAll('focus');
        const flatSyllabus = getSyllabusFlatList();
        
        // Map IDs to titles for the AI
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

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores: mappedScores, focus: mappedFocus })
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysis(data.analysis);
          await db.put('keyval', data.analysis, 'ai-analysis');
          await db.put('keyval', today, 'ai-analysis-date');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalysis();
  }, []);

  return (
    <div className="relative h-full w-full max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-lg text-slate-500">Welcome back to your UGC NET preparation.</p>
      </div>

      <CountdownWidget />

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Analysis</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">
            Based on your recent test scores, here are some suggestions on where to focus your efforts.
          </p>
          <div className="rounded-xl bg-slate-50 p-6 border border-slate-100">
            {!hasScores ? (
              <p className="text-sm text-slate-500 italic">
                AI suggestions will appear here once you start logging test scores in the Scores tab.
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
  );
}
