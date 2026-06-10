@echo off
:: Baclone Quick Setup Script for Windows
:: Automated by Antigravity AI

title Baclone Setup Wizard
echo =======================================================================
echo                 Baclone (Video-to-Backend Reverse Engineer)            
echo                            Setup Wizard (Windows)                      
echo =======================================================================
echo.

:: 1. Check Node.js installation
echo [1/4] Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed or not added to your PATH!
    echo Please download and install Node.js (v18 or higher) from: https://nodejs.org/
    echo After installing, reopen this command prompt and run setup.bat again.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo - Node.js is installed (%NODE_VER%)
echo.

:: 2. Prompt for Gemini API Key
echo [2/4] Configuring environment variables...
echo To use real video analysis, you need a Google Gemini API Key.
echo You can get a free key from Google AI Studio: https://aistudio.google.com/
echo.
set /p GEMINI_KEY="Enter your VITE_GEMINI_API_KEY (press Enter to skip and use Mock Mode): "

:: Remove quotes if entered by user
if defined GEMINI_KEY set GEMINI_KEY=%GEMINI_KEY:"=%

:: 3. Create .env files
echo.
if "%GEMINI_KEY%"=="" (
    echo WARNING: No API key provided. Baclone will run in Mock Mode.
    echo (You can add the key manually to the .env file later)
    echo VITE_GEMINI_API_KEY= > .env
    echo VITE_GEMINI_API_KEY= > appvision\.env
) else (
    echo API Key detected. Configuring real-analysis mode...
    echo VITE_GEMINI_API_KEY=%GEMINI_KEY% > .env
    echo VITE_GEMINI_API_KEY=%GEMINI_KEY% > appvision\.env
    echo - Created root .env
    echo - Created appvision/.env
)
echo.

:: 4. Install dependencies
echo [3/4] Installing dependencies in appvision...
cd appvision
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install npm packages!
    echo Please make sure you have an active internet connection and try running setup.bat again.
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..
echo - Dependencies installed successfully.
echo.

:: 5. Success and start instructions
echo [4/4] Setup complete!
echo =======================================================================
echo  Baclone has been set up successfully.
echo =======================================================================
echo.
if "%GEMINI_KEY%"=="" (
    echo  Current Mode: MOCK MODE (Simulated video analysis)
) else (
    echo  Current Mode: REAL ANALYSIS (Uses Google Gemini API)
)
echo.
echo  To start the application:
echo    1. cd appvision
echo    2. npm run dev
echo.
echo  Or run this command directly to start immediately:
echo    npm --prefix appvision run dev
echo.
echo  Open http://localhost:5173 in your browser once the server starts.
echo =======================================================================
pause
