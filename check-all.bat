@echo off
setlocal
cd /d "%~dp0"
echo [1/4] Physics consistency
call pnpm physics:test
if errorlevel 1 exit /b 1
echo [2/4] Unit tests
call pnpm test
if errorlevel 1 exit /b 1
echo [3/4] TypeScript and production build
call pnpm build
if errorlevel 1 exit /b 1
echo [4/4] Chrome and Edge end-to-end tests
call pnpm test:e2e
if errorlevel 1 exit /b 1
echo [PASS] All configured checks completed.
