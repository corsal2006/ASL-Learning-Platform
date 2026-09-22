"""Vercel entry point for the FastAPI application."""

from pathlib import Path
import sys


BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from main import app  # noqa: E402
