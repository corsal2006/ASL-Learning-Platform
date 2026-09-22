'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import progressStore, { UserJourney } from '@/lib/progress-store';
import { ASL_CURRICULUM } from '@/lib/asl-curriculum';
import {
  Trophy,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';

export default function JourneyDashboardPage() {
  const [journey, setJourney] = useState<UserJourney>(progressStore.getJourney());

  useEffect(() => {
    setJourney(progressStore.getJourney());
    const unsub = progressStore.subscribe(() => {
      setJourney(progressStore.getJourney());
    });
    return unsub;
  }, []);

  const totalLetters = 26;
  const letterStatsList = Object.values(journey.letterStats);
  const masteredList = letterStatsList.filter((s) => s.isMastered);
  const masteryPct = Math.round((masteredList.length / totalLetters) * 100);

  const recommendation = progressStore.getRecommendations();
  const weakLetters = progressStore.getWeakLetters();

  // Calculate overall accuracy
  const totalAttempts = letterStatsList.reduce((acc, s) => acc + s.attempts, 0);
  const totalCorrect = letterStatsList.reduce((acc, s) => acc + s.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-7xl flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZERO-ACCOUNT LOCAL JOURNEY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              Your Learning <span className="font-semibold text-cyan-400">Journey</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-light">
              Your practice sessions, accuracy milestones, and personalized letter drills are saved directly to your device.
            </p>
          </div>

          <Link
            href="/learn"
            className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <span>Resume Lessons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Stats Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Alphabet Mastered */}
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Alphabet Mastered
            </span>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold font-mono text-cyan-400">{masteryPct}%</span>
              <span className="text-xs text-zinc-400">({masteredList.length}/26)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>

          {/* Daily Streak */}
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Daily Practice Streak
            </span>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-amber-400 fill-amber-400" />
              <span className="text-4xl font-bold font-mono text-amber-400">{journey.currentStreak}d</span>
            </div>
            <p className="text-[11px] text-zinc-400">Best record: {journey.bestStreak} days</p>
          </div>

          {/* Accuracy */}
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Overall Accuracy
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold font-mono text-emerald-400">{overallAccuracy}%</span>
              <span className="text-xs text-zinc-400">({totalCorrect}/{totalAttempts})</span>
            </div>
            <p className="text-[11px] text-zinc-400">Calculated over real webcam sign attempts</p>
          </div>

          {/* Fastest Recognition */}
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Fastest Recognition
            </span>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-3xl font-bold font-mono text-purple-300">
                {journey.fastestRecognitionMs > 0
                  ? `${(journey.fastestRecognitionMs / 1000).toFixed(1)}s`
                  : '—'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">On-device neural latency</p>
          </div>
        </div>

        {/* Personalized Recommendations Section (Section 26) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Recommendation Banner */}
          <div className="lg:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-[#07111F] via-[#0B1A30] to-[#07111F] border border-cyan-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RECOMMENDED FOR YOU</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{recommendation.title}</h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6 max-w-xl">
                {recommendation.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {recommendation.letters.map((l) => (
                  <span
                    key={l}
                    className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-white font-mono font-bold flex items-center justify-center text-base"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={recommendation.href}
              className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center gap-2 self-start shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <span>{recommendation.action}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Weak Letters Focus Card */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <AlertCircle className="w-4 h-4" />
                <h4 className="text-sm font-semibold text-white">Needs Practice</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-light">
                Signs with lower recognition accuracy. Practice these to build smoother hand transitions.
              </p>

              {weakLetters.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {weakLetters.map((char) => (
                    <Link
                      key={char}
                      href={`/practice?letter=${char}`}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold transition-all"
                    >
                      {char}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-mono">No weak letters recorded yet!</p>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 pt-4 border-t border-white/5">
              Refreshed dynamically from local session logs.
            </div>
          </div>
        </div>

        {/* Complete 26-Letter Mastery Matrix */}
        <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl mb-12">
          <h3 className="text-lg font-bold text-white mb-6">Alphabet Mastery Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {ASL_CURRICULUM.map((lesson) => {
              const stat = journey.letterStats[lesson.letter];
              const isMastered = stat?.isMastered;
              const hasAttempts = (stat?.attempts || 0) > 0;

              return (
                <Link
                  key={lesson.letter}
                  href={`/learn/${lesson.id}`}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center group ${
                    isMastered
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                      : hasAttempts
                      ? 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/60'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl font-bold font-mono text-white mb-1">
                    {lesson.letter}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase ${
                      isMastered
                        ? 'text-emerald-400'
                        : hasAttempts
                        ? 'text-blue-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {isMastered ? 'Mastered' : hasAttempts ? `${Math.round((stat?.accuracy || 0) * 100)}%` : 'New'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Quiz Sessions Table */}
        {journey.quizHistory.length > 0 && (
          <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Recent Quiz Performance</h3>
            <div className="divide-y divide-white/5">
              {journey.quizHistory.slice(0, 5).map((q) => (
                <div key={q.id} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-white capitalize">{q.mode.replace('_', ' ')}</span>
                    <span className="text-zinc-500">
                      {new Date(q.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400">Score: {q.score}/{q.total}</span>
                    <span className="text-emerald-400 font-bold">{Math.round(q.accuracy * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
