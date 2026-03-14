'use client';

import { useState, useEffect } from 'react';
import { CountdownWidget } from '@/components/countdown-widget';
import { ScoreTrendsChart } from '@/components/score-trends-chart';
import { BrainCircuit, Loader2, RefreshCw } from 'lucide-react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList } from '@/lib/syllabus';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from '@google/genai';

export default function Home() {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasScores, setHasScores] = useState(false);

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
      // Check if we already have a cached analysis for today
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
        <ScoreTrendsChart />
        
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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
