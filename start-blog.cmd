@echo off
setlocal
title Kill Me Baby Diary - dev server
cd /d "%~dp0"

set "DSH_RUNTIME=C:\Users\31000\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies"
set "DSH_NODE=%DSH_RUNTIME%\node\bin\node.exe"
set "DSH_PNPM=%DSH_RUNTIME%\pnpm\bin\pnpm.mjs"
set "URL=http://localhost:5180/"

rem ---- already running? just open the browser ----
netstat -ano | findstr ":5180" | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo.
    echo   Server is already running. Opening browser...
    start "" %URL%
    timeout /t 3 >nul
    exit /b
)

echo.
echo   ------------------------------------------
echo     Kill Me Baby Diary
echo     %URL%
echo   ------------------------------------------
echo.
echo   Browser opens in a few seconds.
echo   Close this window to stop the server.
echo.

if exist "%DSH_NODE%" (
    set "PATH=%DSH_RUNTIME%\node\bin;%PATH%"
) else (
    echo   [warn] bundled Node not found, falling back to system node.
    echo.
)

start "" /min cmd /c "timeout /t 5 >nul & start %URL%"

if exist "%DSH_NODE%" (
    "%DSH_NODE%" "%DSH_PNPM%" dev
) else (
    call pnpm dev
)

echo.
echo   Server stopped. Press any key to close.
pause >nul
endlocal
