/**
 * Client library for server-side hand detection
 * Used when performance mode is set to 'max_performance'
 */

export interface ServerLandmark {
  x: number;
  y: number;
  z: number;
}

export interface ServerHandDetectionResponse {
  landmarks: ServerLandmark[][];
  hand_count: number;
  annotated_image?: string;
}

function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== '') {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return ''; // In production (Vercel), relative path proxies via Vercel rewrites
    }
  }
  return 'http://localhost:8000';
}

/**
 * Send frame to server for hand detection
 */
export async function detectHandsOnServer(
  imageDataUrl: string,
  returnAnnotatedImage: boolean = false
): Promise<ServerHandDetectionResponse> {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/api/hand-detection/detect-hands`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        return_annotated_image: returnAnnotatedImage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server detection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server hand detection error:', error);
    throw error;
  }
}

/**
 * Convert server landmarks to MediaPipe format for compatibility
 */
export function convertServerLandmarksToMediaPipe(serverLandmarks: ServerLandmark[][]): any {
  return {
    multiHandLandmarks: serverLandmarks.map(hand =>
      hand.map(landmark => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
      }))
    ),
    multiHandedness: serverLandmarks.map((_, index) => ({
      index,
      score: 1.0,
      label: 'Unknown',
    })),
  };
}
