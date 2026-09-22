'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { VisionCamera } from '@/components/VisionCamera';
import { ASL_CURRICULUM, ASLLessonData } from '@/lib/asl-curriculum';
import progressStore from '@/lib/progress-store';
import { SmoothedPrediction } from '@/lib/prediction-smoother';
import {
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flame,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';

type QuizState = 'INTRO' | 'COUNTDOWN' | 'ACTIVE_QUESTION' | 'FEEDBACK' | 'SUMMARY';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('INTRO');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [quizLetters, setQuizLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Active question state
  const [latestPred, setLatestPred] = useState<SmoothedPrediction | null>(null);
  const [questionResult, setQuestionResult] = useState<{
    isCorrect: boolean;
    detectedSign: string;
    confidence: number;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(10);

  const currentTarget = quizLetters[currentIndex] || 'A';

  const startCountdown = () => {
    setQuizState('COUNTDOWN');
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuizState('ACTIVE_QUESTION');
          setTimeRemaining(10);
          setLatestPred(null);
          setQuestionResult(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const advanceQuestion = (currentScore: number) => {
    if (currentIndex + 1 < quizLetters.length) {
      setCurrentIndex((prev) => prev + 1);
      startCountdown();
    } else {
      setQuizState('SUMMARY');
      progressStore.recordQuizResult(currentScore, quizLetters.length, 'interactive');
    }
  };

  const handleQuestionTimeout = () => {
    setStreak(0);
    setQuestionResult({
      isCorrect: false,
      detectedSign: latestPred?.sign || 'None',
      confidence: latestPred?.confidence || 0,
    });
    setQuizState('FEEDBACK');
    progressStore.recordSignAttempt(currentTarget, false);

    setTimeout(() => {
      advanceQuestion(score);
    }, 2200);
  };

  // Timer for active question
  useEffect(() => {
    let timer: any;
    if (quizState === 'ACTIVE_QUESTION') {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuestionTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, currentIndex, currentTarget, score, latestPred]);

  const startQuiz = () => {
    // Pick random distinct letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, questionCount);

    setQuizLetters(chosen);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    startCountdown();
  };

  const handleMatch = (isMatch: boolean, pred: SmoothedPrediction) => {
    if (quizState !== 'ACTIVE_QUESTION') return;
    setLatestPred(pred);

    if (isMatch) {
      // User signed the target correctly!
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      setQuestionResult({
        isCorrect: true,
        detectedSign: pred.sign,
        confidence: pred.confidence,
      });
      setQuizState('FEEDBACK');

      progressStore.recordSignAttempt(currentTarget, true);

      // Advance after brief celebration
      setTimeout(() => {
        advanceQuestion(newScore);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col justify-center">
        {/* State 1: Intro Setup */}
        {quizState === 'INTRO' && (
          <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(56,189,248,0.25)]">
              <Award className="w-8 h-8" />
            </div>

            <h1 className="text-3xl font-light text-white mb-2">
              Sign Language <span className="font-semibold text-cyan-400">Quiz</span>
            </h1>
            <p className="text-sm text-zinc-400 font-light max-w-md mx-auto mb-8">
              The camera will present target letters one by one. Sign each letter clearly before the timer runs out!
            </p>

            <div className="mb-8">
              <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-3">
                Select Number of Questions:
              </label>
              <div className="flex justify-center gap-3">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                      questionCount === cnt
                        ? 'bg-cyan-500 text-black shadow-[0_0_16px_rgba(56,189,248,0.4)]'
                        : 'bg-white/[0.04] text-zinc-300 border border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="cta-glass px-10 py-3.5 text-sm font-semibold tracking-wide text-white uppercase"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* State 2: 3-2-1 Countdown */}
        {quizState === 'COUNTDOWN' && (
          <div className="text-center animate-fade-in">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 block">
              Question {currentIndex + 1} of {quizLetters.length}
            </span>
            <div className="text-8xl sm:text-9xl font-bold font-mono text-cyan-400 animate-pulse my-6">
              {countdown}
            </div>
            <p className="text-base text-zinc-300 font-light">Get your hand ready in the camera frame...</p>
          </div>
        )}

        {/* State 3 & 4: Active Question & Feedback */}
        {(quizState === 'ACTIVE_QUESTION' || quizState === 'FEEDBACK') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Target Prompt */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6 pb-3 border-b border-white/10">
                  <span>Question {currentIndex + 1} of {quizLetters.length}</span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>Streak: {streak}</span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
                    Show the sign for:
                  </span>
                  <div className="text-7xl font-bold font-mono text-white tracking-tight mb-2">
                    {currentTarget}
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    Hold the handshape steady in front of the lens
                  </p>
                </div>

                {/* Remaining Time Bar */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Time left: {timeRemaining}s</span>
                  </div>
                  <div className="w-28 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeRemaining / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Alert Overlay */}
              {questionResult && (
                <div
                  className={`p-5 rounded-3xl border animate-fade-in ${
                    questionResult.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.3)]'
                      : 'bg-red-950/80 border-red-500/50 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {questionResult.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {questionResult.isCorrect ? `Correct! That's ${currentTarget}` : `Time's Up for ${currentTarget}`}
                      </h4>
                      <p className="text-xs text-zinc-300">
                        Detected: {questionResult.detectedSign} ({Math.round(questionResult.confidence * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Camera */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
                <VisionCamera
                  targetLetter={currentTarget}
                  onMatch={handleMatch}
                  width={600}
                  height={450}
                  autoStart={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* State 5: Quiz Summary */}
        {quizState === 'SUMMARY' && (
          <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-[#07111F]/90 border border-white/10 backdrop-blur-2xl shadow-2xl text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#38bdf8] via-[#06b6d4] to-[#fbbf24] p-[2px] mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
              <div className="w-full h-full rounded-2xl bg-[#02060f] flex items-center justify-center">
                <Award className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <h2 className="text-3xl font-light text-white mb-1">Quiz Completed!</h2>
            <p className="text-xs text-zinc-400 mb-8 font-light">
              Your results have been securely recorded in your local learning journey.
            </p>

            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-8">
              <div>
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {score}/{quizLetters.length}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {Math.round((score / quizLetters.length) * 100)}%
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {bestStreak}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Best Streak</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={startQuiz}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              <Link
                href="/learn"
                className="px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all flex items-center gap-2"
              >
                <span>Continue Lessons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
