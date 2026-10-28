@echo off
cd /d "%~dp0"
call node "node_modules\vite\bin\vite.js" --port 3000 --host 0.0.0.0

