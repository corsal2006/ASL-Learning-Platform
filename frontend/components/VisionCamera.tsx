'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { initializeHands, startCamera, drawHands, drawGuideBox, MediaPipeResults } from '@/lib/mediapipe';
import onnxInference from '@/lib/onnx-inference';
import { PredictionSmoother, SmoothedPrediction } from '@/lib/prediction-smoother';
import { normalizeHandLandmarks } from '@/lib/hand-preprocessor';
import { Camera, AlertCircle, RefreshCw, Zap, CheckCircle2, Sparkles, Play, Pause, Hand } from 'lucide-react';

export type VisionState =
  | 'OFF'
  | 'STARTING'
  | 'WAITING'
  | 'TRACKING'
  | 'ANALYZING'
  | 'RECOGNIZED'
  | 'LOW CONFIDENCE'
  | 'ERROR';

export type LoadingPhase = 'idle' | 'loading-model' | 'initializing-hands' | 'camera-ready' | 'ready';

interface VisionCameraProps {
  targetLetter?: string | null;
  targetImageUrl?: string | null;
  onPrediction?: (pred: SmoothedPrediction) => void;
  onMatch?: (isMatch: boolean, pred: SmoothedPrediction) => void;
  onHandDetected?: (detected: boolean) => void;
  onStatusChange?: (status: VisionState) => void;
  onHandednessChange?: (hand: 'Left' | 'Right' | 'Unknown') => void;
  width?: number;
  height?: number;
  showScannerOverlay?: boolean;
  autoStart?: boolean;
  className?: string;
}

export function VisionCamera({
  targetLetter,
  targetImageUrl,
  onPrediction,
  onMatch,
  onHandDetected,
  onStatusChange,
  onHandednessChange,
  width = 640,
  height = 480,
  showScannerOverlay = true,
  autoStart = true,
  className = '',
}: VisionCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Decouple dynamic props & callbacks via stable refs
  const onPredictionRef = useRef(onPrediction);
  const onMatchRef = useRef(onMatch);
  const onHandDetectedRef = useRef(onHandDetected);
  const onStatusChangeRef = useRef(onStatusChange);
  const onHandednessChangeRef = useRef(onHandednessChange);
  const targetLetterRef = useRef(targetLetter);
  const widthRef = useRef(width);
  const heightRef = useRef(height);

  useEffect(() => {
    onPredictionRef.current = onPrediction;
    onMatchRef.current = onMatch;
    onHandDetectedRef.current = onHandDetected;
    onStatusChangeRef.current = onStatusChange;
    onHandednessChangeRef.current = onHandednessChange;
    targetLetterRef.current = targetLetter;
    widthRef.current = width;
    heightRef.current = height;
  });

  // State
  const [isActive, setIsActive] = useState(autoStart);
  const [status, setStatus] = useState<VisionState>('OFF');
  const statusRef = useRef<VisionState>('OFF');

  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('idle');
  const [loadingText, setLoadingText] = useState<string>('Initializing camera...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelError, setModelError] = useState<boolean>(false);
  const [currentPred, setCurrentPred] = useState<SmoothedPrediction | null>(null);
  const currentPredRef = useRef<SmoothedPrediction | null>(null);

  const [detectedHand, setDetectedHand] = useState<'Left' | 'Right' | 'Unknown'>('Unknown');
  const detectedHandRef = useRef<'Left' | 'Right' | 'Unknown'>('Unknown');

  const [fps, setFps] = useState<number>(30);
  const [handsCount, setHandsCount] = useState<number>(0);
  const handsCountRef = useRef<number>(0);

  const [positionFeedback, setPositionFeedback] = useState<string | null>(null);
  const positionFeedbackRef = useRef<string | null>(null);

  // Recognition & performance tracking refs
  const smootherRef = useRef<PredictionSmoother>(new PredictionSmoother(7, 4));
  const isProcessingRef = useRef<boolean>(false);
  const lastInferenceTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(Date.now());
  const lastUiUpdateRef = useRef<number>(0);
  const consecutiveMatchCountRef = useRef<number>(0);
  const prevTargetRef = useRef<string | null | undefined>(targetLetter);

  // Mount tracking
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // When target letter changes: reset recognition buffer WITHOUT resetting camera
  useEffect(() => {
    if (targetLetter !== prevTargetRef.current) {
      prevTargetRef.current = targetLetter;
      smootherRef.current.reset();
      currentPredRef.current = null;
      setCurrentPred(null);
      consecutiveMatchCountRef.current = 0;
      if (statusRef.current !== 'OFF' && statusRef.current !== 'STARTING') {
        statusRef.current = 'WAITING';
        setStatus('WAITING');
      }
    }
  }, [targetLetter]);

  // Sync autoStart prop with isActive
  useEffect(() => {
    if (autoStart && !isActive && !streamRef.current) {
      setIsActive(true);
    }
  }, [autoStart]);

  // Load ONNX Model once on mount
  useEffect(() => {
    (async () => {
      try {
        setLoadingPhase('loading-model');
        setLoadingText('Loading recognition model...');
        await onnxInference.loadModel();
        if (mountedRef.current) {
          setModelError(false);
          setLoadingPhase('ready');
          setLoadingText('Ready');
        }
      } catch (err) {
        console.warn('Failed to load ONNX model:', err);
        if (mountedRef.current) {
          setModelError(true);
          setLoadingText('Vision model fallback');
        }
      }
    })();
  }, []);

  // Stable high-speed frame processing callback (~30 FPS)
  // CRITICAL: Does NOT call setState on every frame. Uses refs to prevent re-render bottlenecks.
  const processFrameResults = useCallback(async (results: MediaPipeResults) => {
    if (!mountedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentW = widthRef.current;
    const currentH = heightRef.current;
    const now = Date.now();

    // 1. Calculate Real FPS every second
    frameCountRef.current++;
    if (now - lastFpsTimeRef.current >= 1000) {
      const computedFps = frameCountRef.current;
      setFps(computedFps);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }

    const handLandmarks = results.multiHandLandmarks || [];
    const count = handLandmarks.length;

    // Only update handsCount state when it actually changes
    if (count !== handsCountRef.current) {
      const prevWasZero = handsCountRef.current === 0;
      handsCountRef.current = count;
      setHandsCount(count);
      if ((count > 0) !== (!prevWasZero)) {
        onHandDetectedRef.current?.(count > 0);
      }
    }

    // CASE 1: No hand detected — Draw waiting guide, reset smoother, keep stream alive
    if (count === 0) {
      drawGuideBox(ctx, currentW, currentH, 'waiting');
      smootherRef.current.reset();
      detectedHandRef.current = 'Unknown';
      setDetectedHand('Unknown');

      if (positionFeedbackRef.current !== null) {
        positionFeedbackRef.current = null;
        setPositionFeedback(null);
      }

      if (statusRef.current !== 'WAITING') {
        statusRef.current = 'WAITING';
        setStatus('WAITING');
        onStatusChangeRef.current?.('WAITING');
      }

      if (currentPredRef.current !== null && now - lastUiUpdateRef.current > 300) {
        currentPredRef.current = null;
        setCurrentPred(null);
        lastUiUpdateRef.current = now;
      }
      return;
    }

    // CASE 2: Multi-hand check (Requirement 23: ONE HAND MODE)
    if (count > 1) {
      drawHands(ctx, results, currentW, currentH);
      drawGuideBox(ctx, currentW, currentH, 'warning');
      smootherRef.current.reset();
      const multiNotice = 'Show one hand';
      if (positionFeedbackRef.current !== multiNotice) {
        positionFeedbackRef.current = multiNotice;
        setPositionFeedback(multiNotice);
      }
      return;
    }

    // CASE 3: Single hand detected — Preprocess with unified Canonical Preprocessor
    const primaryHand = handLandmarks[0];
    const normResult = normalizeHandLandmarks(primaryHand, results.multiHandedness);

    // Update detected handedness state & callback
    if (normResult.detectedHand !== detectedHandRef.current) {
      detectedHandRef.current = normResult.detectedHand;
      setDetectedHand(normResult.detectedHand);
      onHandednessChangeRef.current?.(normResult.detectedHand);
    }

    // Guidance feedback (distance, centering, framing)
    const posFeedback = normResult.guidanceFeedback;
    const guideState: 'waiting' | 'positioned' | 'warning' = posFeedback ? 'warning' : 'positioned';

    if (posFeedback !== positionFeedbackRef.current) {
      positionFeedbackRef.current = posFeedback;
      setPositionFeedback(posFeedback);
    }

    // Draw hand skeleton and interactive guide box
    drawHands(ctx, results, currentW, currentH);
    drawGuideBox(ctx, currentW, currentH, guideState);

    // Throttle neural inference to ~25 FPS (every 40ms) to leave headroom for 60 FPS video
    if (now - lastInferenceTimeRef.current < 40) return;
    if (isProcessingRef.current) return;

    if (!onnxInference.isModelLoaded()) {
      if (statusRef.current !== 'TRACKING') {
        statusRef.current = 'TRACKING';
        setStatus('TRACKING');
      }
      return;
    }

    isProcessingRef.current = true;
    lastInferenceTimeRef.current = now;

    // ISOLATED INFERENCE: Any model exception never restarts or stops camera stream
    try {
      // Primary inference on canonical normalized features
      let rawPred = await onnxInference.predict(normResult.flatFeatures);
      if (!mountedRef.current) return;

      let actualHand = normResult.detectedHand;
      const target = targetLetterRef.current;

      // Target-Aware Dual-Hypothesis Check (Requirements 2, 3, 5, 12, 16):
      // If target letter is specified and confidence is sub-optimal or does not match target,
      // test the alternative canonical reflection to guarantee left-hand / right-hand symmetry.
      if (target && (rawPred.sign.toUpperCase() !== target.toUpperCase() || rawPred.confidence < 0.65)) {
        const altResult = normalizeHandLandmarks(primaryHand, results.multiHandedness, {
          forceReflect: !normResult.wasReflected,
        });
        const altPred = await onnxInference.predict(altResult.flatFeatures);
        const targetUpper = target.toUpperCase();

        if (
          altPred.sign.toUpperCase() === targetUpper &&
          (altPred.confidence >= 0.60 || altPred.confidence > rawPred.confidence)
        ) {
          rawPred = altPred;
          actualHand = altResult.wasReflected ? 'Left' : 'Right';
        } else if (altPred.confidence > rawPred.confidence + 0.30 && altPred.confidence >= 0.75) {
          rawPred = altPred;
          actualHand = altResult.wasReflected ? 'Left' : 'Right';
        }
      }

      // Temporal prediction smoothing over rolling buffer with detected hand
      const smoothed = smootherRef.current.addPrediction(rawPred.sign, rawPred.confidence, actualHand);

      // Determine state
      let newStatus: VisionState = 'TRACKING';
      if (!smoothed.isStable) {
        newStatus = 'ANALYZING';
      } else if (smoothed.confidenceLevel === 'LOW' || smoothed.confidence < 0.5) {
        newStatus = 'LOW CONFIDENCE';
      } else {
        newStatus = 'RECOGNIZED';
      }

      if (newStatus !== statusRef.current) {
        statusRef.current = newStatus;
        setStatus(newStatus);
        onStatusChangeRef.current?.(newStatus);
      }

      // Throttle React state updates to avoid unnecessary renders
      const signChanged = smoothed.sign !== currentPredRef.current?.sign;
      const confChanged =
        Math.abs(smoothed.confidence - (currentPredRef.current?.confidence || 0)) > 0.05;
      const timeForUi = now - lastUiUpdateRef.current >= 140;

      if (signChanged || confChanged || timeForUi) {
        currentPredRef.current = smoothed;
        setCurrentPred(smoothed);
        lastUiUpdateRef.current = now;
      }

      // Dispatch prediction callback
      onPredictionRef.current?.(smoothed);

      // Target-aware validation with temporal confirmation
      if (target) {
        const isSignMatch = smoothed.sign.toUpperCase() === target.toUpperCase();
        if (isSignMatch && smoothed.isStable && smoothed.confidence >= 0.70) {
          consecutiveMatchCountRef.current++;
          // Require consistent recognition across ~500ms (>= 4 consecutive inference ticks)
          if (consecutiveMatchCountRef.current >= 4) {
            onMatchRef.current?.(true, smoothed);
          } else {
            onMatchRef.current?.(false, smoothed);
          }
        } else {
          consecutiveMatchCountRef.current = 0;
          onMatchRef.current?.(false, smoothed);
        }
      }
    } catch (error) {
      console.warn('Inference error (camera remains active):', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  // Stable camera initialization — starts camera once when isActive === true
  const startCameraStream = useCallback(async () => {
    if (streamRef.current || isStartingRef.current) {
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;

    isStartingRef.current = true;
    statusRef.current = 'STARTING';
    setStatus('STARTING');
    setLoadingPhase('initializing-hands');
    setLoadingText('Initializing camera & hand tracking...');
    setErrorMessage(null);

    try {
      // 1. Ensure model is ready
      if (!onnxInference.isModelLoaded()) {
        setLoadingPhase('loading-model');
        setLoadingText('Loading recognition model...');
        try {
          await onnxInference.loadModel();
        } catch (mErr) {
          console.warn('Model load warning:', mErr);
          if (mountedRef.current) setModelError(true);
        }
      }

      if (!mountedRef.current) return;

      // 2. Initialize MediaPipe Hands once
      if (!handsRef.current) {
        setLoadingPhase('initializing-hands');
        setLoadingText('Initializing hand tracking...');
        const hands = await initializeHands((results: MediaPipeResults) => {
          processFrameResults(results);
        });
        handsRef.current = hands;
      }

      if (!mountedRef.current || !videoRef.current) return;

      setLoadingPhase('camera-ready');
      setLoadingText('Starting video stream...');

      // 3. Acquire webcam stream
      const stream = await startCamera(videoRef.current, handsRef.current, canvasRef.current);
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      setLoadingPhase('ready');
      setLoadingText('Ready');
      statusRef.current = 'WAITING';
      setStatus('WAITING');
    } catch (err: any) {
      console.error('Camera startup error:', err);
      if (!mountedRef.current) return;

      const isPermission =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError';
      const isNotFound = err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError';

      if (isPermission) {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser and try again.');
      } else if (isNotFound) {
        setErrorMessage('No camera device was found. Please check that your webcam is connected.');
      } else {
        setErrorMessage('Camera access was interrupted. Try allowing camera access and restarting.');
      }
      statusRef.current = 'ERROR';
      setStatus('ERROR');
      setIsActive(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [processFrameResults]);

  // Stable camera cleanup — called only when explicitly stopped or on unmount
  const stopCameraStream = useCallback(() => {
    // 1. Stop video frame processing loop
    if (videoRef.current && (videoRef.current as any).__stopFrameProcessing) {
      try {
        (videoRef.current as any).__stopFrameProcessing();
      } catch (e) {}
    }

    // 2. Stop camera stream tracks
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }

    // 3. Clear video element
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (e) {}
    }

    // 4. Close MediaPipe instance
    if (handsRef.current) {
      try {
        handsRef.current.close();
      } catch (e) {}
      handsRef.current = null;
    }

    // 5. Clear canvas
    if (canvasRef.current) {
      try {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, widthRef.current, heightRef.current);
      } catch (e) {}
    }

    smootherRef.current.reset();
    statusRef.current = 'OFF';
    setStatus('OFF');
    setCurrentPred(null);
    currentPredRef.current = null;
    positionFeedbackRef.current = null;
    setPositionFeedback(null);
  }, []);

  // Primary Camera Lifecycle Effect
  // ONLY runs when isActive transitions. Never affected by predictions, landmarks, or parent rerenders.
  useEffect(() => {
    if (isActive) {
      startCameraStream();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isActive, startCameraStream, stopCameraStream]);

  const isTargetMatched =
    targetLetter &&
    currentPred &&
    currentPred.sign.toUpperCase() === targetLetter.toUpperCase() &&
    currentPred.confidence >= 0.7;

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      {/* Outer Cybernetic Glass Container */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-[#05070B] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Hidden video element for MediaPipe stream source */}
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-0 pointer-events-none"
          playsInline
          muted
        />

        {/* Primary rendering canvas — Mirrored visually for FaceTime/selfie feel */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full object-cover scale-x-[-1]"
        />

        {/* Scanning laser beam animation */}
        {isActive && showScannerOverlay && status !== 'OFF' && status !== 'STARTING' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent shadow-[0_0_12px_#38bdf8] animate-scan" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03)_0%,transparent_70%)] pointer-events-none" />
          </div>
        )}

        {/* Cybernetic Corner Hardware Brackets */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/50 pointer-events-none rounded-tl-sm" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/50 pointer-events-none rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/50 pointer-events-none rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/50 pointer-events-none rounded-br-sm" />

        {/* Top HUD Bar with LIVE, Status, Vision FPS, Target Badge, Pause Toggle */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          {/* Status & Live Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive && status !== 'STARTING' && status !== 'OFF'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                    : 'bg-zinc-600'
                }`}
              />
              <span className="text-zinc-200 tracking-wider uppercase text-[10px] font-semibold">
                {isActive && status !== 'STARTING' && status !== 'OFF' ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Vision Status & FPS Badge */}
            {isActive && status !== 'STARTING' && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                <span>VISION • LIVE • {fps} FPS</span>
              </span>
            )}

            {/* Subtle Detected Handedness Indicator (Requirement 32) */}
            {isActive && detectedHand !== 'Unknown' && status !== 'STARTING' && (
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-semibold transition-all ${
                  detectedHand === 'Left'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.3)]'
                    : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    detectedHand === 'Left' ? 'bg-purple-400' : 'bg-cyan-400'
                  }`}
                />
                <span>● {detectedHand.toUpperCase()} HAND</span>
              </span>
            )}
          </div>

          {/* Right Top: Target Badge & Quick Pause Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {targetLetter && (
              <div className="px-3 py-1 rounded-full bg-cyan-500/15 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                <span className="text-zinc-400 text-[10px]">TARGET:</span>
                <span className="text-white font-bold">{targetLetter}</span>
              </div>
            )}

            {/* Quick Pause / Resume Button in HUD */}
            {isActive ? (
              <button
                onClick={() => setIsActive(false)}
                className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 border border-white/15 text-zinc-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                title="Pause camera tracking"
              >
                <Pause className="w-2.5 h-2.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => setIsActive(true)}
                className="px-2.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[10px] font-mono flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                title="Resume camera tracking"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Resume</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Target Hand Sign Reference Overlay so user can see it and do the same */}
        {isActive && targetImageUrl && (
          <div className="absolute top-14 right-4 z-10 flex flex-col items-center p-2 rounded-2xl bg-[#07111F]/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.7)] pointer-events-none animate-fade-in">
            <span className="text-[9px] uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
              {targetLetter ? `Sign ${targetLetter}` : 'Target Sign'}
            </span>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
              <img
                src={targetImageUrl}
                alt={targetLetter ? `Target Sign ${targetLetter}` : 'Target Sign'}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <span className="text-[8px] font-mono text-zinc-400 mt-1">
              Copy hand shape
            </span>
          </div>
        )}

        {/* Loading Transition Overlay (Auto-start progression) */}
        {status === 'STARTING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center z-20">
            <div className="w-11 h-11 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4 shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
            <p className="text-sm font-semibold text-white mb-1.5 tracking-wide">{loadingText}</p>
            <p className="text-[11px] text-zinc-400 font-mono">Initializing on-device MediaPipe & ONNX pipeline</p>
          </div>
        )}

        {/* Waiting for Hand / Position Guidance Banner */}
        {isActive && status !== 'STARTING' && (status === 'WAITING' || positionFeedback) && (
          <div className="absolute top-12 left-4 right-4 flex justify-center pointer-events-none z-10 animate-fade-in">
            <div className="px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-zinc-300 text-xs shadow-xl flex items-center gap-2">
              <Hand className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-pulse" />
              <span className="font-medium text-[11px]">
                {positionFeedback || 'Position your hand inside the cybernetic frame'}
              </span>
            </div>
          </div>
        )}

        {/* Inactive Standby Screen (only if user manually pauses) */}
        {!isActive && status !== 'STARTING' && !errorMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 via-[#07111F]/90 to-black/95 backdrop-blur-sm p-6 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.25)]">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Camera Paused</h3>
            <p className="text-xs text-zinc-400 max-w-xs mb-5 leading-relaxed">
              Tracking is currently paused. Resume anytime to continue practice.
            </p>
            <button
              onClick={() => setIsActive(true)}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wide uppercase hover:bg-zinc-200 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.25)] active:scale-95 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Camera</span>
            </button>
          </div>
        )}

        {/* Model Missing or Failed State */}
        {modelError && (
          <div className="absolute bottom-3 left-4 right-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/30 backdrop-blur-md text-amber-200 text-xs flex items-center gap-2 z-10">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span className="text-[11px]">Vision model running in heuristic fallback mode. Recognition remains active.</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center z-20">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Camera Notice</p>
            <p className="text-xs text-zinc-400 max-w-xs mb-4 leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsActive(false);
                setTimeout(() => {
                  if (mountedRef.current) setIsActive(true);
                }, 100);
              }}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Real-time HUD Prediction HUD (Bottom Bar) */}
        {isActive && currentPred && currentPred.sign && (() => {
          const isTargetMatched = Boolean(
            targetLetter &&
            currentPred.sign.toUpperCase() === targetLetter.toUpperCase() &&
            currentPred.confidence >= 0.70
          );
          return (
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#07111F]/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-cyan-400">Detected</span>
                  <span className="text-xl font-bold font-mono text-white leading-tight">
                    {currentPred.sign}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-white/15" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400">Confidence</span>
                  <span className="text-sm font-semibold font-mono text-emerald-400 leading-tight">
                    {Math.round(currentPred.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Target Match Badge */}
              {targetLetter && (
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                    isTargetMatched
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                      : 'bg-black/60 border-white/10 text-zinc-300'
                  }`}
                >
                  {isTargetMatched ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold">Matched: {targetLetter}!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-medium">Target: {targetLetter}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* External Sub-Bar */}
      <div className="mt-2.5 w-full flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
        <span className="text-[11px] flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          {isActive ? 'Camera Running (Continuous Session)' : 'Camera Paused'}
        </span>

        {isActive ? (
          <button
            onClick={() => setIsActive(false)}
            className="text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            Pause Camera
          </button>
        ) : (
          <button
            onClick={() => setIsActive(true)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Resume Camera
          </button>
        )}
      </div>
    </div>
  );
}

export default VisionCamera;
