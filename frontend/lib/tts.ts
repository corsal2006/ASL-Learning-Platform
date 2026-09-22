/**
 * Web Speech API Text-to-Speech Controller for ASL Lessons and Luna Assistant
 */

export interface TTSOptions {
  rate?: number; // 0.75, 1.0, 1.25
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class TTSController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentRate: number = 1.0;
  private isPaused: boolean = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    return window.speechSynthesis.getVoices();
  }

  public setRate(rate: number): void {
    this.currentRate = Math.max(0.5, Math.min(2.0, rate));
  }

  public getRate(): number {
    return this.currentRate;
  }

  public speak(text: string, options?: TTSOptions): void {
    if (!this.isSupported()) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      options?.onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const rate = options?.rate ?? this.currentRate;
    utterance.rate = rate;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    // Select natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice =
      englishVoices.find(v => v.name.includes('Natural') || v.name.includes('Neural')) ||
      englishVoices.find(v => v.name.includes('Google') || v.name.includes('Samantha')) ||
      englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isPaused = false;
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.isPaused = false;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      this.isPaused = false;
      options?.onError?.(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (this.isSupported() && window.speechSynthesis.speaking && !this.isPaused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume(): void {
    if (this.isSupported() && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.isPaused = false;
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported() && window.speechSynthesis.speaking;
  }
}

export const tts = new TTSController();
export default tts;
