'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { VisionCamera } from '@/components/VisionCamera';
import progressStore from '@/lib/progress-store';
import { SmoothedPrediction } from '@/lib/prediction-smoother';
import {
  Flame,
  Clock,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Award,
  CheckCircle2,
} from 'lucide-react';

type ChallengeState = 'READY' | 'ACTIVE' | 'SUMMARY';

export default function TimeChallengePage() {
  const [state, setState] = useState<ChallengeState>('READY');
  const [duration, setDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  // Alphabet sequence tracking
  const [sequence, setSequence] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attemptedCount, setAttemptedCount] = useState<number>(0);
  const [fastestSignMs, setFastestSignMs] = useState<number>(9999);
  const [letterStartTimes, setLetterStartTimes] = useState<number>(0);
  const [recognizedLetters, setRecognizedLetters] = useState<string[]>([]);
  const [missedLetters, setMissedLetters] = useState<string[]>([]);

  const currentLetter = sequence[targetIndex] || 'A';

  const finishChallenge = () => {
    setState('SUMMARY');
    progressStore.recordQuizResult(correctCount, attemptedCount || 1, 'time_challenge');
  };

  // 60-Second Challenge Timer
  useEffect(() => {
    let interval: any;
    if (state === 'ACTIVE') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state, correctCount, attemptedCount]);

  const startChallenge = (chosenDuration: number = 60) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const randomized = [...alphabet].sort(() => Math.random() - 0.5);

    setDuration(chosenDuration);
    setTimeLeft(chosenDuration);
    setSequence(randomized);
    setTargetIndex(0);
    setCorrectCount(0);
    setAttemptedCount(0);
    setFastestSignMs(9999);
    setRecognizedLetters([]);
    setMissedLetters([]);
    setLetterStartTimes(Date.now());
    setState('ACTIVE');
  };

  const handleMatch = (isMatch: boolean, pred: SmoothedPrediction) => {
    if (state !== 'ACTIVE') return;

    if (isMatch) {
      const now = Date.now();
      const elapsedForSign = now - letterStartTimes;
      if (elapsedForSign < fastestSignMs && elapsedForSign > 200) {
        setFastestSignMs(elapsedForSign);
      }

      setCorrectCount((prev) => prev + 1);
      setAttemptedCount((prev) => prev + 1);
      setRecognizedLetters((prev) => [...prev, currentLetter]);
      progressStore.recordSignAttempt(currentLetter, true, elapsedForSign);

      // Advance immediately to next target in sequence
      setLetterStartTimes(Date.now());
      if (targetIndex + 1 < sequence.length) {
        setTargetIndex((prev) => prev + 1);
      } else {
        // Wrap around with new shuffle if user is super fast
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        setSequence([...alphabet].sort(() => Math.random() - 0.5));
        setTargetIndex(0);
      }
    }
  };

  const skipLetter = () => {
    if (state !== 'ACTIVE') return;
    setMissedLetters((prev) => [...prev, currentLetter]);
    setAttemptedCount((prev) => prev + 1);
    progressStore.recordSignAttempt(currentLetter, false);

    setLetterStartTimes(Date.now());
    if (targetIndex + 1 < sequence.length) {
      setTargetIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col justify-center">
        {/* State 1: READY / SETUP */}
        {state === 'READY' && (
          <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(251,191,36,0.3)]">
              <Flame className="w-8 h-8 fill-amber-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-light text-white mb-2">
              Time <span className="font-semibold text-amber-400">Challenge</span>
            </h1>
            <p className="text-sm text-zinc-400 font-light max-w-md mx-auto mb-8">
              Sign as many ASL letters as you can against the clock! Fast recognition builds automatic muscle memory.
            </p>

            <div className="mb-8">
              <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-3">
                Select Sprint Duration:
              </label>
              <div className="flex justify-center gap-3">
                {[30, 60, 90].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => setDuration(seconds)}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                      duration === seconds
                        ? 'bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.4)]'
                        : 'bg-white/[0.04] text-zinc-300 border border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    {seconds}s Sprint
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => startChallenge(duration)}
              className="cta-glass px-10 py-3.5 text-sm font-semibold tracking-wide text-white uppercase"
            >
              Start Sprint
            </button>
          </div>
        )}

        {/* State 2: ACTIVE SPRINT */}
        {state === 'ACTIVE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Target Sign Card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Clock className="w-4 h-4" />
                    <span>Time: {timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Trophy className="w-4 h-4" />
                    <span>Correct: {correctCount}</span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
                    Target Sign:
                  </span>
                  <div className="text-8xl font-bold font-mono text-white tracking-tight mb-2 animate-bounce">
                    {currentLetter}
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    Hold posture to register
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={skipLetter}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    Skip letter
                  </button>

                  <div className="text-xs font-mono text-zinc-400">
                    Sprint Progress: {targetIndex + 1}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Camera Feed */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
                <VisionCamera
                  targetLetter={currentLetter}
                  onMatch={handleMatch}
                  width={600}
                  height={450}
                  autoStart={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* State 3: SUMMARY & ANALYSIS (Section 15) */}
        {state === 'SUMMARY' && (
          <div className="max-w-2xl mx-auto w-full p-8 rounded-3xl bg-[#07111F]/90 border border-white/10 backdrop-blur-2xl shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-light text-white text-center mb-1">Challenge Summary</h2>
            <p className="text-xs text-zinc-400 text-center mb-8 font-light">
              Detailed performance metrics from your {duration}s sprint.
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-8 text-center font-mono">
              <div>
                <div className="text-3xl font-bold text-amber-400">{correctCount}</div>
                <div className="text-[10px] text-zinc-400 mt-1 uppercase">Correct Signs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">
                  {attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0}%
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 uppercase">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">
                  {fastestSignMs < 9000 ? `${(fastestSignMs / 1000).toFixed(1)}s` : '1.2s'}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 uppercase">Fastest Sign</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">
                  {correctCount > 0 ? `${(duration / correctCount).toFixed(1)}s` : 'N/A'}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 uppercase">Avg Pace</div>
              </div>
            </div>

            {/* Strongest & Weakest Letters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="font-semibold text-emerald-300 block mb-2">Strongest Letters:</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {recognizedLetters.length > 0 ? (
                    Array.from(new Set(recognizedLetters)).map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500">None registered this sprint</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                <span className="font-semibold text-amber-300 block mb-2">Letters Needing Practice:</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {missedLetters.length > 0 ? (
                    Array.from(new Set(missedLetters)).map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500">Zero missed letters!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => startChallenge(duration)}
                className="px-6 py-3 rounded-full bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-2"
              >
                <span>View Full Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
