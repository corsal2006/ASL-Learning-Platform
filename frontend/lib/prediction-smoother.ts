/**
 * Temporal Prediction Smoother for ASL Recognition
 * Solves single-frame jitter, false positives, and flickers by maintaining a rolling
 * window of prediction distributions and debouncing letter transitions.
 */

export interface RawPrediction {
  sign: string;
  confidence: number;
  timestamp: number;
}

export interface SmoothedPrediction {
  sign: string;
  confidence: number;
  isStable: boolean;
  stabilityScore: number; // 0 to 1
  consecutiveFrames: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedHand?: 'Left' | 'Right' | 'Unknown';
}

export class PredictionSmoother {
  private windowSize: number;
  private minStableFrames: number;
  private history: RawPrediction[] = [];
  private currentSign: string = '';
  private currentConfidence: number = 0;
  private consecutiveCount: number = 0;
  private currentHand: 'Left' | 'Right' | 'Unknown' = 'Unknown';

  constructor(windowSize: number = 7, minStableFrames: number = 4) {
    this.windowSize = windowSize;
    this.minStableFrames = minStableFrames;
  }

  /**
   * Reset smoother history (e.g. when hand leaves frame)
   */
  public reset(): void {
    this.history = [];
    this.currentSign = '';
    this.currentConfidence = 0;
    this.consecutiveCount = 0;
    this.currentHand = 'Unknown';
  }

  /**
   * Add a new frame prediction and get the smoothed result
   */
  public addPrediction(
    sign: string,
    confidence: number,
    detectedHand?: 'Left' | 'Right' | 'Unknown'
  ): SmoothedPrediction {
    const now = Date.now();
    if (detectedHand && detectedHand !== 'Unknown') {
      this.currentHand = detectedHand;
    }

    // Push to history
    this.history.push({ sign, confidence, timestamp: now });
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }

    // Tally weighted votes across the sliding window
    // More recent frames have higher weight (linear ramp)
    const signScores: { [key: string]: { totalWeight: number; weightedConf: number } } = {};
    let totalWindowWeight = 0;

    this.history.forEach((pred, index) => {
      const weight = (index + 1) / this.history.length; // Recent gets higher weight
      totalWindowWeight += weight;

      if (!signScores[pred.sign]) {
        signScores[pred.sign] = { totalWeight: 0, weightedConf: 0 };
      }
      signScores[pred.sign].totalWeight += weight;
      signScores[pred.sign].weightedConf += pred.confidence * weight;
    });

    // Find the winning sign in the window
    let bestSign = sign;
    let bestScore = 0;
    let bestAverageConfidence = confidence;

    for (const [s, data] of Object.entries(signScores)) {
      const voteRatio = data.totalWeight / totalWindowWeight;
      if (voteRatio > bestScore) {
        bestScore = voteRatio;
        bestSign = s;
        bestAverageConfidence = data.weightedConf / data.totalWeight;
      }
    }

    // Debounce logic: only switch currentSign if bestSign has dominated for consecutive frames
    if (bestSign === this.currentSign) {
      this.consecutiveCount++;
      // Smooth the confidence using exponential moving average
      this.currentConfidence = this.currentConfidence * 0.4 + bestAverageConfidence * 0.6;
    } else {
      if (this.consecutiveCount < this.minStableFrames && this.currentSign !== '') {
        // Suppress erratic 1-frame switches: hold onto previous sign until threshold met
        this.consecutiveCount = Math.max(0, this.consecutiveCount - 1);
      } else {
        // Transition to new sign
        this.currentSign = bestSign;
        this.currentConfidence = bestAverageConfidence;
        this.consecutiveCount = 1;
      }
    }

    const isStable = this.consecutiveCount >= this.minStableFrames;
    const stabilityScore = Math.min(1, this.consecutiveCount / (this.minStableFrames * 2));

    let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (this.currentConfidence >= 0.85) {
      confidenceLevel = 'HIGH';
    } else if (this.currentConfidence >= 0.65) {
      confidenceLevel = 'MEDIUM';
    }

    return {
      sign: this.currentSign || sign,
      confidence: Math.round(this.currentConfidence * 100) / 100,
      isStable,
      stabilityScore,
      consecutiveFrames: this.consecutiveCount,
      confidenceLevel,
      detectedHand: this.currentHand,
    };
  }
}
