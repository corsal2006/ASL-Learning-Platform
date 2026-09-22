from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any

try:
    from database.supabase import supabase
except Exception:
    supabase = None

router = APIRouter()

# Comprehensive 5-Level ASL Curriculum Data
ALPHABET_LESSONS = [
    {
        "id": i + 1,
        "title": f"Letter {chr(65 + i)}",
        "letter": chr(65 + i),
        "sign": chr(65 + i),
        "description": f"Learn to form and sign the ASL alphabet letter {chr(65 + i)}.",
        "category": "alphabet",
        "level": 1,
        "difficulty": "beginner" if i < 10 else "intermediate",
        "image_url": f"https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/{chr(97 + i)}.gif",
        "instructions": [
            f"Review the visual hand posture for {chr(65 + i)}.",
            "Form your hand into the required anatomical placement.",
            "Hold steadily in front of your camera to test your recognition."
        ]
    }
    for i in range(26)
]

WORD_LESSONS = [
    {"id": 101, "title": "Hello", "sign": "HELLO", "category": "words", "level": 2, "description": "Friendly greeting similar to a soft temple salute.", "meaning": "Greeting"},
    {"id": 102, "title": "Thank You", "sign": "THANK YOU", "category": "words", "level": 2, "description": "Fingertips to chin, release forward toward the listener.", "meaning": "Gratitude"},
    {"id": 103, "title": "Please", "sign": "PLEASE", "category": "words", "level": 2, "description": "Open flat hand circling gently on the chest.", "meaning": "Polite request"},
    {"id": 104, "title": "Sorry", "sign": "SORRY", "category": "words", "level": 2, "description": "Fist with thumb resting over heart, small circular rubs.", "meaning": "Apology"},
    {"id": 105, "title": "Yes", "sign": "YES", "category": "words", "level": 2, "description": "Fist held upright, pivoting wrist up and down like a nodding head.", "meaning": "Affirmation"},
    {"id": 106, "title": "No", "sign": "NO", "category": "words", "level": 2, "description": "Index and middle fingers snap down onto thumb pad.", "meaning": "Negation"},
    {"id": 107, "title": "Good", "sign": "GOOD", "category": "words", "level": 2, "description": "Touch flat hand to chin, descend into base hand palm.", "meaning": "Positive condition"},
    {"id": 108, "title": "Help", "sign": "HELP", "category": "words", "level": 2, "description": "Thumbs-up fist placed on flat base palm and lifted together.", "meaning": "Assistance"},
    {"id": 109, "title": "Friend", "sign": "FRIEND", "category": "words", "level": 2, "description": "Hook index fingers together, unhook, reverse and hook opposite.", "meaning": "Companionship"},
    {"id": 110, "title": "Water", "sign": "WATER", "category": "words", "level": 2, "description": "W handshape tapping side of index finger twice on lower lip.", "meaning": "Hydration"},
    {"id": 111, "title": "Family", "sign": "FAMILY", "category": "words", "level": 2, "description": "Two F handshapes touching and circling outward to pinkies.", "meaning": "Kinship"},
]

PHRASE_LESSONS = [
    {"id": 201, "title": "How Are You?", "sign": "HOW ARE YOU?", "category": "phrases", "level": 3, "description": "Inquiring about wellbeing with lowered eyebrows.", "breakdown": ["HOW", "YOU"]},
    {"id": 202, "title": "Nice to Meet You", "sign": "NICE TO MEET YOU", "category": "phrases", "level": 3, "description": "Dominant palm across base palm, index fingers meet, point forward.", "breakdown": ["NICE", "MEET", "YOU"]},
    {"id": 203, "title": "My Name Is...", "sign": "MY NAME IS...", "category": "phrases", "level": 3, "description": "Palm to chest for MY, crossed fingers for NAME, fingerspell name.", "breakdown": ["MY", "NAME", "NAME-SPELL"]},
    {"id": 204, "title": "See You Later", "sign": "SEE YOU LATER", "category": "phrases", "level": 3, "description": "V-hand from eyes, point for YOU, L-pivot for LATER.", "breakdown": ["SEE", "YOU", "LATER"]},
    {"id": 205, "title": "What is Your Name?", "sign": "WHAT IS YOUR NAME?", "category": "phrases", "level": 3, "description": "Point for YOU, tap crossed fingers for NAME, open palms shake for WHAT.", "breakdown": ["YOU", "NAME", "WHAT"]},
    {"id": 206, "title": "Thank You Very Much", "sign": "THANK YOU VERY MUCH", "category": "phrases", "level": 3, "description": "Both flat hands touch chin and project forward with warm nod.", "breakdown": ["THANK-YOU", "BOTH-HANDS"]},
]

NUMBER_LESSONS = [
    {"id": 301, "title": "Number 1", "sign": "1", "category": "numbers", "level": 4, "description": "Index finger upright, palm facing inward toward body."},
    {"id": 302, "title": "Number 2", "sign": "2", "category": "numbers", "level": 4, "description": "Index and middle fingers upright in a V, palm inward."},
    {"id": 303, "title": "Number 3", "sign": "3", "category": "numbers", "level": 4, "description": "Thumb, index, and middle extended, palm inward."},
    {"id": 304, "title": "Number 4", "sign": "4", "category": "numbers", "level": 4, "description": "Four fingers upright with thumb tucked, palm inward."},
    {"id": 305, "title": "Number 5", "sign": "5", "category": "numbers", "level": 4, "description": "All five fingers spread open and upright, palm inward."},
    {"id": 306, "title": "Number 6", "sign": "6", "category": "numbers", "level": 4, "description": "Thumb touches pinky fingernail, palm facing outward."},
    {"id": 307, "title": "Number 7", "sign": "7", "category": "numbers", "level": 4, "description": "Thumb touches ring finger, palm facing outward."},
    {"id": 308, "title": "Number 8", "sign": "8", "category": "numbers", "level": 4, "description": "Thumb touches middle finger, palm facing outward."},
    {"id": 309, "title": "Number 9", "sign": "9", "category": "numbers", "level": 4, "description": "Thumb touches index finger (F handshape), palm outward."},
    {"id": 310, "title": "Number 10", "sign": "10", "category": "numbers", "level": 4, "description": "Thumbs-up fist shaking or twisting gently side to side."},
]

CONVERSATION_LESSONS = [
    {"id": 401, "title": "Warm Greetings", "sign": "GREETINGS", "category": "conversation", "level": 5, "description": "Daily encounter exchange: Hello, How Are You, and I am Good."},
    {"id": 402, "title": "Introductions & Names", "sign": "INTRODUCTIONS", "category": "conversation", "level": 5, "description": "Exchanging personal names and expressing Nice To Meet You."},
    {"id": 403, "title": "Asking for Assistance", "sign": "ASSISTANCE", "category": "conversation", "level": 5, "description": "Requesting help politely with directional signs."},
    {"id": 404, "title": "Parting & Farewell", "sign": "FAREWELL", "category": "conversation", "level": 5, "description": "Social farewells, thankfulness, and See You Later."},
]

ALL_LESSONS = (
    ALPHABET_LESSONS
    + WORD_LESSONS
    + PHRASE_LESSONS
    + NUMBER_LESSONS
    + CONVERSATION_LESSONS
)

@router.get("/")
async def get_lessons(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    level: Optional[int] = None
):
    """Get all lessons with fallback to built-in 5-level curriculum"""
    if supabase is not None:
        try:
            query = supabase.table('lessons').select('*')
            if category:
                query = query.eq('category', category)
            response = query.range(skip, skip + limit - 1).execute()
            if response.data:
                return response.data
        except Exception:
            pass

    results = ALL_LESSONS
    if category:
        results = [l for l in results if l.get("category") == category]
    if level:
        results = [l for l in results if l.get("level") == level]
    return results[skip: skip + limit]

@router.get("/{lesson_id}")
async def get_lesson(lesson_id: int):
    """Get a specific lesson by ID across all curriculum levels"""
    if supabase is not None:
        try:
            response = supabase.table('lessons').select('*').eq('id', lesson_id).execute()
            if response.data:
                return response.data[0]
        except Exception:
            pass

    for l in ALL_LESSONS:
        if l["id"] == lesson_id:
            return l

    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")

@router.get("/category/{category}")
async def get_lessons_by_category(category: str):
    """Get all lessons in a specific category (alphabet, words, phrases, numbers, conversation)"""
    return await get_lessons(category=category)
