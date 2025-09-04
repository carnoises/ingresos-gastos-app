@echo off
echo Starting backend server...
cd "D:\Programas Web\IngresosGatos\backend"
call venv\Scripts\activate.bat
uvicorn main:app --reload --port 8000 --host 0.0.0.0