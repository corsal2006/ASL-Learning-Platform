'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { HeroHandVisualizer } from '@/components/HeroHandVisualizer';
import {
  Sparkles,
  Zap,
  Volume2,
  Eye,
  Camera,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import tts from '@/lib/tts';

export default function HomePage() {
  const [isPlayingAudioDemo, setIsPlayingAudioDemo] = useState(false);

  const playVerbalDemo = () => {
    if (isPlayingAudioDemo) {
      tts.stop();
      setIsPlayingAudioDemo(false);
    } else {
      tts.speak(
        "To sign the letter A in American Sign Language, make a firm closed fist with your thumb resting upright along the side of your index finger. Now hold steady for recognition.",
        {
          rate: 1.0,
          onStart: () => setIsPlayingAudioDemo(true),
          onEnd: () => setIsPlayingAudioDemo(false),
          onError: () => setIsPlayingAudioDemo(false),
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex flex-col font-sans relative selection:bg-cyan-500/30">
      {/* Background Cinematic Video Layer (MotionSites Footage) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
          aria-hidden="true"
        />
        {/* Atmospheric Veil Scrim for Deep Contrast */}
        <div className="absolute inset-0 veil-scrim" />
      </div>

      {/* Floating Header */}
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 min-h-[92vh] flex items-center justify-center px-4 pt-12 pb-20">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span>Real-Time Browser AI • Zero Account Required</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.08] mb-6 text-white">
              Learn the language <br />
              <span className="font-semibold bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                of movement.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-zinc-400 font-light max-w-xl mb-4 leading-relaxed">
              See the sign. Speak the meaning. Master American Sign Language through computer-vision hand tracking, voice guidance, and an empathetic AI tutor.
            </p>

            {/* Trust Points */}
            <p className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span>21 Hand Landmarks</span>
              <span>•</span>
              <span>Dual Visual + Voice Mode</span>
              <span>•</span>
              <span>Luna AI Tutor</span>
            </p>

            {/* Call to Action Group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/learn/1"
                className="cta-glass px-8 py-4 text-sm font-semibold tracking-wide text-white group flex items-center gap-3 w-full sm:w-auto justify-center shadow-[0_0_24px_rgba(56,189,248,0.35)]"
              >
                <span>Start Learning</span>
                <svg className="w-4 h-3 stroke-white fill-none stroke-[1.8] group-hover:translate-x-1 transition-transform" viewBox="0 0 16 11">
                  <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8" strokeLinecap="square" />
                </svg>
              </Link>

              <Link
                href="/journey"
                className="px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-medium text-zinc-200 hover:text-white transition-all backdrop-blur-md flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore Curriculum</span>
              </Link>
            </div>

            {/* Visual Learning Flow Preview: SEE → LEARN → SIGN → PRACTICE → MASTER */}
            <div className="mt-8 p-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md w-full max-w-xl">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-400">
                <span className="text-cyan-400 font-semibold">SEE</span>
                <span className="text-zinc-600">→</span>
                <span className="text-white font-semibold">LEARN</span>
                <span className="text-zinc-600">→</span>
                <span className="text-amber-300 font-semibold">SIGN</span>
                <span className="text-zinc-600">→</span>
                <span className="text-emerald-400 font-semibold">PRACTICE</span>
                <span className="text-zinc-600">→</span>
                <span className="text-purple-400 font-semibold">MASTER</span>
              </div>
            </div>

            {/* Micro Feature Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10 w-full max-w-lg text-left">
              <div>
                <div className="text-xl font-bold font-mono text-white">26</div>
                <div className="text-[11px] text-zinc-400">Alphabet Signs</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-cyan-400">100%</div>
                <div className="text-[11px] text-zinc-400">On-Device CV</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-amber-400">60 FPS</div>
                <div className="text-[11px] text-zinc-400">Fluid Tracking</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-emerald-400">Instant</div>
                <div className="text-[11px] text-zinc-400">Zero Signup</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: 3D Holographic Hand */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroHandVisualizer />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (Section 28) */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5 bg-[#05070B]/50 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>THE INTELLIGENT PIPELINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              How vision becomes <span className="font-semibold text-cyan-400">understanding.</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-4 font-light">
              Experience browser-native machine learning that transforms camera movement into immediate, encouraging feedback.
            </p>
          </div>

          {/* 4-Step Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="p-6 rounded-3xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="text-3xl font-mono font-light text-zinc-500 group-hover:text-cyan-400 transition-colors mb-4">01</div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Show your hand</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Position your hand in front of your webcam. No video ever leaves your machine; your camera feed is processed 100% locally.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-3xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="text-3xl font-mono font-light text-zinc-500 group-hover:text-cyan-400 transition-colors mb-4">02</div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_16px_rgba(251,191,36,0.2)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">AI tracks movement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                MediaPipe maps 21 three-dimensional skeletal coordinates in real-time, tracking joint articulation and palm orientation.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-3xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="text-3xl font-mono font-light text-zinc-500 group-hover:text-cyan-400 transition-colors mb-4">03</div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Sign recognized</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Our ONNX neural network analyzes the geometric coordinates and outputs high-confidence predictions with temporal smoothing.
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-6 rounded-3xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="text-3xl font-mono font-light text-zinc-500 group-hover:text-cyan-400 transition-colors mb-4">04</div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_16px_rgba(168,85,247,0.2)]">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Luna guides you</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Luna explains nuances, provides audio coaching, highlights common finger errors, and cheers on your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL-MODE LEARNING: VISION + VOICE (Section 8 & 9) */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
                <Volume2 className="w-3.5 h-3.5" />
                <span>DUAL-MODE PEDAGOGY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight mb-6">
                Teach through sight. <br />
                <span className="font-semibold text-amber-300">Explain through voice.</span>
              </h2>
              <p className="text-zinc-400 text-base font-light leading-relaxed mb-6">
                Every sign has a unique tactile story. In addition to high-resolution anatomical visual references, each lesson features full vocal narration with speed control.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Visual Mode</h4>
                    <p className="text-xs text-zinc-400">Detailed handshape guides, thumb orientation, and finger curl angles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Verbal Mode (Listen & Learn)</h4>
                    <p className="text-xs text-zinc-400">SpeechSynthesis audio instruction with 0.75x, 1x, and 1.25x speed toggles.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Verbal Mode Demo Button */}
              <button
                onClick={playVerbalDemo}
                className="px-6 py-3 rounded-full bg-amber-400 text-black font-semibold text-xs tracking-wider uppercase hover:bg-amber-300 transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(251,191,36,0.3)] active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudioDemo ? 'Stop Audio Narration' : 'Listen to Sign A Demo'}</span>
              </button>
            </div>

            {/* Right Interactive Card Sample */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Curriculum Preview</span>
                    <h3 className="text-lg font-bold text-white">Letter A (Beginner)</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20">
                    Mastery 96%
                  </span>
                </div>

                {/* Hand Sign Visual */}
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#03060c] border border-white/5 flex items-center justify-center overflow-hidden relative mb-5">
                  <img
                    src="https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif"
                    alt="ASL Letter A Sign"
                    className="w-48 h-48 object-contain"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                    Handshape: Closed Fist
                  </div>
                </div>

                {/* Step Breakdown */}
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="font-semibold text-white">Fingers:</span> Closed tightly into palm.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="font-semibold text-white">Thumb:</span> Upright along side of index finger.
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Try it now with camera</span>
                  <Link href="/learn/1" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET LUNA AI TUTOR (Section 17, 18, 20) */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5 bg-[#05070B]/50 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Luna Visual Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#06b6d4] to-[#fbbf24] p-[3px] shadow-[0_0_50px_rgba(56,189,248,0.3)]">
                <div className="w-full h-full rounded-full bg-[#03060c] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_24px_#38bdf8] animate-pulse">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Luna</h3>
                  <p className="text-xs text-cyan-300 font-mono mb-2">AI ASL Tutor</p>
                  <p className="text-[11px] text-zinc-400 leading-tight">Patient, supportive, conversational ASL mentor.</p>
                </div>
              </div>
            </div>

            {/* Right Luna Capabilities */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FLOATING AI TUTOR</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight mb-6">
                Meet Luna. <br />
                <span className="font-semibold text-cyan-400">An AI tutor that learns with you.</span>
              </h2>
              <p className="text-zinc-400 text-base font-light leading-relaxed mb-6">
                Luna isn't just a generic chatbot. She receives real-time context about what sign you're practicing, your vision detection confidence, and your learning progress—explaining nuances without ever shaming mistakes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-1">Speech & Voice Input</h4>
                  <p className="text-xs text-zinc-400">Speak naturally using your microphone. Luna responds via voice or text.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-1">Contextual Feedback</h4>
                  <p className="text-xs text-zinc-400">Ask "Why is my B not recognized?" and Luna analyzes your thumb position.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-1">Custom Practice Plans</h4>
                  <p className="text-xs text-zinc-400">Generates targeted 5-minute drills for the letters you struggle with.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-1">Deaf Culture & Etiquette</h4>
                  <p className="text-xs text-zinc-400">Answers historical and cultural questions regarding the Deaf community.</p>
                </div>
              </div>

              <Link
                href="/learn/1"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                <span>Start Practice with Luna</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. A-Z ALPHABET EXPLORER PREVIEW (Section 16) */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-mono mb-3">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMPLETE A–Z CURRICULUM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-white">
                The 26 Letters of <span className="font-semibold text-cyan-300">ASL</span>
              </h2>
            </div>
            <Link
              href="/reference"
              className="text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mt-4 sm:mt-0"
            >
              <span>View Full Reference Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 26 Letters Quick Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2.5">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char, index) => (
              <Link
                key={char}
                href={`/learn/${index + 1}`}
                className="p-3 rounded-2xl bg-[#07111F]/70 border border-white/10 hover:border-cyan-400/50 hover:bg-[#0B182B] transition-all flex flex-col items-center group shadow-md"
              >
                <span className="text-xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                  {char}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 mt-1">
                  #{index + 1}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GAMIFIED PRACTICE & QUIZ SHOWCASE (Section 14 & 15) */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5 bg-[#05070B]/50 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>TEST YOUR REFLEXES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              Practice modes for <span className="font-semibold text-emerald-400">every skill level.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guided Practice */}
            <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Free Practice</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Select any letter and sign directly to the camera with continuous live feedback and real-time confidence readout.
                </p>
              </div>
              <Link
                href="/practice"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quiz Mode */}
            <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 flex flex-col justify-between group hover:border-amber-500/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sign Quiz</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Answer random sign prompts within 3 seconds, building streaks and climbing accuracy scores without pressure.
                </p>
              </div>
              <Link
                href="/quiz"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Take a Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Time Challenge */}
            <div className="p-8 rounded-3xl bg-[#07111F]/80 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Time Challenge</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
                  Rapid-fire alphabet sprint. Sign as many consecutive letters as possible in 60 seconds to lock in muscle memory.
                </p>
              </div>
              <Link
                href="/time-challenge"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Launch Sprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY & INCLUSIVITY (Section 35) */}
      <section className="relative z-10 py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
            Private by design. Accessible to everyone.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-6 font-light">
            Your webcam feed runs solely in your browser through ONNX WebGL. No video, biometric imagery, or audio ever gets sent to or stored on our servers. Progress is safely saved locally on your device.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No Account Required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Zero Video Cloud Upload
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Keyboard Navigable
            </span>
          </div>
        </div>
      </section>

      {/* 8. FINAL CINEMATIC CTA */}
      <section className="relative z-10 py-28 px-4 border-t border-white/5 bg-gradient-to-b from-transparent via-[#07111F]/40 to-[#02060f]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-white mb-6">
            Ready to sign your first word?
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto font-light mb-10">
            Join thousands learning American Sign Language the intuitive, modern way. Start immediately in one click.
          </p>

          <Link
            href="/learn"
            className="cta-glass px-10 py-4 text-sm font-semibold tracking-wide text-white group inline-flex items-center gap-3"
          >
            <span>Start Learning Now — It's Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/10 bg-[#02060f] text-xs text-zinc-500">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wider">SIGNVISION</span>
            <span>—</span>
            <span>American Sign Language Learning Experience</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/practice" className="hover:text-white transition-colors">Practice</Link>
            <Link href="/quiz" className="hover:text-white transition-colors">Quiz</Link>
            <Link href="/reference" className="hover:text-white transition-colors">Reference</Link>
            <Link href="/time-challenge" className="hover:text-white transition-colors">Challenges</Link>
            <Link href="/journey" className="hover:text-white transition-colors">Journey</Link>
          </div>

          <div>
            <span>Local Browser Inference • 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
