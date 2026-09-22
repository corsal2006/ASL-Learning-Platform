from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter()

class RecognitionFeedbackRequest(BaseModel):
    targetSign: str
    detectedSign: Optional[str] = None
    confidence: float
    landmarks: Optional[List[Dict[str, float]]] = None

class RecognitionFeedbackResponse(BaseModel):
    status: str
    feedback: str
    isCorrect: bool
    suggestions: List[str]

@router.post("/feedback", response_model=RecognitionFeedbackResponse)
async def generate_feedback(req: RecognitionFeedbackRequest):
    """Generate intelligent correction and feedback for webcam recognition"""
    target = req.targetSign.upper()
    detected = (req.detectedSign or "").upper()
    conf = req.confidence

    is_correct = (target == detected and conf >= 0.70)

    if is_correct:
        status = "RECOGNIZED"
        feedback = f"Excellent! Clean {target} handshape detected with {round(conf * 100)}% stability."
        suggestions = ["Hold for 1 more second to lock in mastery", "Ready for next sign"]
    elif target == detected and conf < 0.70:
        status = "ANALYZING"
        feedback = f"Almost there! Sign {target} detected but hold steadier inside the camera guide."
        suggestions = ["Ensure adequate frontal lighting", "Keep hand centered at chest height"]
    elif detected:
        status = "LOW_CONFIDENCE"
        feedback = f"Detecting {detected} ({round(conf * 100)}%). Adjust your fingers to clearly form {target}."
        suggestions = [
            f"Check thumb placement for letter {target}",
            "Relax your wrist and face palm outward"
        ]
    else:
        status = "WAITING"
        feedback = "Position your hand inside the cybernetic frame to begin recognition."
        suggestions = ["Make sure your whole hand is visible to the camera"]

    return RecognitionFeedbackResponse(
        status=status,
        feedback=feedback,
        isCorrect=is_correct,
        suggestions=suggestions
    )
