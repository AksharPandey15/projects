@echo off
title Critical System Breach
color 0A
cls

echo Initiating kernel breach...
timeout /t 1 >nul

:loop
echo [DEBUG %time%] 0x%random%%random% -^> MEMORY CORRUPTED AT BLOCK 0x%random%
goto loop