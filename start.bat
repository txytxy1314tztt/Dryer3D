@echo off
setlocal
cd /d "%~dp0"
where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] pnpm was not found in PATH.
  echo Install pnpm or run: npm install -g pnpm
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found in PATH.
  echo Install the current Node.js LTS from https://nodejs.org/
  exit /b 1
)
echo [INFO] Node:
node --version
echo [INFO] pnpm:
pnpm --version
if not exist node_modules (
  echo [INFO] Installing locked dependencies...
  call pnpm install --frozen-lockfile
  if errorlevel 1 exit /b 1
)
echo [INFO] Starting development server. Open the Local URL printed by Vite.
call pnpm dev -- --port 5173
