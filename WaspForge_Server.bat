@echo off
title WaspForge Server
color 0A
cls
echo.
echo  WaspForge v2.0 - AI Script Factory
echo  ====================================
echo.

cd /d "%~dp0web"

echo  [*] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found. Install from nodejs.org then rerun.
    pause
    exit
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  [+] Node.js %NODE_VER% found
echo.
echo  ============================================
echo   Local:     http://localhost:7734
echo   iPhone:    http://100.103.210.69:7734
echo   Network:   http://%COMPUTERNAME%:7734
echo  ============================================
echo.
echo  Open any URL above in your browser.
echo  On iPhone via Tailscale: http://100.103.210.69:7734
echo.
echo  Press Ctrl+C to stop.
echo.

start "" "http://localhost:7734"
npx serve . -l 7734 --no-clipboard -s

pause
