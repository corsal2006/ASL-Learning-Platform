@echo off
echo ===================================================
echo   Starting ASL Learning Platform (SIGNVISION)
echo ===================================================

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "ASL Backend (FastAPI)" cmd /k "cd backend && python main.py"

echo [2/2] Starting Next.js Frontend on port 3000...
start "ASL Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
echo Opening web application at http://localhost:3000 ...
start http://localhost:3000

echo ===================================================
echo   ASL Platform is running!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000/docs
echo ===================================================
