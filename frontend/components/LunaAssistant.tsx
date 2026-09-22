'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { speechService } from '@/lib/speechService';
import { useLuna } from '@/contexts/LunaContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
  speakable?: string;
}

interface LunaAssistantProps {
  currentLetter?: string;
  predictedLetter?: string;
  confidence?: number;
  lessonTitle?: string;
  quizScore?: string;
}

const INITIAL_GREETING: Message = {
  id: 'greeting-1',
  role: 'assistant',
  content:
    "Hey! 👋 I'm Luna, your ASL learning assistant.\n\nI can explain signs, guide your lessons, help you practice, or quiz you.\n\nWhat would you like to learn?",
  timestamp: Date.now(),
  suggestions: [
    'Explain this sign',
    'Why is my sign wrong?',
    'Quiz me',
    'Common mistakes',
  ],
  speakable:
    "Hey! I'm Luna, your ASL learning assistant. I can explain signs, guide your lessons, help you practice, or quiz you. What would you like to learn?",
};

export function LunaAssistant(props: LunaAssistantProps) {
  const {
    isOpen,
    openLuna,
    closeLuna,
    learningContext,
    pendingPrompt,
    clearPendingPrompt,
  } = useLuna();

  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Merge direct props with global context
  const activeLetter = props.currentLetter || learningContext.currentSign || 'A';
  const activeLesson = props.lessonTitle || learningContext.lesson || 'ASL Alphabet';
  const activeStage = learningContext.stage || 'Practice';
  const activePred = props.predictedLetter || learningContext.prediction;
  const activeConf = props.confidence ?? learningContext.confidence;

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle pending prompt from outside triggers
  useEffect(() => {
    if (pendingPrompt && isOpen) {
      handleSend(pendingPrompt);
      clearPendingPrompt();
    }
  }, [pendingPrompt, isOpen]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/luna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            currentLetter: activeLetter,
            predictedLetter: activePred,
            confidence: activeConf,
            lesson: activeLesson,
            stage: activeStage,
            quizScore: props.quizScore || learningContext.quizScore,
          },
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message || "I'm here to guide your sign language practice!",
        timestamp: Date.now(),
        suggestions: data.suggestions || [
          `How do I position my thumb for ${activeLetter}?`,
          'Quiz me on this sign',
          'Give me a 1-minute drill',
        ],
        speakable: data.speakable || data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to communicate with Luna:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            `For sign ${activeLetter}, keep your hand upright at chest level with palm facing forward. Check that your fingers are curled tightly into your palm!`,
          timestamp: Date.now(),
          suggestions: [`Explain sign ${activeLetter}`, 'Quiz me', 'Common mistakes'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeakMessage = (msg: Message) => {
    if (currentlySpeakingId === msg.id) {
      speechService.stop();
      setCurrentlySpeakingId(null);
    } else {
      speechService.setRate(speechSpeed);
      speechService.speak(msg.speakable || msg.content, () => {
        setCurrentlySpeakingId(null);
      });
      setCurrentlySpeakingId(msg.id);
    }
  };

  const handleClear = () => {
    speechService.stop();
    setCurrentlySpeakingId(null);
    setMessages([INITIAL_GREETING]);
  };

  return (
    <>
      {/* Floating Luna Launcher Trigger (Bottom-Right) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLuna()}
            title="Ask Luna — AI ASL Tutor"
            aria-label="Ask Luna — AI ASL Tutor"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#07111F]/90 border border-cyan-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-xl group transition-all"
          >
            {/* Luna Avatar Orb with Subtle Cyan Glow */}
            <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#06b6d4] to-[#fbbf24] flex items-center justify-center p-[1.5px] shadow-[0_0_10px_rgba(56,189,248,0.6)]">
              <div className="w-full h-full rounded-full bg-[#03060c] flex items-center justify-center relative overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8] animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white tracking-wide">Luna</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">AI ASL Tutor</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Compact Floating Message Panel (320-400px wide, bottom-right anchor) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[370px] max-w-[400px] h-[520px] max-h-[82vh] flex flex-col rounded-3xl bg-[#07111F]/95 border border-white/15 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.15)] overflow-hidden"
          >
            {/* Header: Luna ✨ AI ASL Tutor × */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#06b6d4] to-[#fbbf24] p-[1.5px] shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  <div className="w-full h-full rounded-full bg-[#03060c] flex items-center justify-center relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8] animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold text-white">✨ Luna</h4>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium">AI ASL Tutor</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={closeLuna}
                  title="Close assistant"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Badge (Current Lesson, Stage, Prediction) */}
            <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-300">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">
                  {activeLesson} • {activeLetter} ({activeStage})
                </span>
              </div>
              {activePred && (
                <span className="font-mono text-[10px] text-zinc-400 flex-shrink-0 ml-2">
                  CV: {activePred} {activeConf ? `(${Math.round(activeConf * 100)}%)` : ''}
                </span>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => {
                const isLuna = msg.role === 'assistant';
                const isSpeaking = currentlySpeakingId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isLuna ? 'items-start' : 'items-end'} gap-1.5`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                      <span>{isLuna ? 'Luna' : 'You'}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isLuna
                          ? 'bg-white/[0.06] border border-white/10 text-zinc-200 rounded-tl-sm'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Luna Voice Button */}
                      {isLuna && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => toggleSpeakMessage(msg)}
                            className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                              isSpeaking
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-3 h-3 text-amber-400" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          <span className="text-[9px] text-zinc-500">Natural Voice</span>
                        </div>
                      )}
                    </div>

                    {/* Suggestions chips from Luna */}
                    {isLuna && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1 max-w-[95%]">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 transition-colors text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono py-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Luna is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Pills above input */}
            <div className="px-4 py-1.5 border-t border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
              <button
                onClick={() => handleSend(`How do I sign ${activeLetter}?`)}
                className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap border border-white/10"
              >
                Explain this sign
              </button>
              <button
                onClick={() => handleSend(`Why is my sign ${activeLetter} not recognized?`)}
                className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap border border-white/10"
              >
                Why is my sign wrong?
              </button>
              <button
                onClick={() => handleSend('Quiz me on what I learned!')}
                className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap border border-white/10"
              >
                Quiz me
              </button>
            </div>

            {/* Input Bar with Microphone and Send */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-[0_0_12px_#ef4444] animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
                title={isListening ? 'Stop listening' : 'Speak to Luna'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask Luna about ${activeLetter}...`}
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LunaAssistant;
