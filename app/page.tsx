'use client';

import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { getSyllabusFlatList, syllabus } from '@/lib/syllabus';
import { calculateConfidence, ConfidenceData } from '@/lib/calculations';
import { BookOpen, Target, Calendar as CalendarIcon, PenTool, TrendingUp, Award, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { motion } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  const [stats, setStats] = useState({
    totalTopics: 0,
    practicedTopics: 0,
    masteredTopics: 0,
    averageScore: 0,
    totalJournals: 0,
    totalTests: 0,
  });
  
  const [unitData, setUnitData] = useState<any[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const db = await getDB();
        const flatSyllabus = getSyllabusFlatList();
        const allTopics = flatSyllabus.filter(item => item.type === 'topic');
        
        // Load scores and journals
        const allScores = await db.getAll('scores');
        const allJournals = await db.getAll('journal');
        const allSchedule = await db.getAll('schedule');
        
        // Calculate confidence
        const confidenceMap = await calculateConfidence();
        
        // Calculate stats
        let practiced = 0;
        let mastered = 0;
        let totalScoreSum = 0;
        let totalMaxSum = 0;
        
        allTopics.forEach(topic => {
          const conf = confidenceMap.get(topic.id);
          if (conf && conf.finalScore > 0) {
            practiced++;
            if (conf.finalScore >= 80) {
              mastered++;
            }
          }
        });
        
        allScores.forEach(score => {
          totalScoreSum += score.score;
          totalMaxSum += score.maxScore;
        });
        
        const avgScore = totalMaxSum > 0 ? Math.round((totalScoreSum / totalMaxSum) * 100) : 0;
        
        setStats({
          totalTopics: allTopics.length,
          practicedTopics: practiced,
          masteredTopics: mastered,
          averageScore: avgScore,
          totalJournals: allJournals.length,
          totalTests: allScores.length,
        });
        
        // Prepare Unit Chart Data
        const topLevelUnits = syllabus.flatMap(paper => paper.children || []);
        const chartData = topLevelUnits.map(unit => {
          const conf = confidenceMap.get(unit.id);
          return {
            name: unit.title.split('.')[0] || unit.title.substring(0, 15),
            fullTitle: unit.title,
            score: conf ? Math.round(conf.finalScore) : 0,
          };
        });
        
        setUnitData(chartData);
        
        // Prepare Upcoming Schedule
        const now = Date.now();
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        
        const upcoming = allSchedule
          .filter(s => s.date >= startOfToday)
          .sort((a, b) => a.date - b.date)
          .slice(0, 5)
          .map(s => {
            const item = flatSyllabus.find(i => i.id === s.targetId);
            return {
              ...s,
              title: item?.title || 'Unknown Topic',
              type: item?.type || 'topic'
            };
          });
          
        setUpcomingSchedule(upcoming);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-6xl mx-auto space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-500">Welcome back! Here's an overview of your UGC NET preparation.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/scores" className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors">
            Log Score
          </Link>
          <Link href="/calendar" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
            View Calendar
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Syllabus Coverage</h3>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.practicedTopics}</span>
            <span className="text-sm text-slate-500 mb-1">/ {stats.totalTopics} topics</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min(100, (stats.practicedTopics / Math.max(1, stats.totalTopics)) * 100)}%` }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Mastered Topics</h3>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.masteredTopics}</span>
            <span className="text-sm text-slate-500 mb-1">topics &gt;80%</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${Math.min(100, (stats.masteredTopics / Math.max(1, stats.totalTopics)) * 100)}%` }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Average Score</h3>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.averageScore}%</span>
            <span className="text-sm text-slate-500 mb-1">across {stats.totalTests} tests</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {stats.averageScore >= 70 ? 'Great job! Keep it up.' : 'Keep practicing to improve.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Journal Entries</h3>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.totalJournals}</span>
            <span className="text-sm text-slate-500 mb-1">reflections</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Consistent reflection helps retention.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" />
              Unit Confidence Levels
            </h3>
            <Link href="/syllabus" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View Details &rarr;
            </Link>
          </div>
          
          <div className="h-[300px] w-full">
            {unitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
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
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg">
                            <p className="font-medium text-slate-900 text-sm mb-1">{payload[0].payload.fullTitle}</p>
                            <p className="text-indigo-600 font-bold">Confidence: {payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {unitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10b981' : entry.score >= 50 ? '#6366f1' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No data available. Start logging scores to see your progress.
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Schedule */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              Upcoming Schedule
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {upcomingSchedule.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedule.map((item, index) => {
                  const isToday = new Date(item.date).toDateString() === new Date().toDateString();
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full mt-1.5",
                          isToday ? "bg-indigo-600" : "bg-slate-300"
                        )} />
                        {index < upcomingSchedule.length - 1 && (
                          <div className="w-px h-full bg-slate-200 mt-2" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={cn(
                          "text-xs font-semibold mb-1",
                          isToday ? "text-indigo-600" : "text-slate-500"
                        )}>
                          {isToday ? 'Today' : format(item.date, 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm font-medium text-slate-900 leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 capitalize mt-1">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
                <div className="p-3 bg-slate-50 rounded-full">
                  <Clock className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No upcoming topics scheduled.</p>
                <Link href="/calendar" className="text-sm text-indigo-600 font-medium hover:underline">
                  Schedule some topics
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
