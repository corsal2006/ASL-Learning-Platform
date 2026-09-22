'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { VisionCamera } from '@/components/VisionCamera';
import { SignReferenceVisual } from '@/components/SignReferenceVisual';
import { ASL_CURRICULUM } from '@/lib/asl-curriculum';
import progressStore from '@/lib/progress-store';
import { SmoothedPrediction } from '@/lib/prediction-smoother';
import {
  Sparkles,
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  Zap,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { getSignVisualUrl } from '@/lib/sign-assets';

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialLetter = searchParams.get('letter') || searchParams.get('lesson') || 'A';

  const [targetLetter, setTargetLetter] = useState<string>(
    initialLetter.length === 1 ? initialLetter.toUpperCase() : 'A'
  );
  const [currentPred, setCurrentPred] = useState<SmoothedPrediction | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const activeLesson = ASL_CURRICULUM.find((l) => l.letter === targetLetter);

  const handlePrediction = useCallback((pred: SmoothedPrediction) => {
    setCurrentPred(pred);
  }, []);

  const handleMatch = useCallback((isMatch: boolean, pred: SmoothedPrediction) => {
    setCurrentPred(pred);
    if (isMatch) {
      setIsSuccess((prev) => {
        if (!prev) {
          setSessionScore((s) => s + 1);
          setConsecutiveCorrect((c) => c + 1);
          progressStore.recordSignAttempt(targetLetter, true);
          return true;
        }
        return prev;
      });
    } else {
      setIsSuccess(false);
    }
  }, [targetLetter]);

  const handleSelectNextLetter = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currIndex = alphabet.indexOf(targetLetter);
    const nextLetter = alphabet[(currIndex + 1) % 26];
    setTargetLetter(nextLetter);
    setIsSuccess(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>REAL-TIME COMPUTER VISION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Interactive Practice Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
            Test your sign hand posture with on-device MediaPipe 3D tracking and neural verification.
          </p>
        </div>

        {/* Session Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#07111F]/80 border border-white/10 font-mono text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Session: {sessionScore} correct</span>
          </div>
          {consecutiveCorrect > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-300">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{consecutiveCorrect} streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Practice Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vision Camera Frame */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <h3 className="text-sm font-semibold text-white">Live Camera Practice</h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Hold for 2 seconds
              </span>
            </div>

            <VisionCamera
              targetLetter={targetLetter}
              targetImageUrl={activeLesson?.imageUrl || getSignVisualUrl(targetLetter)}
              onMatch={handleMatch}
              onPrediction={handlePrediction}
              width={640}
              height={480}
              autoStart={false}
            />

            {/* Match Banner */}
            {isSuccess && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between shadow-[0_0_24px_rgba(16,185,129,0.3)] animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Perfect Form!</h4>
                    <p className="text-xs text-emerald-300">Sign {targetLetter} successfully verified.</p>
                  </div>
                </div>
                <button
                  onClick={handleSelectNextLetter}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                >
                  <span>Next Sign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sign Selector & Anatomical Reference */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Target Sign Selector Grid */}
          <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-3">Choose Target Sign:</h3>
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    setTargetLetter(char);
                    setIsSuccess(false);
                  }}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-semibold transition-all ${
                    targetLetter === char
                      ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/5'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Card for Active Letter */}
          {activeLesson && (
            <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Visual Guide</span>
                  <h3 className="text-lg font-bold text-white">Letter {activeLesson.letter}</h3>
                </div>
                <Link
                  href={`/learn/${activeLesson.id}`}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Full Lesson</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mb-4">
                <SignReferenceVisual
                  sign={activeLesson.letter}
                  title={activeLesson.title}
                  description={activeLesson.description}
                  imageUrl={activeLesson.imageUrl}
                  size="lg"
                />
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <p className="leading-relaxed"><strong className="text-white">Posture:</strong> {activeLesson.handshape}</p>
                <p className="leading-relaxed"><strong className="text-white">Tip:</strong> {activeLesson.practiceTip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />
      <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading Practice Studio...</div>}>
        <PracticeContent />
      </Suspense>
    </div>
  );
}
