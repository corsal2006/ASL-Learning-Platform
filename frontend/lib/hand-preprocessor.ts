/**
 * Canonical Hand Landmark Preprocessor for ASL Recognition
 * 
 * Provides unified, deterministic landmark normalization across all pages (/learn, /practice).
 * 
 * Grounded in empirical analysis of backend/training/data/processed/X_train.npy (44,570 samples):
 * - Canonical training centroid: X = 0.529, Y = 0.497
 * - Canonical hand span (wrist to middle MCP): 0.257
 * - Model trained exclusively on canonical Right-Hand orientation (93.2% right-aligned thumb)
 * 
 * When a Left Hand is presented, it performs horizontal canonical reflection across the hand centroid:
 * x' = 2 * center_x - x
 * 
 * This maps both left and right hands into the exact same canonical feature distribution
 * without altering confidence thresholds or faking predictions.
 */

export interface Point3D {
  x: number;
  y: number;
  z?: number;
}

export interface HandBoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export interface NormalizedLandmarksResult {
  /** 21 landmarks [x, y, z] in canonical right-hand training orientation */
  canonicalLandmarks: number[][];
  /** 63-element 1D array ready for ONNX tensor input [1, 63] */
  flatFeatures: Float32Array;
  /** Detected hand: 'Left', 'Right', or 'Unknown' */
  detectedHand: 'Left' | 'Right' | 'Unknown';
  /** Whether canonical horizontal reflection was applied */
  wasReflected: boolean;
  /** Hand span (wrist lm0 to middle finger MCP lm9) */
  handSpan: number;
  /** Hand centroid before centering */
  rawCentroid: { x: number; y: number };
  /** Hand bounding box */
  boundingBox: HandBoundingBox;
  /** Positioning / framing guidance feedback */
  guidanceFeedback: string | null;
}

// Empirical constants from training dataset (X_train.npy)
export const CANONICAL_CENTER_X = 0.529;
export const CANONICAL_CENTER_Y = 0.497;
export const CANONICAL_SCALE_SPAN = 0.257;

/**
 * Determine handedness using both MediaPipe metadata and landmark geometry.
 */
export function detectHandedness(
  landmarks: Point3D[] | number[][],
  mediaPipeHandedness?: any
): 'Left' | 'Right' | 'Unknown' {
  // 1. Extract key landmarks
  const getCoord = (idx: number): { x: number; y: number } => {
    const lm = landmarks[idx];
    if (Array.isArray(lm)) {
      return { x: lm[0], y: lm[1] };
    }
    return { x: lm.x, y: lm.y };
  };

  const lm0 = getCoord(0);   // Wrist
  const lm9 = getCoord(9);   // Middle MCP
  const lm5 = getCoord(5);   // Index MCP
  const lm17 = getCoord(17); // Pinky MCP

  // Vector from wrist (0) to middle MCP (9)
  const ux = lm9.x - lm0.x;
  const uy = lm9.y - lm0.y;

  // Vector from index MCP (5) to pinky MCP (17)
  const wx = lm17.x - lm5.x;
  const wy = lm17.y - lm5.y;

  // 2D cross product: ux * wy - uy * wx
  // Negative (< -0.005) indicates canonical Right Hand orientation
  // Positive (> 0.005) indicates Left Hand orientation
  const cross = ux * wy - uy * wx;

  // 2. Inspect MediaPipe handedness label
  let mpLabel: string | null = null;
  let mpScore: number = 0;

  if (mediaPipeHandedness) {
    if (typeof mediaPipeHandedness === 'string') {
      mpLabel = mediaPipeHandedness;
    } else if (mediaPipeHandedness.label) {
      mpLabel = mediaPipeHandedness.label;
      mpScore = mediaPipeHandedness.score || 0;
    } else if (Array.isArray(mediaPipeHandedness) && mediaPipeHandedness.length > 0) {
      mpLabel = mediaPipeHandedness[0]?.label || null;
      mpScore = mediaPipeHandedness[0]?.score || 0;
    }
  }

  // 3. Combine signals
  if (mpLabel) {
    const cleanLabel = mpLabel.toLowerCase();
    if (cleanLabel.includes('left')) {
      return 'Left';
    }
    if (cleanLabel.includes('right')) {
      return 'Right';
    }
  }

  // Fallback to geometric cross product
  if (cross > 0.005) {
    return 'Left';
  } else if (cross < -0.005) {
    return 'Right';
  }

  return 'Unknown';
}

/**
 * Single canonical hand landmark preprocessor.
 * 
 * Performs:
 * 1. Handedness detection (MediaPipe + Landmark Geometry)
 * 2. Left-hand horizontal canonical reflection
 * 3. Scale normalization (clamped around training mean span)
 * 4. Centroid translation to canonical center (X=0.529, Y=0.497)
 * 5. Feature array flattening and bounding box calculation
 */
export function normalizeHandLandmarks(
  rawLandmarks: Point3D[] | number[][],
  mediaPipeHandedness?: any,
  options?: {
    forceReflect?: boolean;
    skipCentering?: boolean;
    skipScale?: boolean;
  }
): NormalizedLandmarksResult {
  if (!rawLandmarks || rawLandmarks.length < 21) {
    throw new Error(`Expected at least 21 landmarks, got ${rawLandmarks?.length || 0}`);
  }

  // Convert to standard [x, y, z] array
  const points: number[][] = rawLandmarks.map((lm) => {
    if (Array.isArray(lm)) {
      return [lm[0], lm[1], lm[2] ?? 0];
    }
    return [lm.x, lm.y, lm.z ?? 0];
  });

  // 1. Calculate Bounding Box and Raw Centroid
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let sumX = 0;
  let sumY = 0;

  for (let i = 0; i < 21; i++) {
    const px = points[i][0];
    const py = points[i][1];
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
    sumX += px;
    sumY += py;
  }

  const avgX = sumX / 21;
  const avgY = sumY / 21;
  const bbox: HandBoundingBox = {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };

  // 2. Hand Span (Wrist lm0 to Middle MCP lm9)
  const span = Math.hypot(points[9][0] - points[0][0], points[9][1] - points[0][1]);

  // 3. Framing / Position guidance
  let guidanceFeedback: string | null = null;
  if (span < 0.12) {
    guidanceFeedback = 'Move your hand closer to camera';
  } else if (span > 0.45) {
    guidanceFeedback = 'Move your hand slightly back';
  } else if (avgX < 0.15) {
    guidanceFeedback = 'Move hand toward center';
  } else if (avgX > 0.85) {
    guidanceFeedback = 'Move hand toward center';
  } else if (avgY < 0.15) {
    guidanceFeedback = 'Lower your hand slightly';
  } else if (avgY > 0.85) {
    guidanceFeedback = 'Raise your hand slightly';
  }

  // 4. Handedness & Reflection
  const detectedHand = detectHandedness(rawLandmarks, mediaPipeHandedness);
  const shouldReflect = options?.forceReflect ?? (detectedHand === 'Left');

  // 5. Scale Factor (clamped to prevent extreme distortions)
  const scaleFactor = options?.skipScale ? 1.0 : CANONICAL_SCALE_SPAN / Math.max(0.08, span);
  const clampedScale = Math.max(0.65, Math.min(1.45, scaleFactor));

  // 6. Build Canonical Normalized Landmarks
  const canonical: number[][] = [];
  const flat = new Float32Array(63);

  for (let i = 0; i < 21; i++) {
    const rawX = points[i][0];
    const rawY = points[i][1];
    const rawZ = points[i][2];

    // Horizontal reflection across centroid if Left hand
    const rx = shouldReflect ? (2 * avgX - rawX) : rawX;
    const ry = rawY;

    // Scale around centroid
    const sx = avgX + (rx - avgX) * clampedScale;
    const sy = avgY + (ry - avgY) * clampedScale;

    // Centroid translation to canonical center
    const cx = options?.skipCentering ? sx : (sx - avgX + CANONICAL_CENTER_X);
    const cy = options?.skipCentering ? sy : (sy - avgY + CANONICAL_CENTER_Y);
    const cz = rawZ;

    canonical.push([cx, cy, cz]);

    // Populate flat array
    flat[i * 3] = cx;
    flat[i * 3 + 1] = cy;
    flat[i * 3 + 2] = cz;
  }

  return {
    canonicalLandmarks: canonical,
    flatFeatures: flat,
    detectedHand,
    wasReflected: shouldReflect,
    handSpan: span,
    rawCentroid: { x: avgX, y: avgY },
    boundingBox: bbox,
    guidanceFeedback,
  };
}
