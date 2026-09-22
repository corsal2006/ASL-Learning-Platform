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
  CONVERSATION_LESSONS,
  ASLLessonData,
} from '@/lib/asl-curriculum';
import progressStore, { UserJourney } from '@/lib/progress-store';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Layers,
  Search,
} from 'lucide-react';
import { speechService } from '@/lib/speechService';
import { getSignVisualUrl } from '@/lib/sign-assets';

export default function LearnPage() {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [journey, setJourney] = useState<UserJourney>(progressStore.getJourney());
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setJourney(progressStore.getJourney());
    const unsub = progressStore.subscribe(() => {
      setJourney(progressStore.getJourney());
    });
    return unsub;
  }, []);

  const masteredLetters = journey.masteredLetters || [];
  const alphabetMastery = Math.round((masteredLetters.length / 26) * 100);

  // Determine current active letter lesson
  const currentAlphabetLessonId = Math.min(masteredLetters.length + 1, 26);

  const playQuickAudio = (e: React.MouseEvent, text: string, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (speakingKey === key) {
      speechService.stop();
      setSpeakingKey(null);
    } else {
      setSpeakingKey(key);
      speechService.speak(text, () => {
        setSpeakingKey(null);
      });
    }
  };

  const filteredAlphabet = ASL_CURRICULUM.filter(
    (l) =>
      l.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl flex-1">
        {/* Page Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>STRUCTURED ASL CURRICULUM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              From Alphabet to <span className="font-semibold text-cyan-400">Conversational Fluency</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-light max-w-2xl leading-relaxed">
              Step-by-step visual, verbal, and camera practice. Master manual fingerspelling, then unlock essential vocabulary, full phrases, and everyday dialogue.
            </p>
          </div>

          {/* Quick CTA to Start / Resume */}
          <div className="flex items-center gap-4">
            <Link
              href={`/learn/${currentAlphabetLessonId}`}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all shadow-[0_0_24px_rgba(255,255,255,0.25)] flex items-center gap-2 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {masteredLetters.length === 0
                  ? 'Start Learning — Lesson 1 (A)'
                  : `Resume Lesson ${currentAlphabetLessonId}`}
              </span>
            </Link>
          </div>
        </div>

        {/* 5-LEVEL PROGRESSIVE ROADMAP NAVIGATION TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {CURRICULUM_LEVELS.map((lvl) => {
            const isActive = activeLevel === lvl.level;
            const isUnlocked = lvl.level <= 2 || masteredLetters.length >= 10;

            return (
              <button
                key={lvl.level}
                onClick={() => setActiveLevel(lvl.level)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-[#07111F] border-cyan-500/50 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg">{lvl.icon}</span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    Level 0{lvl.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white tracking-wide">
                    {lvl.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{lvl.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* LEVEL 1: ASL ALPHABET (A - Z) */}
        {activeLevel === 1 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-md">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                  Level 1 • The Manual Alphabet
                </span>
                <h2 className="text-xl font-bold text-white mt-1">26 Letters (A – Z)</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Master individual fingerspelling with live on-device joint tracking and audio guidance.
                </p>
              </div>

              {/* Alphabet Mastery Pill */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px]">Alphabet Mastery</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {masteredLetters.length} / 26 ({alphabetMastery}%)
                  </span>
                </div>
                <div className="w-24 h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                    style={{ width: `${alphabetMastery}%` }}
                  />
                </div>
              </div>
            </div>

            {/* A - Z Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {filteredAlphabet.map((item) => {
                const isMastered = masteredLetters.includes(item.letter);
                const isCurrent = item.id === currentAlphabetLessonId;
                const stat = journey.letterStats[item.letter];

                return (
                  <Link
                    key={item.letter}
                    href={`/learn/${item.id}`}
                    className={`p-4 rounded-2xl border transition-all duration-300 group flex flex-col justify-between min-h-[170px] relative overflow-hidden ${
                      isCurrent
                        ? 'bg-[#0B182B] border-cyan-400/60 shadow-[0_0_24px_rgba(56,189,248,0.25)]'
                        : isMastered
                        ? 'bg-[#07111F]/90 border-emerald-500/30 hover:border-emerald-400/50'
                        : 'bg-[#07111F]/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{item.id}
                      </span>
                      {isMastered ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Mastered
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          Current
                        </span>
                      ) : null}
                    </div>

                    {/* Letter Display */}
                    <div className="flex items-baseline justify-between my-2">
                      <span className="text-4xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                        {item.letter}
                      </span>
                      <img
                        src={item.imageUrl}
                        alt={`Sign ${item.letter}`}
                        className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    {/* Bottom audio and practice info */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="truncate max-w-[90px] text-[10px]">
                        {stat && stat.attempts > 0 ? `${stat.accuracy * 100}% acc` : 'Start lesson'}
                      </span>

                      <button
                        onClick={(e) => playQuickAudio(e, item.verbalInstruction, item.letter)}
                        title="Listen to instruction"
                        className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                      >
                        {speakingKey === item.letter ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* LEVEL 2: BASIC WORDS */}
        {activeLevel === 2 && (
          <section className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                Level 2 • High-Frequency Signs
              </span>
              <h2 className="text-xl font-bold text-white mt-1">11 Core Vocabulary Signs</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Everyday greetings, polite requests, gratitude, and fundamental social communication.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {WORD_LESSONS.map((word) => (
                <Link
                  key={word.id}
                  href={`/learn/${word.id}`}
                  className="p-5 rounded-2xl bg-[#07111F]/70 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {word.word}
                      </span>
                      <div className="mt-1">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {word.category}
                        </span>
                      </div>
                    </div>
                    <img
                      src={word.imageUrl || getSignVisualUrl(word.word)}
                      alt={`Sign ${word.word}`}
                      className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10 p-1 opacity-85 group-hover:opacity-100 group-hover:border-amber-400/40 transition-all flex-shrink-0"
                    />
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {word.meaning}. {word.movement}.
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => playQuickAudio(e, word.verbalInstruction, word.word)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Listen</span>
                    </button>

                    <span className="text-cyan-400 font-semibold flex items-center gap-1 text-[11px]">
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* LEVEL 3: COMMON PHRASES */}
        {activeLevel === 3 && (
          <section className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Level 3 • Sentence Construction
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Common Conversational Phrases</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Combine signs with authentic non-manual facial grammar (e.g. WH-questions vs yes/no questions).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PHRASE_LESSONS.map((phrase) => (
                <Link
                  key={phrase.id}
                  href={`/learn/${phrase.id}`}
                  className="p-6 rounded-2xl bg-[#07111F]/70 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {phrase.phrase}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">{phrase.meaning}</p>
                    </div>
                    <img
                      src={getSignVisualUrl(phrase.phrase)}
                      alt={`Sign ${phrase.phrase}`}
                      className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10 p-1 opacity-85 group-hover:opacity-100 group-hover:border-emerald-400/40 transition-all flex-shrink-0"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {phrase.breakdown.map((part, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {part}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => playQuickAudio(e, phrase.verbalInstruction, phrase.phrase)}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Audio Guide</span>
                    </button>

                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <span>Learn Phrase</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* LEVEL 4: NUMBERS */}
        {activeLevel === 4 && (
          <section className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                Level 4 • ASL Counting
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Numbers 1 – 10</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Native counting orientations: note that 1–5 face inward toward your body, while 6–10 face outward.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {NUMBER_LESSONS.map((num) => (
                <Link
                  key={num.id}
                  href={`/learn/${num.id}`}
                  className="p-5 rounded-2xl bg-[#07111F]/70 border border-white/10 hover:border-purple-400/40 transition-all text-center flex flex-col justify-between min-h-[140px] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold font-mono text-white group-hover:text-purple-300 transition-colors">
                      {num.number}
                    </span>
                    <img
                      src={num.imageUrl || getSignVisualUrl(num.number)}
                      alt={`Sign ${num.number}`}
                      className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-white/10 p-0.5 opacity-85 group-hover:opacity-100 group-hover:border-purple-400/40 transition-all flex-shrink-0"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400 font-light mt-1">
                    {num.handshape.split(',')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 mt-2 block">
                    Practice →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* LEVEL 5: PRACTICAL CONVERSATION */}
        {activeLevel === 5 && (
          <section className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">
                Level 5 • Real-World Application
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Practical Dialogue Scenarios</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Immerse yourself in authentic conversational exchanges: introductions, assistance, and polite farewells.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONVERSATION_LESSONS.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/learn/${conv.id}`}
                  className="p-6 rounded-2xl bg-[#07111F]/70 border border-white/10 hover:border-rose-400/40 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                        {conv.title}
                      </h3>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {conv.topic}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light mt-2">
                      {conv.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    {conv.dialogue.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-zinc-500 font-mono text-[10px] w-14 flex-shrink-0">
                          {d.speaker}:
                        </span>
                        <span className="text-zinc-200">{d.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {conv.dialogue.length} conversational turns
                    </span>
                    <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                      <span>Open Dialogue</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
