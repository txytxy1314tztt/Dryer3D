@echo off
setlocal
cd /d "%~dp0"
where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] pnpm was not found in PATH.
  exit /b 1
)
if not exist node_modules (
  echo [INFO] Installing locked dependencies...
  call pnpm install --frozen-lockfile
  if errorlevel 1 exit /b 1
)
echo [INFO] Building the production site...
call pnpm build
if errorlevel 1 exit /b 1
echo [INFO] Starting production preview. Open the Local URL printed by Vite.
call pnpm preview -- --host 127.0.0.1 --port 4173
