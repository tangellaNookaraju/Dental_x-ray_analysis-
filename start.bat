@echo off
echo 🦷 Starting DentAI Application...
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start cmd /k "cd client && npm start"

echo.
echo ✅ DentAI is starting!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend:  http://localhost:5000
echo.
echo Press Ctrl+C in each window to stop the servers
pause
