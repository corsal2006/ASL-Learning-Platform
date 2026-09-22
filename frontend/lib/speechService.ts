/**
 * Natural Speech Synthesis Service
 * Prioritizes natural female English voices for educational tutoring.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentRate = 1.0;
  private voicesLoaded = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    this.voicesLoaded = true;

    // Prioritization for natural female English voices
    const femaleVoiceKeywords = [
      'natural',
      'female',
      'zira',
      'samantha',
      'victoria',
      'karen',
      'fiona',
      'moira',
      'tessa',
      'veena',
      'google us english',
      'google uk english female',
      'jenny',
      'aria',
    ];

    const englishVoices = voices.filter(v => v.lang.startsWith('en'));

    // 1. Match natural female english
    let best = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      return femaleVoiceKeywords.some(kw => name.includes(kw));
    });

    // 2. Any English voice with "female" or known female name
    if (!best) {
      best = englishVoices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('female') || name.includes('girl') || name.includes('woman');
      });
    }

    // 3. Any standard English voice
    if (!best) {
      best = englishVoices.find(v => v.lang === 'en-US' || v.lang === 'en-GB');
    }

    // 4. Fallback to first voice
    this.selectedVoice = best || englishVoices[0] || voices[0] || null;
  }

  public getAvailableVoiceName(): string {
    return this.selectedVoice?.name || 'Default Voice';
  }

  public setRate(rate: number) {
    this.currentRate = Math.min(Math.max(rate, 0.5), 2.0);
  }

  public getRate(): number {
    return this.currentRate;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public subscribe(cb: (speaking: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach(cb => cb(speaking));
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    if (!this.voicesLoaded) {
      this.initVoices();
    }

    const clean = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.currentRate;
    utterance.pitch = 1.05; // Friendly pitch for female persona

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      this.notify(false);
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.notify(false);
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.notify(true);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }
}

export const speechService = new SpeechService();
