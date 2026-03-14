'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList } from '@/lib/syllabus';
import { TrendingUp, Loader2 } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  percentage: number;
  topic: string;
  score: number;
  maxScore: number;
}

export function ScoreTrendsChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const db = await getDB();
        const allScores = await db.getAll('scores');
        
        if (allScores.length === 0) {
          setData([]);
          setIsLoading(false);
          return;
        }

        const flatSyllabus = getSyllabusFlatList();

        // Sort scores by date ascending
        const sortedScores = allScores.sort((a, b) => a.date - b.date);

        // Map to chart data points
        const chartData: ChartDataPoint[] = sortedScores.map(s => {
          const dateObj = new Date(s.date);
          const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`;
          
          return {
            date: formattedDate,
            percentage: Math.round((s.score / s.maxScore) * 100),
            topic: flatSyllabus.find(i => i.id === s.targetId)?.title || s.targetId,
            score: s.score,
            maxScore: s.maxScore,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Failed to load score trends:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Score Trends</h2>
          <p className="text-sm text-slate-500">Your performance over time</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full mt-4">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-sm text-slate-500 italic text-center">
              No scores logged yet. Start practicing and log your scores to see your progress trends here!
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartDataPoint;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md">
                        <p className="text-xs font-semibold text-slate-500 mb-1">{data.date}</p>
                        <p className="text-sm font-bold text-slate-900 mb-1">{data.topic}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-indigo-600">{data.percentage}%</span>
                          <span className="text-xs text-slate-500">({data.score}/{data.maxScore})</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPercentage)" 
                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
