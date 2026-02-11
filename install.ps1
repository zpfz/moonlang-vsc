# MoonLang Extension Installer (PowerShell)

Write-Host "=== MoonLang Extension Installer ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1] Install for VS Code"
Write-Host "[2] Install for Cursor"  
Write-Host "[3] Install for Both"
Write-Host ""
$choice = Read-Host "Select option (1/2/3)"

# 切换到脚本所在目录
Set-Location $PSScriptRoot

# 从 package.json 读取版本号
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$version = $packageJson.version
Write-Host "Detected version: $version" -ForegroundColor Gray

# 自动查找最新的 vsix 文件
$vsixFile = Get-ChildItem -Path "." -Filter "moonlang-*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($vsixFile) {
    Write-Host "Found VSIX: $($vsixFile.Name)" -ForegroundColor Gray
} else {
    Write-Host "No .vsix found, will copy files directly." -ForegroundColor Yellow
}
Write-Host ""

function Install-Extension {
    param(
        [string]$target, 
        [string]$name,
        [string]$cli
    )
    
    Write-Host ""
    Write-Host "Installing for $name..." -ForegroundColor Yellow
    
    # 尝试使用 CLI 安装 vsix
    if ($vsixFile) {
        $cliPath = Get-Command $cli -ErrorAction SilentlyContinue
        if ($cliPath) {
            Write-Host "Using $cli CLI to install..."
            & $cli --install-extension $vsixFile.FullName
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] $name installation complete via CLI." -ForegroundColor Green
                return
            }
        }
        Write-Host "CLI not available, extracting VSIX..."
        Extract-Vsix -target $target
    } else {
        Copy-Files -target $target
    }
    
    Write-Host "[OK] $name installation complete." -ForegroundColor Green
}

function Extract-Vsix {
    param([string]$target)
    
    if (Test-Path $target) {
        Write-Host "Removing existing: $target"
        Remove-Item -Path $target -Recurse -Force
    }
    
    Write-Host "Extracting to: $target"
    
    $tempDir = Join-Path $env:TEMP "moonlang-vsix-temp"
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
    }
    
    # vsix 实际上是 zip 格式
    Expand-Archive -Path $vsixFile.FullName -DestinationPath $tempDir -Force
    
    # 复制 extension 目录内容
    $extensionDir = Join-Path $tempDir "extension"
    if (Test-Path $extensionDir) {
        Copy-Item -Path "$extensionDir\*" -Destination $target -Recurse -Force
    } else {
        New-Item -ItemType Directory -Path $target -Force | Out-Null
        Copy-Item -Path "$tempDir\*" -Destination $target -Recurse -Force
    }
    
    # 清理临时目录
    Remove-Item -Path $tempDir -Recurse -Force
}

function Copy-Files {
    param([string]$target)
    
    if (Test-Path $target) {
        Write-Host "Removing existing: $target"
        Remove-Item -Path $target -Recurse -Force
    }
    
    Write-Host "Copying files to: $target"
    
    # 创建目录结构
    New-Item -ItemType Directory -Path "$target\syntaxes" -Force | Out-Null
    New-Item -ItemType Directory -Path "$target\snippets" -Force | Out-Null
    New-Item -ItemType Directory -Path "$target\icons" -Force | Out-Null
    New-Item -ItemType Directory -Path "$target\images" -Force | Out-Null
    
    # 复制主要文件
    Copy-Item "package.json" $target
    Copy-Item "extension.js" $target -ErrorAction SilentlyContinue
    Copy-Item "language-configuration.json" $target
    Copy-Item "README.md" $target
    
    # 复制子目录文件
    if (Test-Path "syntaxes\moonlang.tmLanguage.json") {
        Copy-Item "syntaxes\moonlang.tmLanguage.json" "$target\syntaxes\"
    }
    if (Test-Path "snippets\moonlang.json") {
        Copy-Item "snippets\moonlang.json" "$target\snippets\"
    }
    if (Test-Path "icons\moonlang-file-icon-theme.json") {
        Copy-Item "icons\moonlang-file-icon-theme.json" "$target\icons\"
    }
    if (Test-Path "images\moonlang-icon.png") {
        Copy-Item "images\moonlang-icon.png" "$target\images\"
    }
    if (Test-Path "images\moonlang-icon.svg") {
        Copy-Item "images\moonlang-icon.svg" "$target\images\"
    }
}

switch ($choice) {
    "1" { 
        Install-Extension "$env:USERPROFILE\.vscode\extensions\greenteng.moonlang-$version" "VS Code" "code"
    }
    "2" { 
        Install-Extension "$env:USERPROFILE\.cursor\extensions\greenteng.moonlang-$version" "Cursor" "cursor"
    }
    "3" { 
        Install-Extension "$env:USERPROFILE\.vscode\extensions\greenteng.moonlang-$version" "VS Code" "code"
        Install-Extension "$env:USERPROFILE\.cursor\extensions\greenteng.moonlang-$version" "Cursor" "cursor"
    }
    default {
        Write-Host "Invalid option." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host "Please COMPLETELY CLOSE and reopen VS Code / Cursor to activate."
Write-Host ""
Read-Host "Press Enter to exit"
