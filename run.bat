@echo off
rem Starts the AlgoMind backend + frontend and opens the dashboard.
cd /d "%~dp0"
set OPEN_BROWSER=1
Backend\venv\Scripts\python.exe Backend\app.py
