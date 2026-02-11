@echo off
setlocal enabledelayedexpansion

echo === MoonLang Cursor Extension Installer ===
echo.

cd /d "%~dp0"

REM 自动查找最新的 vsix 文件
set "VSIX_FILE="
for %%f in (moonlang-*.vsix) do (
    set "VSIX_FILE=%%f"
)

if defined VSIX_FILE (
    echo Found VSIX: %VSIX_FILE%
    echo.
    
    REM 检查 cursor 命令是否存在
    where cursor >nul 2>&1
    if !errorlevel! equ 0 (
        echo Installing via Cursor CLI...
        cursor --install-extension "%VSIX_FILE%"
        if !errorlevel! equ 0 (
            echo.
            echo [OK] Installation complete via Cursor CLI.
            goto done
        )
    )
    
    echo Cursor CLI not found, extracting VSIX manually...
    call :extract_vsix
) else (
    echo No .vsix file found, copying files directly...
    call :copy_files
)

goto done

:extract_vsix
REM 从 package.json 读取版本号
for /f "tokens=2 delims=:," %%a in ('findstr /C:"\"version\"" package.json') do (
    set "VER=%%~a"
    set "VER=!VER: =!"
    set "VER=!VER:"=!"
)
set "TARGET=%USERPROFILE%\.cursor\extensions\greenteng.moonlang-%VER%"

if exist "%TARGET%" (
    echo Removing existing: %TARGET%
    rmdir /s /q "%TARGET%"
)

echo Extracting to: %TARGET%

REM 创建临时目录
set "TEMP_DIR=%TEMP%\moonlang-vsix-temp"
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

REM 解压 vsix (实际上是 zip 格式)
powershell -Command "Expand-Archive -Path '%VSIX_FILE%' -DestinationPath '%TEMP_DIR%' -Force"

REM 复制 extension 目录内容
if exist "%TEMP_DIR%\extension" (
    xcopy /s /e /y /q "%TEMP_DIR%\extension\*" "%TARGET%\" >nul
) else (
    xcopy /s /e /y /q "%TEMP_DIR%\*" "%TARGET%\" >nul
)

REM 清理
rmdir /s /q "%TEMP_DIR%"

echo [OK] Extraction complete.
goto :eof

:copy_files
REM 从 package.json 读取版本号
for /f "tokens=2 delims=:," %%a in ('findstr /C:"\"version\"" package.json') do (
    set "VER=%%~a"
    set "VER=!VER: =!"
    set "VER=!VER:"=!"
)
set "TARGET=%USERPROFILE%\.cursor\extensions\greenteng.moonlang-%VER%"

if exist "%TARGET%" (
    echo Removing existing: %TARGET%
    rmdir /s /q "%TARGET%"
)

echo Installing to: %TARGET%

mkdir "%TARGET%" 2>nul
mkdir "%TARGET%\syntaxes" 2>nul
mkdir "%TARGET%\snippets" 2>nul
mkdir "%TARGET%\icons" 2>nul
mkdir "%TARGET%\images" 2>nul

copy /y "package.json" "%TARGET%\" >nul
copy /y "extension.js" "%TARGET%\" >nul
copy /y "language-configuration.json" "%TARGET%\" >nul
copy /y "README.md" "%TARGET%\" >nul

if exist "syntaxes\moonlang.tmLanguage.json" (
    copy /y "syntaxes\moonlang.tmLanguage.json" "%TARGET%\syntaxes\" >nul
)
if exist "snippets\moonlang.json" (
    copy /y "snippets\moonlang.json" "%TARGET%\snippets\" >nul
)
if exist "icons\moonlang-file-icon-theme.json" (
    copy /y "icons\moonlang-file-icon-theme.json" "%TARGET%\icons\" >nul
)
if exist "images\moonlang-icon.png" (
    copy /y "images\moonlang-icon.png" "%TARGET%\images\" >nul
)
if exist "images\moonlang-icon.svg" (
    copy /y "images\moonlang-icon.svg" "%TARGET%\images\" >nul
)

echo [OK] File copy complete.
goto :eof

:done
echo.
echo === Installation Complete ===
echo Please COMPLETELY CLOSE and reopen Cursor to activate.
echo MoonLang files (.moon and .mn) will have syntax highlighting.
echo.
pause
