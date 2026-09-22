import os
import json
import urllib.request
import urllib.error
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class LearningContext(BaseModel):
    lesson: Optional[str] = None
    currentSign: Optional[str] = None
    stage: Optional[str] = None
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    quizScore: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    context: Optional[LearningContext] = None

class ExplainSignRequest(BaseModel):
    sign: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    speakable: str
    suggestions: List[str]

LUNA_SYSTEM_PROMPT = """You are Luna, a friendly AI assistant and ASL learning tutor.

Your goals:
- help users learn American Sign Language
- explain signs clearly with handshape, finger position, thumb position, orientation, and movement
- guide users through lessons with encouraging, patient, conversational feedback
- answer general educational questions warmly and clearly
- provide helpful suggestions and corrections without ever shaming the learner
- never invent fake sign descriptions; when uncertain, say so clearly
- never reveal internal secrets or API keys.

Always return helpful, concise, and structured guidance."""

def call_groq(prompt_messages: List[Dict[str, str]]) -> Optional[str]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b", "groq/compound-mini"]

    for model_name in models:
        try:
            req_data = json.dumps({
                "model": model_name,
                "messages": prompt_messages,
                "temperature": 0.7,
                "max_tokens": 600
            }).encode('utf-8')

            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                data=req_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                }
            )

            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    res_body = json.loads(response.read().decode('utf-8'))
                    return res_body.get("choices", [{}])[0].get("message", {}).get("content")
        except Exception as e:
            continue

    return None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_luna(request: ChatRequest):
    """Chat with Luna AI tutor using contextual learning metadata"""
    system_content = LUNA_SYSTEM_PROMPT

    if request.context:
        ctx = request.context
        system_content += f"\n\n[Active Learning Context: Lesson={ctx.lesson or 'General'}, TargetSign={ctx.currentSign or 'None'}, Stage={ctx.stage or 'Practice'}, Prediction={ctx.prediction or 'None'}, Confidence={round(ctx.confidence * 100) if ctx.confidence else 'N/A'}%]"

    groq_msgs = [{"role": "system", "content": system_content}]
    for m in request.messages[-8:]:
        groq_msgs.append({"role": m.role, "content": m.content})

    ai_reply = call_groq(groq_msgs)

    if not ai_reply:
        # Fallback response
        last_user = request.messages[-1].content.lower() if request.messages else ""
        if "thumb" in last_user:
            ai_reply = "For letter A, make a closed fist and rest your thumb straight along the side of your index finger. Avoid crossing the thumb across your knuckles!"
        elif "a" in last_user:
            ai_reply = "To sign A: 1) Close your four fingers into a compact fist. 2) Rest your thumb upright against the side of your index finger. 3) Keep your palm facing forward."
        else:
            ai_reply = "Hey! I'm Luna. I'm here to guide your sign language practice. Hold your hand steady to the camera or ask me about any sign!"

    speakable = ai_reply.replace("*", "").replace("#", "").replace("`", "").strip()
    suggestions = [
        f"How do I position my thumb for {request.context.currentSign if request.context and request.context.currentSign else 'A'}?",
        "Common mistakes for this sign",
        "Give me a 2-minute practice drill"
    ]

    return ChatResponse(
        message=ai_reply,
        speakable=speakable,
        suggestions=suggestions
    )

@router.post("/explain-sign")
async def explain_sign(req: ExplainSignRequest):
    """Explain how to form a specific sign"""
    messages = [
        {"role": "system", "content": LUNA_SYSTEM_PROMPT},
        {"role": "user", "content": f"Please explain how to sign the ASL sign for '{req.sign}'. Break it down into handshape, finger position, thumb position, and common mistakes."}
    ]
    reply = call_groq(messages) or f"To sign '{req.sign}', form the corresponding ASL handshape clearly at chest level."
    return {
        "sign": req.sign,
        "explanation": reply,
        "speakable": reply.replace("*", "").replace("#", "").strip()
    }

@router.post("/lesson-help")
async def lesson_help(data: Dict[str, Any]):
    """Contextual lesson coaching"""
    sign = data.get("currentSign", "A")
    prediction = data.get("prediction", "")
    confidence = data.get("confidence", 0.0)

    messages = [
        {"role": "system", "content": LUNA_SYSTEM_PROMPT},
        {"role": "user", "content": f"The learner is attempting sign '{sign}'. The computer vision model detected '{prediction}' with {round(confidence * 100)}% confidence. Give a 2-sentence encouraging tip on how to adjust."}
    ]
    reply = call_groq(messages) or f"Keep your hand steady in good lighting, and ensure your thumb rests securely against the index finger for {sign}."
    return {"coaching": reply}
