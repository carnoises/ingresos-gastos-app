@echo off
echo Starting backend and frontend in background...

REM Start Backend
start /b cmd /c "cd /d "D:\Programas Web\IngresosGatos\backend" && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

REM Start Frontend
start /b cmd /c "cd /d "D:\Programas Web\IngresosGatos\frontend" && npm start"

echo Servers started. Check Task Manager for processes.
echo WARNING: No console output will be visible. Debugging will be difficult.
