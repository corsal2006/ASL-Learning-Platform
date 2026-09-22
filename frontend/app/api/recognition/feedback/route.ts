import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetSign = 'A', detectedSign = '', confidence = 0.0 } = body;

    const target = targetSign.toUpperCase();
    const detected = detectedSign.toUpperCase();

    const isCorrect = target === detected && confidence >= 0.70;

    let status = 'WAITING';
    let feedback = 'Position your hand inside the frame to begin recognition.';
    let suggestions = ['Make sure your whole hand is visible to the camera'];

    if (isCorrect) {
      status = 'RECOGNIZED';
      feedback = `Excellent! Clean ${target} handshape detected with ${Math.round(confidence * 100)}% stability.`;
      suggestions = ['Hold for 1 more second to lock in mastery', 'Ready for next sign'];
    } else if (target === detected && confidence < 0.70) {
      status = 'ANALYZING';
      feedback = `Almost there! Sign ${target} detected. Hold steadier inside the guide.`;
      suggestions = ['Ensure good lighting', 'Hold hand centered at chest height'];
    } else if (detected) {
      status = 'LOW_CONFIDENCE';
      feedback = `Detecting ${detected} (${Math.round(confidence * 100)}%). Adjust your fingers to clearly form ${target}.`;
      suggestions = [
        `Check thumb placement for ${target}`,
        'Relax your wrist and face palm outward',
      ];
    }

    return NextResponse.json({
      status,
      feedback,
      isCorrect,
      suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'ERROR', feedback: 'Recognition evaluation error', isCorrect: false, suggestions: [] },
      { status: 400 }
    );
  }
}
