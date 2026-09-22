'use client';

import React, { useState, useEffect, useCallback, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { VisionCamera } from '@/components/VisionCamera';
import { SignReferenceVisual } from '@/components/SignReferenceVisual';
import {
  getUnifiedLesson,
  UnifiedLesson,
} from '@/lib/asl-curriculum';
import progressStore from '@/lib/progress-store';
import { speechService } from '@/lib/speechService';
import { SmoothedPrediction } from '@/lib/prediction-smoother';
import { useLuna } from '@/contexts/LunaContext';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award,
  Hand,
  Check,
  Zap,
} from 'lucide-react';

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const rawId = parseInt(resolvedParams.id, 10) || 1;

  const { setLearningContext } = useLuna();

  // Active lesson managed in React state to ensure <VisionCamera /> stays continuously mounted across Next/Prev navigation
  const [lesson, setLesson] = useState<UnifiedLesson>(
    () => getUnifiedLesson(rawId) || getUnifiedLesson(1)!
  );

  // Audio / Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  // Vision Camera Practice State
  const [latestPred, setLatestPred] = useState<SmoothedPrediction | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>(
    'Hold your sign steadily inside the guide box.'
  );
  const [attemptCount, setAttemptCount] = useState(0);
  const [targetTransitionText, setTargetTransitionText] = useState<string | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize when initial param loads
  useEffect(() => {
    const found = getUnifiedLesson(rawId) || getUnifiedLesson(1)!;
    setLesson(found);
    setIsSuccess(false);
    setLatestPred(null);
    setFeedbackMessage('Hold your sign steadily inside the guide box.');
    speechService.stop();
    setIsPlayingAudio(false);

    setLearningContext({
      lesson: found.title,
      currentSign: found.sign,
      stage: 'See It & Understand',
      prediction: undefined,
      confidence: undefined,
    });
  }, [rawId, setLearningContext]);

  // Support browser Back/Forward without full reload
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/learn\/(\d+)/);
      if (match) {
        const id = parseInt(match[1], 10);
        const found = getUnifiedLesson(id);
        if (found) {
          speechService.stop();
          setIsPlayingAudio(false);
          setIsSuccess(false);
          setLatestPred(null);
          setFeedbackMessage('Hold your sign steadily inside the guide box.');
          setLesson(found);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to speech synthesis state
  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return () => {
      speechService.stop();
      unsub();
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Preload current and next lesson sign visual assets (Requirement 28)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lesson.imageUrl) {
      const img = new Image();
      img.src = lesson.imageUrl;
    }
    if (lesson.nextId) {
      const nextLesson = getUnifiedLesson(lesson.nextId);
      if (nextLesson?.imageUrl) {
        const nextImg = new Image();
        nextImg.src = nextLesson.imageUrl;
      }
    }
  }, [lesson.id, lesson.imageUrl, lesson.nextId]);

  // Instant In-Place SPA Navigation (Keeps camera stream, MediaPipe, and ONNX intact)
  const goToLesson = useCallback(
    (targetId: number) => {
      const next = getUnifiedLesson(targetId);
      if (!next) return;

      // Stop speech asynchronously without blocking UI
      speechService.stop();
      setIsPlayingAudio(false);

      // Reset recognition feedback states
      setIsSuccess(false);
      setLatestPred(null);
      setFeedbackMessage('Hold your sign steadily inside the guide box.');

      // Update active lesson state in-place
      setLesson(next);

      // Update URL silently in browser history (SPA transition)
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `/learn/${next.id}`);
      }

      // Show brief transition toast
      setTargetTransitionText(`Target updated → ${next.sign}`);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setTargetTransitionText(null);
      }, 1800);

      // Update Luna context
      setLearningContext({
        lesson: next.title,
        currentSign: next.sign,
        stage: 'Practice',
        prediction: undefined,
        confidence: undefined,
      });
    },
    [setLearningContext]
  );

  const handleNextLesson = () => {
    if (lesson.nextId) {
      goToLesson(lesson.nextId);
    } else {
      router.push('/journey');
    }
  };

  const handlePrevLesson = () => {
    if (lesson.prevId) {
      goToLesson(lesson.prevId);
    }
  };

  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      speechService.stop();
    } else {
      speechService.setRate(speechSpeed);
      speechService.speak(lesson.verbalInstruction, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Prediction & Match handler from VisionCamera
  const handleMatch = useCallback(
    (isMatch: boolean, pred: SmoothedPrediction) => {
      setLatestPred(pred);
      setAttemptCount((prev) => prev + 1);

      setLearningContext({
        prediction: pred.sign,
        confidence: pred.confidence,
        stage: 'Try It',
      });

      const targetSign = (lesson.targetRecognition || lesson.sign).toUpperCase();
      const detectedSign = pred.sign.toUpperCase();

      if (isMatch) {
        setIsSuccess(true);
        setFeedbackMessage(`✓ Perfect! Clean ${lesson.sign} handshape recognized.`);
        progressStore.recordSignAttempt(lesson.sign, true);
      } else if (detectedSign === targetSign) {
        setFeedbackMessage('Great handshape! Hold steady for a moment to confirm.');
      } else if (pred.confidence > 0.55) {
        setFeedbackMessage(
          `Detected ${pred.sign} (${Math.round(pred.confidence * 100)}%). You are close. Check finger positions for target ${lesson.sign}.`
        );
      } else {
        setFeedbackMessage('Keep your hand steady at chest height.');
      }
    },
    [lesson, setLearningContext]
  );

  const handlePrediction = useCallback((pred: SmoothedPrediction) => {
    setLatestPred(pred);
  }, []);

  const handleHandDetected = useCallback((detected: boolean) => {
    setHandDetected(detected);
    if (!detected) {
      setFeedbackMessage('Show one hand inside the guide to begin.');
    }
  }, []);

  // 3 readable small step instructions
  const stepsList =
    lesson.steps && lesson.steps.length > 0
      ? lesson.steps.slice(0, 3)
      : [
          'Close your four fingers into a fist.',
          'Keep your thumb alongside index finger.',
          'Keep your wrist relaxed and held upright.',
        ];

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans">
      <Navigation />

      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl flex-1">
        {/* ========================================================
            LESSON HEADER
            Curriculum / Lesson X of 26       [Sign]   Next →
           ======================================================== */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Curriculum</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {lesson.badge}
            </span>

            {/* Target transition toast badge */}
            {targetTransitionText && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono animate-fade-in">
                {targetTransitionText}
              </span>
            )}
          </div>

          {/* Prev / Next Sign Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLesson}
              disabled={!lesson.prevId}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-xs text-zinc-300 flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="px-3.5 py-1 rounded-xl bg-white/[0.08] border border-white/10 font-mono text-xs font-bold text-white shadow-inner">
              {lesson.sign}
            </span>

            <button
              onClick={handleNextLesson}
              className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all shadow-md active:scale-95"
            >
              <span>{lesson.nextId ? 'Next' : 'Finish'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ========================================================
            TWO-COLUMN LEARNING WORKSPACE
            LEFT:  LIVE CAMERA (~58-60% width on desktop)
            RIGHT: LESSON STEPS (~40-42% width on desktop)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ====================================================
              LEFT COLUMN: LIVE CAMERA WORKSTATION (PRIMARY)
             ==================================================== */}
          <section
            aria-label="Live Camera Workstation"
            className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-20"
          >
            <div className="p-4 sm:p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Background gradient accent */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Workstation Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                    Your Turn — Mirrored Camera
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-400 text-[11px]">Target Sign:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-2">
                    {lesson.imageUrl && (
                      <img
                        src={lesson.imageUrl}
                        alt={`Sign ${lesson.sign}`}
                        className="w-5 h-5 object-contain rounded"
                      />
                    )}
                    <span>{lesson.targetRecognition || lesson.sign}</span>
                  </span>
                </div>
              </div>

              {/* PERSISTENT LIVE CAMERA FEED — Auto-starts & stays mounted across lessons */}
              <VisionCamera
                targetLetter={lesson.targetRecognition || lesson.sign}
                targetImageUrl={lesson.imageUrl}
                onMatch={handleMatch}
                onPrediction={handlePrediction}
                onHandDetected={handleHandDetected}
                width={640}
                height={480}
                autoStart={true}
              />

              {/* TELEMETRY & RECOGNITION STATUS BAR */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Target</span>
                    <span className="text-lg font-bold text-white mt-0.5">{lesson.sign}</span>
                  </div>
                  {lesson.imageUrl && (
                    <img
                      src={lesson.imageUrl}
                      alt={`Sign ${lesson.sign}`}
                      className="w-9 h-9 object-contain rounded-xl bg-black/40 border border-white/10 p-0.5"
                    />
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Detected</span>
                  <span className="text-lg font-bold text-cyan-300 mt-0.5">
                    {latestPred?.sign || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Confidence</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5">
                    {latestPred ? `${Math.round(latestPred.confidence * 100)}%` : '—'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Hand State</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        handDetected ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[11px] font-medium text-zinc-200 truncate">
                      {handDetected
                        ? latestPred?.detectedHand && latestPred.detectedHand !== 'Unknown'
                          ? `✓ ${latestPred.detectedHand} Hand`
                          : '✓ Detected'
                        : 'Waiting...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* REAL-TIME GUIDED CORRECTION CARD */}
              <div className="mt-3">
                <div
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isSuccess
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.25)]'
                      : 'bg-black/50 border-white/10 text-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-bounce" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-0.5">
                        {isSuccess ? `✓ ${lesson.sign} Recognized!` : 'Recognition Guidance'}
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-300">{feedbackMessage}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUCCESS & ADVANCE ACTION BAR */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {isSuccess ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>✓ {lesson.sign} Mastered</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Hold hand steady for confirmation
                  </div>
                )}

                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setLatestPred(null);
                      setFeedbackMessage('Hold your sign steadily inside the guide box.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <span>{lesson.nextId ? 'Next Sign →' : 'Finish Course'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              RIGHT COLUMN: LESSON STEPS (INDEPENDENTLY SCROLLABLE)
             ==================================================== */}
          <section
            aria-label="Lesson Instructions and Steps"
            className="lg:col-span-5 flex flex-col gap-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-1"
          >
            {/* ----------------------------------------------------
                ① SEE IT — Sign Visual Demonstration & Interactive Reference
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    01 See It — Official ASL Sign
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Level {lesson.levelNumber}
                </span>
              </div>

              {/* Large Interactive ASL Sign Reference */}
              <div className="flex flex-col items-center my-2">
                <SignReferenceVisual
                  sign={lesson.targetRecognition || lesson.sign}
                  title={lesson.title}
                  description={lesson.description}
                  imageUrl={lesson.imageUrl}
                  size="lg"
                />

                <div className="w-full mt-4 text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {lesson.title}
                    </h2>
                    {lesson.subtitle && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                        {lesson.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mt-1.5">
                    {lesson.description}
                  </p>

                  {/* Visual Learning Loop Comparison Banner */}
                  <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <span>●</span>
                      <span>Study Reference</span>
                    </span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-emerald-400 font-medium">
                      Match In Mirrored Camera
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                ② UNDERSTAND — Step-by-Step Anatomical Instructions
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    02 Understand
                  </span>
                </div>
                <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              </div>

              {/* 3 Small Readable Steps (01, 02, 03) */}
              <div className="space-y-2 mb-4">
                {stepsList.map((stepText, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3"
                  >
                    <span className="text-xs font-mono font-bold text-cyan-400 flex-shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                      {stepText.replace(/^\d+\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Anatomical Details Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {lesson.handshape && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-semibold text-cyan-300 block mb-0.5 text-[11px]">
                      Handshape:
                    </span>
                    <span className="text-zinc-300 text-[11px]">{lesson.handshape}</span>
                  </div>
                )}
                {lesson.movement && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-semibold text-cyan-300 block mb-0.5 text-[11px]">
                      Movement:
                    </span>
                    <span className="text-zinc-300 text-[11px]">{lesson.movement}</span>
                  </div>
                )}
                {lesson.orientation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-semibold text-cyan-300 block mb-0.5 text-[11px]">
                      Orientation:
                    </span>
                    <span className="text-zinc-300 text-[11px]">{lesson.orientation}</span>
                  </div>
                )}
                {lesson.breakdown && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-semibold text-cyan-300 block mb-0.5 text-[11px]">
                      Signs Breakdown:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lesson.breakdown.map((b, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-mono"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ----------------------------------------------------
                ③ WATCH — Tutor Guidance & Common Traps
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                  03 Watch (Tips & Traps)
                </span>
              </div>

              <div className="space-y-3">
                {lesson.mistakes && lesson.mistakes.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/25 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Common Mistakes</span>
                    </div>
                    <ul className="space-y-1 text-zinc-300 list-disc list-inside text-[11px]">
                      {lesson.mistakes.map((mistake, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lesson.tips && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/25 border border-cyan-500/25 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tutor Pro Tip</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">{lesson.tips}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ----------------------------------------------------
                ④ LISTEN — Female Voice Tutor
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center">
                  4
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                  04 Listen (Voice Tutor)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleSpeak}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingAudio
                        ? 'bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.6)] animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isPlayingAudio ? 'Pause Voice' : 'Listen to Verbal Explanation'}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>Female Tutor Voice</span>
                      {isPlayingAudio && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      {speechService.getAvailableVoiceName()}
                    </p>
                  </div>
                </div>

                {/* Speed Controls: 0.75x, 1x, 1.25x */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-zinc-500 text-[10px]">Speed:</span>
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setSpeechSpeed(speed);
                        speechService.setRate(speed);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                        speechSpeed === speed
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                ⑤ TRY IT — Practice Checklist
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    5
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    05 Try It (Practice)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  Target: {lesson.targetRecognition || lesson.sign}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-[11px]">Center hand inside the live camera frame</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-[11px]">Hold sign steadily for confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-[11px]">Target recognition triggers automatically</span>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                ⑥ GUIDED CORRECTION — Status & Matching Rules
               ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#07111F]/80 border border-white/10 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center">
                  6
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                  06 Guided Correction
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-zinc-400">Target Sign:</span>
                  <span className="font-mono font-bold text-white">{lesson.sign}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-zinc-400">Current Sign:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {latestPred?.sign || 'Searching...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">Mastery Status:</span>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      isSuccess ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isSuccess ? '✓ Recognized' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
