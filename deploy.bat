@echo off
cd /d %~dp0
git add -A
git commit -m "WaspForge update - %date% %time%"
git push origin master
echo.
echo Push complete.
pause
