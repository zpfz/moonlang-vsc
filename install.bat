@echo off
setlocal enabledelayedexpansion

echo === MoonLang Extension Installer ===
echo.
echo [1] Install for VS Code
echo [2] Install for Cursor
echo [3] Install for Both
echo.
set /p choice="Select option (1/2/3): "

cd /d "%~dp0"

REM 从 package.json 读取版本号
for /f "tokens=2 delims=:," %%a in ('findstr /C:"\"version\"" package.json') do (
    set "VER=%%~a"
    set "VER=!VER: =!"
    set "VER=!VER:"=!"
)
echo Detected version: %VER%

REM 自动查找最新的 vsix 文件
set "VSIX_FILE="
for %%f in (moonlang-*.vsix) do (
    set "VSIX_FILE=%%f"
)

if defined VSIX_FILE (
    echo Found VSIX: %VSIX_FILE%
) else (
    echo No .vsix found, will copy files directly.
)
echo.

if "%choice%"=="1" goto vscode
if "%choice%"=="2" goto cursor
if "%choice%"=="3" goto both
echo Invalid option.
goto end

:vscode
call :install_to "%USERPROFILE%\.vscode\extensions\greenteng.moonlang-%VER%" "VS Code" "code"
goto end

:cursor
call :install_to "%USERPROFILE%\.cursor\extensions\greenteng.moonlang-%VER%" "Cursor" "cursor"
goto end

:both
call :install_to "%USERPROFILE%\.vscode\extensions\greenteng.moonlang-%VER%" "VS Code" "code"
call :install_to "%USERPROFILE%\.cursor\extensions\greenteng.moonlang-%VER%" "Cursor" "cursor"
goto end

:install_to
set "TARGET=%~1"
set "NAME=%~2"
set "CLI=%~3"

echo.
echo Installing for %NAME%...

REM 尝试使用 CLI 安装 vsix
if defined VSIX_FILE (
    where %CLI% >nul 2>&1
    if !errorlevel! equ 0 (
        echo Using %CLI% CLI to install...
        %CLI% --install-extension "%VSIX_FILE%"
        if !errorlevel! equ 0 (
            echo [OK] %NAME% installation complete via CLI.
            goto :eof
        )
    )
    echo CLI not available, extracting VSIX...
    call :extract_vsix "%TARGET%"
) else (
    call :copy_files "%TARGET%"
)

echo [OK] %NAME% installation complete.
goto :eof

:extract_vsix
set "EXTRACT_TARGET=%~1"

if exist "%EXTRACT_TARGET%" (
    echo Removing existing: %EXTRACT_TARGET%
    rmdir /s /q "%EXTRACT_TARGET%"
)

echo Extracting to: %EXTRACT_TARGET%

set "TEMP_DIR=%TEMP%\moonlang-vsix-temp"
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

powershell -Command "Expand-Archive -Path '%VSIX_FILE%' -DestinationPath '%TEMP_DIR%' -Force"

if exist "%TEMP_DIR%\extension" (
    xcopy /s /e /y /q "%TEMP_DIR%\extension\*" "%EXTRACT_TARGET%\" >nul
) else (
    xcopy /s /e /y /q "%TEMP_DIR%\*" "%EXTRACT_TARGET%\" >nul
)

rmdir /s /q "%TEMP_DIR%"
goto :eof

:copy_files
set "COPY_TARGET=%~1"

if exist "%COPY_TARGET%" (
    echo Removing existing: %COPY_TARGET%
    rmdir /s /q "%COPY_TARGET%"
)

echo Copying files to: %COPY_TARGET%

mkdir "%COPY_TARGET%" 2>nul
mkdir "%COPY_TARGET%\syntaxes" 2>nul
mkdir "%COPY_TARGET%\snippets" 2>nul
mkdir "%COPY_TARGET%\icons" 2>nul
mkdir "%COPY_TARGET%\images" 2>nul

copy /y "package.json" "%COPY_TARGET%\" >nul
copy /y "extension.js" "%COPY_TARGET%\" >nul
copy /y "language-configuration.json" "%COPY_TARGET%\" >nul
copy /y "README.md" "%COPY_TARGET%\" >nul

if exist "syntaxes\moonlang.tmLanguage.json" (
    copy /y "syntaxes\moonlang.tmLanguage.json" "%COPY_TARGET%\syntaxes\" >nul
)
if exist "snippets\moonlang.json" (
    copy /y "snippets\moonlang.json" "%COPY_TARGET%\snippets\" >nul
)
if exist "icons\moonlang-file-icon-theme.json" (
    copy /y "icons\moonlang-file-icon-theme.json" "%COPY_TARGET%\icons\" >nul
)
if exist "images\moonlang-icon.png" (
    copy /y "images\moonlang-icon.png" "%COPY_TARGET%\images\" >nul
)
if exist "images\moonlang-icon.svg" (
    copy /y "images\moonlang-icon.svg" "%COPY_TARGET%\images\" >nul
)
goto :eof

:end
echo.
echo === Done ===
echo Please COMPLETELY CLOSE and reopen VS Code / Cursor to activate.
echo.
pause
