from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ASL Learning API",
    description="REST API for ASL sign language learning platform with local CV and Luna AI tutor",
    version="1.0.0"
)

# CORS configuration for frontend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

for url in frontend_url.split(","):
    url = url.strip()
    if url and "localhost" not in url:
        origins.append(url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Lessons Router (Alphabet, Words, Phrases, Numbers, Conversation)
try:
    from routes import lessons
    app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
    lessons_available = True
except Exception as e:
    print(f"Warning: Could not load lessons route: {e}")
    lessons_available = False

# 2. Recognition Router (Intelligent Feedback and Evaluation)
try:
    from routes import recognition
    app.include_router(recognition.router, prefix="/api/recognition", tags=["recognition"])
    recognition_available = True
except Exception as e:
    print(f"Warning: Could not load recognition route: {e}")
    recognition_available = False

# 3. AI Tutor Router (Luna Groq/Fallback Chat, Explanation, Lesson Help)
try:
    from routes import ai
    app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
    ai_available = True
except Exception as e:
    print(f"Warning: Could not load AI route: {e}")
    ai_available = False

# 4. Progress Router (Supabase / Local persistence)
try:
    from routes import progress
    app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
    progress_available = True
except Exception as e:
    print(f"Notice: Progress route initialized with local storage parity: {e}")
    progress_available = False

# 5. Hand Detection Router (Server-side optional OpenCV/MediaPipe)
try:
    from routes import hand_detection
    app.include_router(hand_detection.router, prefix="/api/hand-detection", tags=["hand-detection"])
    hand_detection_available = True
except Exception as e:
    hand_detection_available = False


@app.get("/")
async def root():
    """Root health check endpoint"""
    return {
        "message": "SIGNVISION ASL Learning API",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
@app.get("/api/health")
async def health_check():
    """Detailed health check for all platform services"""
    db_status = "not_configured"
    supabase_status = "not_configured"

    try:
        from database.supabase import supabase, SessionLocal
        if SessionLocal is not None:
            db_status = "connected"
        if supabase is not None:
            supabase_status = "connected"
    except Exception:
        pass

    return {
        "status": "healthy",
        "database": db_status,
        "supabase": supabase_status,
        "services": {
            "lessons": lessons_available,
            "recognition": recognition_available,
            "ai_tutor": ai_available,
            "progress": progress_available,
            "hand_detection": hand_detection_available,
        },
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
