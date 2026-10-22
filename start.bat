@echo off
setlocal
cd /d "%~dp0"
where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] pnpm was not found in PATH.
  echo Install pnpm or run: npm install -g pnpm
  exit /b 1
)
if not exist node_modules (
  echo [INFO] Installing locked dependencies...
  call pnpm install --frozen-lockfile
  if errorlevel 1 exit /b 1
)
echo [INFO] Opening development server at http://127.0.0.1:5173
call pnpm dev
