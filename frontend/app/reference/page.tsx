'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { ASL_CURRICULUM, ASLLessonData } from '@/lib/asl-curriculum';
import {
  BookOpen,
  Search,
  Volume2,
  ArrowRight,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import tts from '@/lib/tts';

export default function ReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<ASLLessonData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filteredLetters = ASL_CURRICULUM.filter(
    (l) =>
      l.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.handshape.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
    } else {
      tts.speak(text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-7xl flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>A–Z ASL GLOSSARY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              Sign Language <span className="font-semibold text-cyan-400">Reference Library</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 font-light">
              Interactive 26-letter index with precise hand configurations, verbal narrations, and instant practice links.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sign or handshape..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* 26 Letters Cards Grid with Card Lift and Subtle Glow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredLetters.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedLesson(item)}
              className="group p-5 rounded-3xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-400/50 hover:bg-[#0A182D] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.8),0_0_24px_rgba(56,189,248,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                    {item.letter}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">#{item.id}</span>
                </div>

                <div className="w-full aspect-square rounded-2xl bg-[#03060c] border border-white/5 flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src={item.imageUrl}
                    alt={`Sign for letter ${item.letter}`}
                    className="w-24 h-24 object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-light mb-3">
                  {item.handshape}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-400 group-hover:text-cyan-300 font-medium">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Detailed Sign Quick-View Panel */}
        {selectedLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
            <div className="max-w-2xl w-full p-8 rounded-3xl bg-[#07111F] border border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  tts.stop();
                  setIsSpeaking(false);
                  setSelectedLesson(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <span className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-3xl flex items-center justify-center">
                  {selectedLesson.letter}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">Letter {selectedLesson.letter} Reference</h2>
                  <p className="text-xs text-zinc-400">{selectedLesson.difficulty.toUpperCase()} • ASL Alphabet</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
                <div className="aspect-square rounded-2xl bg-[#03060c] border border-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedLesson.imageUrl}
                    alt={selectedLesson.letter}
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <strong className="text-cyan-300 block mb-1">Handshape:</strong>
                    <span className="text-zinc-300">{selectedLesson.handshape}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <strong className="text-cyan-300 block mb-1">Fingers:</strong>
                    <span className="text-zinc-300">{selectedLesson.fingerPosition}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <strong className="text-cyan-300 block mb-1">Thumb:</strong>
                    <span className="text-zinc-300">{selectedLesson.thumbPosition}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 mb-6">
                <p className="leading-relaxed mb-2"><strong className="text-white">Instruction:</strong> {selectedLesson.description}</p>
                <p className="text-amber-300 leading-relaxed"><strong className="text-amber-200">Pro Tip:</strong> {selectedLesson.practiceTip}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleSpeak(selectedLesson.verbalInstruction)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'Stop Narration' : 'Listen to Spoken Guide'}</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link
                    href={`/practice?letter=${selectedLesson.letter}`}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                  >
                    Quick Practice
                  </Link>
                  <Link
                    href={`/learn/${selectedLesson.id}`}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors"
                  >
                    Full Guided Lesson
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
