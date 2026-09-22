'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import {
  CURRICULUM_LEVELS,
  ASL_CURRICULUM,
  WORD_LESSONS,
  PHRASE_LESSONS,
  NUMBER_LESSONS,
} from '@/lib/asl-curriculum';
import progressStore, { UserJourney } from '@/lib/progress-store';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function JourneyPage() {
  const [journey, setJourney] = useState<UserJourney>(progressStore.getJourney());

  useEffect(() => {
    const unsub = progressStore.subscribe(() => {
      setJourney(progressStore.getJourney());
    });
    return unsub;
  }, []);

  const masteredLetters = journey.masteredLetters || [];
  const alphabetProgress = Math.round((masteredLetters.length / 26) * 100);

  // Determine current active letter lesson
  const currentLessonId = Math.min(masteredLetters.length + 1, 26);

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl flex-1">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structured Path • Alphabet to Fluency</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Your ASL Learning Journey
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Follow our progressive visual roadmap. Master the 26-letter manual alphabet, then advance to essential everyday vocabulary, expressive phrases, and fluid conversational signing.
          </p>

          {/* Top Quick Stats Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{masteredLetters.length} / 26 Alphabet Mastered</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{journey.currentStreak} Day Streak</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{journey.averageAccuracy}% Accuracy</span>
            </div>
          </div>
        </div>

        {/* ROADMAP CURVED VERTICAL PATH */}
        <div className="relative space-y-16 before:absolute before:inset-0 before:left-8 sm:before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500/30 before:to-transparent">
          {/* LEVEL 1: ALPHABET */}
          <div className="relative flex flex-col sm:flex-row items-center gap-8 group">
            {/* Center Node Icon */}
            <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#07111F] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.5)] z-10">
              <span className="text-lg">✋</span>
            </div>

            {/* Left Description Card */}
            <div className="w-full sm:w-1/2 sm:pr-12 pl-20 sm:pl-0 text-left sm:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Level 01
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">ASL Alphabet (A – Z)</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                The bedrock of ASL fingerspelling. Real-time computer vision recognition tracks every joint and thumb placement.
              </p>
              <div className="mt-4 flex sm:justify-end gap-2">
                <Link
                  href={`/learn/${currentLessonId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continue Lesson {currentLessonId}</span>
                </Link>
              </div>
            </div>

            {/* Right Milestone Grid (A-Z quick cards) */}
            <div className="w-full sm:w-1/2 sm:pl-12 pl-20 sm:pl-0">
              <div className="p-5 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-zinc-400 font-mono">Progress: {alphabetProgress}%</span>
                  <span className="text-cyan-400 font-mono font-semibold">
                    {masteredLetters.length}/26 Complete
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${alphabetProgress}%` }}
                  />
                </div>

                {/* Letter badges */}
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
                  {ASL_CURRICULUM.map((item) => {
                    const isMastered = masteredLetters.includes(item.letter);
                    const isCurrent = item.id === currentLessonId;

                    return (
                      <Link
                        key={item.letter}
                        href={`/learn/${item.id}`}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isCurrent
                            ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(56,189,248,0.6)] font-bold scale-105'
                            : 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/5'
                        }`}
                      >
                        {item.letter}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 2: BASIC WORDS */}
          <div className="relative flex flex-col sm:flex-row-reverse items-center gap-8 group">
            {/* Center Node Icon */}
            <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#07111F] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.4)] z-10">
              <span className="text-lg">💬</span>
            </div>

            {/* Left Description Card (flipped to right on desktop) */}
            <div className="w-full sm:w-1/2 sm:pl-12 pl-20 sm:pl-0 text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Level 02
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Essential Words</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Core daily signs: greetings, courtesy, polite requests, affirmation, and fundamental needs with motion directions.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                  10 Core Vocabulary Signs
                </span>
              </div>
            </div>

            {/* Milestone Words List */}
            <div className="w-full sm:w-1/2 sm:pr-12 pl-20 sm:pl-0">
              <div className="p-5 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="grid grid-cols-2 gap-2">
                  {WORD_LESSONS.map((word) => (
                    <div
                      key={word.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{word.word}</span>
                        <span className="text-[10px] text-zinc-400">{word.meaning}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {word.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 3: COMMON PHRASES */}
          <div className="relative flex flex-col sm:flex-row items-center gap-8 group">
            {/* Center Node Icon */}
            <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#07111F] border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.4)] z-10">
              <span className="text-lg">✨</span>
            </div>

            {/* Left Description Card */}
            <div className="w-full sm:w-1/2 sm:pr-12 pl-20 sm:pl-0 text-left sm:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Level 03
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Common Phrases</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Connect individual signs into authentic multi-sign sentences. Incorporate non-manual grammar like furrowed eyebrows for WH-questions.
              </p>
            </div>

            {/* Milestone Phrases Card */}
            <div className="w-full sm:w-1/2 sm:pl-12 pl-20 sm:pl-0">
              <div className="p-5 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-2.5">
                {PHRASE_LESSONS.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{phrase.phrase}</span>
                      <span className="text-[10px] text-zinc-400">{phrase.meaning}</span>
                    </div>
                    <div className="flex gap-1">
                      {phrase.breakdown.map((part, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LEVEL 4: NUMBERS */}
          <div className="relative flex flex-col sm:flex-row-reverse items-center gap-8 group">
            {/* Center Node Icon */}
            <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#07111F] border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_24px_rgba(192,132,252,0.4)] z-10">
              <span className="text-lg">🔢</span>
            </div>

            <div className="w-full sm:w-1/2 sm:pl-12 pl-20 sm:pl-0 text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Level 04
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">ASL Numbers (1 – 10)</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Native counting orientations: notice palm inward for 1-5, and outward for 6-9 with thumb touches.
              </p>
            </div>

            <div className="w-full sm:w-1/2 sm:pr-12 pl-20 sm:pl-0">
              <div className="p-5 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-xl shadow-xl">
                <div className="grid grid-cols-5 gap-2">
                  {NUMBER_LESSONS.map((num) => (
                    <div
                      key={num.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center"
                    >
                      <span className="text-xl font-bold font-mono text-purple-300 block">
                        {num.number}
                      </span>
                      <span className="text-[9px] text-zinc-400 truncate block mt-1">
                        {num.handshape.split(',')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 5: PRACTICAL CONVERSATION */}
          <div className="relative flex flex-col sm:flex-row items-center gap-8 group">
            {/* Center Node Icon */}
            <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#07111F] border-2 border-rose-400 flex items-center justify-center text-rose-300 shadow-[0_0_24px_rgba(244,63,94,0.4)] z-10">
              <span className="text-lg">🤝</span>
            </div>

            <div className="w-full sm:w-1/2 sm:pr-12 pl-20 sm:pl-0 text-left sm:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                Level 05
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Practical Conversation</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Fluency scenarios: introduce yourself, ask someone's name, express gratitude, and converse comfortably in the Deaf community.
              </p>
            </div>

            <div className="w-full sm:w-1/2 sm:pl-12 pl-20 sm:pl-0">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/20 to-purple-950/20 border border-rose-500/20 backdrop-blur-xl shadow-xl text-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-semibold">
                  <Award className="w-4 h-4" />
                  <span>Comprehensive Fluency Goal</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Complete all 26 alphabet letters and 10 vocabulary signs to unlock simulated live dialogue challenges.
                </p>
                <Link
                  href="/learn/1"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all mt-2"
                >
                  <span>Start with Letter A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
