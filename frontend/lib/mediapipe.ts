// MediaPipe types
export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface HandDetectionResult {
  landmarks: HandLandmarks[][];
  multiHandedness: any[];
}

export interface MediaPipeResults {
  image: any;
  multiHandLandmarks?: any[];
  multiHandedness?: any[];
}

/**
 * Load MediaPipe Hands from CDN
 */
export async function loadMediaPipeHands(): Promise<any> {
  // Dynamically import from CDN
  if (typeof window === 'undefined') return null;

  // Load script if not already loaded
  if (!(window as any).Hands) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return (window as any).Hands;
}

/**
 * Initialize MediaPipe Hands detection
 */
export async function initializeHands(
  onResults: (results: MediaPipeResults) => void
): Promise<any> {
  const HandsConstructor = await loadMediaPipeHands();

  const hands = new HandsConstructor({
    locateFile: (file: string) => {
      // Use CDN with proper error handling
      const url = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      return url;
    },
  });

  // Wait a bit for MediaPipe to fully initialize before setting options
  await new Promise(resolve => setTimeout(resolve, 100));

  hands.setOptions({
    maxNumHands: 1, // Optimize: only track 1 hand for ASL recognition (was 2)
    modelComplexity: 0, // Use lighter model (0 = fastest, 1 = balanced, 2 = most accurate)
    minDetectionConfidence: 0.7, // Slightly higher to reduce false positives
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  return hands;
}

/**
 * Start camera stream and process frames
 */
export async function startCamera(
  videoElement: HTMLVideoElement,
  hands: any,
  canvasElement?: HTMLCanvasElement,
): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });

  videoElement.srcObject = stream;
  await videoElement.play();

  // Wait for video to be ready before starting processing
  // This prevents MediaPipe from receiving invalid frames
  await new Promise((resolve) => {
    const checkReady = () => {
      if (videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        resolve(undefined);
      } else {
        setTimeout(checkReady, 50);
      }
    };
    checkReady();
  });

  // Continuous video drawing loop - ensures video is always displayed regardless of MediaPipe processing
  let videoDrawAnimationId: number | null = null;
  let shouldDrawVideo = true;

  if (canvasElement) {
    const drawVideoContinuously = () => {
      if (!videoElement.srcObject || !shouldDrawVideo || !canvasElement) {
        if (videoDrawAnimationId) {
          cancelAnimationFrame(videoDrawAnimationId);
          videoDrawAnimationId = null;
        }
        return;
      }

      const ctx = canvasElement.getContext('2d');
      if (ctx && videoElement.readyState >= 2) {
        // Continuously draw video frame - this runs independently of MediaPipe
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      }

      if (shouldDrawVideo) {
        videoDrawAnimationId = requestAnimationFrame(drawVideoContinuously);
      }
    };
    videoDrawAnimationId = requestAnimationFrame(drawVideoContinuously);
  }

  // Performance optimization: limit MediaPipe to ~30 FPS (33ms between frames)
  // Provides fluid tracking while balancing CPU/GPU performance
  const FRAME_THROTTLE_MS = 33;
  let isProcessing = false;
  let animationFrameId: number | null = null;
  let shouldContinue = true;
  let lastFrameTime = 0;
  let consecutiveErrors = 0;
  const MAX_CONSECUTIVE_ERRORS = 5;

  // Process frames with throttling for better performance
  const sendFrame = (currentTime: number) => {
    // Check if still active and video is playing
    if (!videoElement.srcObject || !shouldContinue || !hands) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      return;
    }

    // Validate video element is ready before sending to MediaPipe
    if (videoElement.readyState < 2 || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      // Video not ready yet, continue loop but don't process
      if (shouldContinue) {
        animationFrameId = requestAnimationFrame(sendFrame);
      }
      return;
    }

    // Throttle frame processing - only process if enough time has passed
    const timeSinceLastFrame = currentTime - lastFrameTime;
    const shouldProcess = timeSinceLastFrame >= FRAME_THROTTLE_MS;

    // Process frame if not already processing AND enough time has passed
    if (!isProcessing && shouldProcess) {
      isProcessing = true;
      lastFrameTime = currentTime;

      // Process frame asynchronously with validation
      try {
        // Double-check video is still valid before sending
        if (videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0 && hands) {
          hands.send({ image: videoElement })
            .catch((error: any) => {
              consecutiveErrors++;
              const errorMsg = error?.message || error?.toString() || '';
              
              // Don't log abort errors repeatedly - they're often transient
              if (!errorMsg.includes('Aborted') || consecutiveErrors === 1) {
                console.warn('Error sending frame to MediaPipe:', errorMsg);
              }

              // Stop processing on critical errors or too many consecutive errors
              const isCriticalError = 
                errorMsg.includes('resource') ||
                errorMsg.includes('wasm') ||
                errorMsg.includes('emscripten') ||
                errorMsg.includes('not found') ||
                errorMsg.includes('Failed to fetch') ||
                consecutiveErrors >= MAX_CONSECUTIVE_ERRORS;

              if (isCriticalError) {
                console.error('MediaPipe error threshold reached. Stopping frame processing.');
                shouldContinue = false;
                if (animationFrameId) {
                  cancelAnimationFrame(animationFrameId);
                  animationFrameId = null;
                }
              }
            })
            .then(() => {
              // Reset error counter on success
              consecutiveErrors = 0;
            })
            .finally(() => {
              isProcessing = false;
            });
        } else {
          // Video not ready, skip this frame
          isProcessing = false;
        }
      } catch (error) {
        // Catch synchronous errors
        console.error('Synchronous error in MediaPipe frame processing:', error);
        isProcessing = false;
        consecutiveErrors++;
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          shouldContinue = false;
        }
      }
    }

    // Continue the loop at maximum speed
    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(sendFrame);
    }
  };

  animationFrameId = requestAnimationFrame(sendFrame);
  
  // Store cleanup function on video element for later
  (videoElement as any).__stopFrameProcessing = () => {
    shouldContinue = false;
    shouldDrawVideo = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (videoDrawAnimationId) {
      cancelAnimationFrame(videoDrawAnimationId);
      videoDrawAnimationId = null;
    }
  };

  return stream;
}

/**
 * Draw hand landmarks on canvas with a futuristic computer-vision aesthetic
 */
export function drawHands(
  canvasCtx: CanvasRenderingContext2D,
  results: MediaPipeResults,
  width: number,
  height: number,
  videoElement?: HTMLVideoElement,
  options?: {
    drawSkeleton?: boolean;
    drawBoundingBox?: boolean;
    accentColor?: string;
  }
) {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    return;
  }

  const {
    drawSkeleton = true,
    drawBoundingBox = true,
    accentColor = '#38bdf8',
  } = options || {};

  const landmarks = results.multiHandLandmarks[0];
  if (!landmarks || landmarks.length < 21) return;

  canvasCtx.save();

  if (drawSkeleton) {
    // Draw cybernetic glowing connectors
    canvasCtx.shadowColor = 'rgba(56, 189, 248, 0.7)';
    canvasCtx.shadowBlur = 8;
    canvasCtx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    canvasCtx.lineWidth = 2.5;
    canvasCtx.lineCap = 'round';
    canvasCtx.lineJoin = 'round';

    canvasCtx.beginPath();
    for (const [start, end] of HAND_CONNECTIONS) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      canvasCtx.moveTo(p1.x * width, p1.y * height);
      canvasCtx.lineTo(p2.x * width, p2.y * height);
    }
    canvasCtx.stroke();

    // Draw secondary gold accent lines for fingertips
    canvasCtx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    canvasCtx.shadowBlur = 6;
    canvasCtx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
    canvasCtx.lineWidth = 2;

    const FINGERTIP_TIPS = [
      [3, 4],   // Thumb tip
      [7, 8],   // Index tip
      [11, 12], // Middle tip
      [15, 16], // Ring tip
      [19, 20], // Pinky tip
    ];

    canvasCtx.beginPath();
    for (const [start, end] of FINGERTIP_TIPS) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      canvasCtx.moveTo(p1.x * width, p1.y * height);
      canvasCtx.lineTo(p2.x * width, p2.y * height);
    }
    canvasCtx.stroke();

    // Draw landmark nodes
    landmarks.forEach((lm: any, idx: number) => {
      const x = lm.x * width;
      const y = lm.y * height;
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      const isWrist = idx === 0;

      canvasCtx.shadowBlur = isTip ? 12 : 6;
      canvasCtx.shadowColor = isTip ? '#fbbf24' : '#38bdf8';

      // Outer ring
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, isTip ? 5 : isWrist ? 6 : 3.5, 0, 2 * Math.PI);
      canvasCtx.fillStyle = isTip ? '#fbbf24' : '#ffffff';
      canvasCtx.fill();

      // Core dot
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, isTip ? 2.5 : 1.8, 0, 2 * Math.PI);
      canvasCtx.fillStyle = '#02060f';
      canvasCtx.fill();
    });
  }

  // Draw futuristic cybernetic corner brackets around hand bounding box
  if (drawBoundingBox) {
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    for (const lm of landmarks) {
      const x = lm.x * width;
      const y = lm.y * height;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const pad = 24;
    const boxX = Math.max(10, minX - pad);
    const boxY = Math.max(10, minY - pad);
    const boxW = Math.min(width - boxX - 10, maxX - minX + pad * 2);
    const boxH = Math.min(height - boxY - 10, maxY - minY + pad * 2);
    const bracketLen = Math.min(20, Math.min(boxW, boxH) * 0.25);

    canvasCtx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    canvasCtx.shadowBlur = 6;
    canvasCtx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    canvasCtx.lineWidth = 2;

    // Top-left
    canvasCtx.beginPath();
    canvasCtx.moveTo(boxX, boxY + bracketLen);
    canvasCtx.lineTo(boxX, boxY);
    canvasCtx.lineTo(boxX + bracketLen, boxY);
    canvasCtx.stroke();

    // Top-right
    canvasCtx.beginPath();
    canvasCtx.moveTo(boxX + boxW - bracketLen, boxY);
    canvasCtx.lineTo(boxX + boxW, boxY);
    canvasCtx.lineTo(boxX + boxW, boxY + bracketLen);
    canvasCtx.stroke();

    // Bottom-left
    canvasCtx.beginPath();
    canvasCtx.moveTo(boxX, boxY + boxH - bracketLen);
    canvasCtx.lineTo(boxX, boxY + boxH);
    canvasCtx.lineTo(boxX + bracketLen, boxY + boxH);
    canvasCtx.stroke();

    // Bottom-right
    canvasCtx.beginPath();
    canvasCtx.moveTo(boxX + boxW - bracketLen, boxY + boxH);
    canvasCtx.lineTo(boxX + boxW, boxY + boxH);
    canvasCtx.lineTo(boxX + boxW, boxY + boxH - bracketLen);
    canvasCtx.stroke();
  }

  canvasCtx.restore();
}

/**
 * Draw guide box when waiting for hand positioning or evaluating placement
 */
export function drawGuideBox(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: 'waiting' | 'positioned' | 'warning' = 'waiting'
) {
  const guideW = width * 0.48;
  const guideH = height * 0.62;
  const guideX = (width - guideW) / 2;
  const guideY = (height - guideH) / 2;
  const corner = 22;

  let baseColor = 'rgba(255, 255, 255, 0.2)';
  let accentColor = 'rgba(56, 189, 248, 0.85)'; // cyan default

  if (state === 'positioned') {
    baseColor = 'rgba(52, 211, 153, 0.3)';
    accentColor = 'rgba(52, 211, 153, 0.95)'; // emerald
  } else if (state === 'warning') {
    baseColor = 'rgba(251, 191, 36, 0.3)';
    accentColor = 'rgba(251, 191, 36, 0.95)'; // amber
  }

  ctx.save();
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(guideX, guideY, guideW, guideH);
  ctx.setLineDash([]);

  // Solid corner accents
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Top-left
  ctx.beginPath();
  ctx.moveTo(guideX, guideY + corner);
  ctx.lineTo(guideX, guideY);
  ctx.lineTo(guideX + corner, guideY);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(guideX + guideW - corner, guideY);
  ctx.lineTo(guideX + guideW, guideY);
  ctx.lineTo(guideX + guideW, guideY + corner);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(guideX, guideY + guideH - corner);
  ctx.lineTo(guideX, guideY + guideH);
  ctx.lineTo(guideX + corner, guideY + guideH);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(guideX + guideW - corner, guideY + guideH);
  ctx.lineTo(guideX + guideW, guideY + guideH);
  ctx.lineTo(guideX + guideW, guideY + guideH - corner);
  ctx.stroke();

  ctx.restore();
}

// Hand connection lines (MediaPipe hand model)
export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],  // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16],  // Ring
  [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky
  [5, 9], [9, 13], [13, 17],  // Palm
];

