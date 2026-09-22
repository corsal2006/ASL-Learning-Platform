'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LunaLearningContext {
  lesson?: string;
  currentSign?: string;
  stage?: string;
  prediction?: string;
  confidence?: number;
  quizScore?: string;
}

interface LunaContextType {
  isOpen: boolean;
  learningContext: LunaLearningContext;
  openLuna: (prompt?: string) => void;
  closeLuna: () => void;
  toggleLuna: () => void;
  setLearningContext: (ctx: Partial<LunaLearningContext>) => void;
  pendingPrompt?: string;
  clearPendingPrompt: () => void;
}

const LunaContext = createContext<LunaContextType | undefined>(undefined);

export function LunaProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [learningContext, setLearningContextState] = useState<LunaLearningContext>({
    lesson: 'ASL Alphabet',
    currentSign: 'A',
    stage: 'See It',
  });
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);

  const openLuna = useCallback((prompt?: string) => {
    if (prompt) setPendingPrompt(prompt);
    setIsOpen(true);
  }, []);

  const closeLuna = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleLuna = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const setLearningContext = useCallback((ctx: Partial<LunaLearningContext>) => {
    setLearningContextState((prev) => ({ ...prev, ...ctx }));
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(undefined);
  }, []);

  return (
    <LunaContext.Provider
      value={{
        isOpen,
        learningContext,
        openLuna,
        closeLuna,
        toggleLuna,
        setLearningContext,
        pendingPrompt,
        clearPendingPrompt,
      }}
    >
      {children}
    </LunaContext.Provider>
  );
}

export function useLuna() {
  const context = useContext(LunaContext);
  if (!context) {
    throw new Error('useLuna must be used within a LunaProvider');
  }
  return context;
}
