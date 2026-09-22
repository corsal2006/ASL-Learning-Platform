import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LearningContext {
  lesson?: string;
  currentSign?: string;
  stage?: string;
  prediction?: string;
  confidence?: number;
  quizScore?: string;
}

const LUNA_SYSTEM_PROMPT = `You are Luna, a friendly AI assistant and ASL learning tutor.

Your goals:
- help users learn American Sign Language
- explain signs clearly (handshape, finger position, thumb position, movement, orientation)
- guide users through lessons with encouraging, patient, conversational feedback
- answer general educational questions warmly and clearly
- provide helpful suggestions and corrections without ever shaming the learner
- never invent fake sign descriptions; when uncertain, say so clearly
- never reveal internal secrets, keys, or technical implementation details.

Always return helpful, concise, and structured guidance.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], context = {} } = body as {
      messages: Message[];
      context?: LearningContext;
    };

    const apiKey = process.env.GROQ_API_KEY;

    let contextualSystem = LUNA_SYSTEM_PROMPT;
    if (context && (context.currentSign || context.lesson || context.prediction)) {
      contextualSystem += `\n\n[Active Learning Context:
- Lesson: ${context.lesson || 'Alphabet'}
- Target Sign: ${context.currentSign || 'A'}
- Learning Stage: ${context.stage || 'Practice'}
- CV Prediction: ${context.prediction || 'None'}
- Confidence: ${context.confidence ? `${Math.round(context.confidence * 100)}%` : 'N/A'}]`;
    }

    const groqMessages: Message[] = [
      { role: 'system', content: contextualSystem },
      ...messages.slice(-8),
    ];

    if (!apiKey) {
      return NextResponse.json(generateFallback(messages, context));
    }

    const availableModels = [
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'groq/compound-mini',
    ];

    let replyText: string | null = null;
    for (const model of availableModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.choices?.[0]?.message?.content;
          if (replyText) break;
        }
      } catch (e) {
        // try next
      }
    }

    if (!replyText) {
      return NextResponse.json(generateFallback(messages, context));
    }

    const speakable = replyText.replace(/[*#_`]/g, '').trim();
    const suggestions = [
      `How do I position my thumb for ${context.currentSign || 'A'}?`,
      'Common mistakes for this sign',
      'Quiz me on what I learned',
    ];

    return NextResponse.json({
      message: replyText,
      speakable,
      suggestions,
    });
  } catch (err) {
    return NextResponse.json(generateFallback([], {}));
  }
}

function generateFallback(messages: Message[], context: LearningContext) {
  const sign = context.currentSign || 'A';
  return {
    message: `To sign ${sign}, hold your hand upright at chest level with palm facing forward. Check that your fingers are clearly formed according to the 3-step guide!`,
    speakable: `To sign ${sign}, hold your hand upright at chest level with palm facing forward. Check that your fingers are clearly formed.`,
    suggestions: [
      `How do I sign ${sign}?`,
      'Why is my sign wrong?',
      'Quiz me',
    ],
  };
}
