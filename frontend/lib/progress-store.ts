/**
 * Local Progress & Journey Store (Zero Authentication)
 * Persists learning history, mastered letters, practice accuracy, quiz scores,
 * streaks, and personalized recommendations using localStorage.
 */

export interface LetterProgress {
  letter: string;
  attempts: number;
  correct: number;
  accuracy: number;
  lastPracticed: number; // timestamp
  isMastered: boolean;
}

export interface QuizSession {
  id: string;
  timestamp: number;
  score: number;
  total: number;
  accuracy: number;
  mode: string;
}

export interface UserJourney {
  completedLessons: string[]; // List of letters, e.g. ['A', 'B']
  masteredLetters: string[];
  letterStats: { [letter: string]: LetterProgress };
  quizHistory: QuizSession[];
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalPracticeTimeSeconds: number;
  fastestRecognitionMs: number;
  averageAccuracy: number;
}

const STORAGE_KEY = 'asl_platform_user_journey';

const INITIAL_JOURNEY: UserJourney = {
  completedLessons: [],
  masteredLetters: [],
  letterStats: {},
  quizHistory: [],
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  totalPracticeTimeSeconds: 0,
  fastestRecognitionMs: 0,
  averageAccuracy: 0,
};

class ProgressStore {
  private journey: UserJourney = INITIAL_JOURNEY;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.journey = { ...INITIAL_JOURNEY, ...JSON.parse(raw) };
      } else {
        this.journey = { ...INITIAL_JOURNEY };
      }
      this.checkAndUpdateStreak();
    } catch (err) {
      console.warn('Failed to load local progress:', err);
      this.journey = { ...INITIAL_JOURNEY };
    }
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.journey));
      this.notify();
    } catch (err) {
      console.warn('Failed to save local progress:', err);
    }
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getJourney(): UserJourney {
    const stats = Object.values(this.journey.letterStats || {});
    const mastered = stats.filter((s) => s.isMastered).map((s) => s.letter);
    const completed = Array.from(new Set([...(this.journey.completedLessons || []), ...mastered]));

    let avgAcc = 0;
    if (stats.length > 0) {
      const sum = stats.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);
      avgAcc = Math.round((sum / stats.length) * 100);
    }

    return {
      ...this.journey,
      completedLessons: completed,
      masteredLetters: completed,
      averageAccuracy: avgAcc,
    };
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private checkAndUpdateStreak(): void {
    const today = this.getTodayString();
    if (!this.journey.lastActiveDate) {
      return;
    }
    if (this.journey.lastActiveDate === today) {
      return; // Already counted today
    }

    const last = new Date(this.journey.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken
      this.journey.currentStreak = 0;
    }
  }

  public recordActivity(): void {
    const today = this.getTodayString();
    if (this.journey.lastActiveDate !== today) {
      this.journey.currentStreak += 1;
      if (this.journey.currentStreak > this.journey.bestStreak) {
        this.journey.bestStreak = this.journey.currentStreak;
      }
      this.journey.lastActiveDate = today;
      this.save();
    }
  }

  public recordSignAttempt(letter: string, isCorrect: boolean, recognitionDurationMs?: number): void {
    this.recordActivity();
    const l = letter.toUpperCase();
    const existing = this.journey.letterStats[l] || {
      letter: l,
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: Date.now(),
      isMastered: false,
    };

    existing.attempts += 1;
    if (isCorrect) {
      existing.correct += 1;
    }
    existing.accuracy = Math.round((existing.correct / existing.attempts) * 100) / 100;
    existing.lastPracticed = Date.now();

    // Mastery criteria: at least 5 attempts and >= 80% accuracy
    if (existing.attempts >= 5 && existing.accuracy >= 0.8) {
      existing.isMastered = true;
      if (!this.journey.completedLessons.includes(l)) {
        this.journey.completedLessons.push(l);
      }
    }

    this.journey.letterStats[l] = existing;

    if (recognitionDurationMs && recognitionDurationMs > 100) {
      if (!this.journey.fastestRecognitionMs || recognitionDurationMs < this.journey.fastestRecognitionMs) {
        this.journey.fastestRecognitionMs = recognitionDurationMs;
      }
    }

    this.save();
  }

  public recordQuizResult(score: number, total: number, mode: string = 'standard'): void {
    this.recordActivity();
    const session: QuizSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      score,
      total,
      accuracy: total > 0 ? Math.round((score / total) * 100) / 100 : 0,
      mode,
    };

    this.journey.quizHistory.unshift(session);
    if (this.journey.quizHistory.length > 30) {
      this.journey.quizHistory.pop();
    }
    this.save();
  }

  public markLessonComplete(letter: string): void {
    this.recordActivity();
    const l = letter.toUpperCase();
    if (!this.journey.completedLessons.includes(l)) {
      this.journey.completedLessons.push(l);
    }
    const stat = this.journey.letterStats[l] || {
      letter: l,
      attempts: 5,
      correct: 5,
      accuracy: 1.0,
      lastPracticed: Date.now(),
      isMastered: true,
    };
    stat.isMastered = true;
    this.journey.letterStats[l] = stat;
    this.save();
  }

  /**
   * Get personalized practice recommendations based on actual performance
   */
  public getRecommendations(): {
    title: string;
    description: string;
    letters: string[];
    action: string;
    href: string;
  } {
    const stats = Object.values(this.journey.letterStats);

    // New user with no stats
    if (stats.length === 0) {
      return {
        title: 'Start with your first lesson',
        description: 'Begin with Letter A to learn fundamental finger placement and webcam tracking.',
        letters: ['A', 'B', 'C'],
        action: 'Start Letter A',
        href: '/learn/1',
      };
    }

    // Identify weak letters (attempted but accuracy < 75%)
    const weak = stats
      .filter((s) => s.attempts >= 2 && s.accuracy < 0.75)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((s) => s.letter);

    if (weak.length > 0) {
      const targetWeak = weak.slice(0, 3);
      return {
        title: `Reinforce ${targetWeak.join(', ')}`,
        description: `Your accuracy on ${targetWeak.join(', ')} can be improved. A short practice session will lock them in.`,
        letters: targetWeak,
        action: `Practice ${targetWeak[0]}`,
        href: `/practice?letter=${targetWeak[0]}`,
      };
    }

    // Unattempted letters
    const allAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const unpracticed = allAlphabet.filter((l) => !this.journey.letterStats[l]);

    if (unpracticed.length > 0) {
      const nextLetters = unpracticed.slice(0, 3);
      return {
        title: `Learn New Signs: ${nextLetters.join(', ')}`,
        description: `You've built solid foundations! Ready to expand your vocabulary with ${nextLetters.join(', ')}?`,
        letters: nextLetters,
        action: `Learn Letter ${nextLetters[0]}`,
        href: `/learn/${allAlphabet.indexOf(nextLetters[0]) + 1}`,
      };
    }

    // All letters attempted & mastered
    return {
      title: 'Time Challenge Mastery',
      description: 'You have practiced every letter! Put your speed and reflexes to the test in the Time Challenge.',
      letters: ['Speed', 'Reflexes'],
      action: 'Start 60s Challenge',
      href: '/time-challenge',
    };
  }

  /**
   * Get alphabet mastery percentage (0 to 100)
   */
  public getMasteryPercentage(): number {
    const totalLetters = 26;
    const masteredCount = Object.values(this.journey.letterStats).filter((s) => s.isMastered).length;
    return Math.round((masteredCount / totalLetters) * 100);
  }

  /**
   * Get letters needing practice
   */
  public getWeakLetters(): string[] {
    return Object.values(this.journey.letterStats)
      .filter((s) => s.attempts >= 2 && s.accuracy < 0.75)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((s) => s.letter)
      .slice(0, 5);
  }
}

export const progressStore = new ProgressStore();
export default progressStore;
