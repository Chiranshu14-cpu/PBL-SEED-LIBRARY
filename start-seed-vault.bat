@echo off
title Seed Vault - Quick Launcher
echo =======================================================
echo   SEED VAULT: Village Seed Library Management Platform
echo =======================================================
echo.

:: 1. Start MongoDB
echo [1/3] Starting MongoDB database...
start "Seed Vault - MongoDB" "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath "%~dp0data\db" --bind_ip 127.0.0.1 --port 27017

timeout /t 2 /nobreak >nul

:: 2. Start Backend Server
echo [2/3] Starting Node.js / Express Backend (Port 5000)...
start "Seed Vault - Backend" cmd /k "cd /d %~dp0 && node server/server.js"

timeout /t 2 /nobreak >nul

:: 3. Start Frontend Client
echo [3/3] Starting Vite Frontend (Port 5173)...
start "Seed Vault - Frontend" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 3 /nobreak >nul

:: Open in Browser
echo.
echo Opening Seed Vault in your browser...
start http://localhost:5173/

echo.
echo =======================================================
echo   All services launched! You can keep this window or close it.
echo =======================================================
pause
