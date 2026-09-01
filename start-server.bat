@echo off
setlocal
cd /d "%~dp0"
if not defined PORT set "PORT=8091"
echo ShadowsAndPetals local server: http://localhost:%PORT%
echo Press Ctrl+C to stop.
node server.js
if errorlevel 1 (
  echo.
  echo Server failed. Please install Node.js 18 or newer and try again.
  pause
)
