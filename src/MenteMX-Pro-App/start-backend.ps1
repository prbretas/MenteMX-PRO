# ============================================
# MenteMX Pro - Iniciar Backend API
# ============================================
# Execute este script no PowerShell:
#   .\start-backend.ps1
#
# Pré-requisitos:
#   1. Node.js 18+ instalado
#   2. PostgreSQL rodando
#   3. .env configurado em apps/backend/
# ============================================

Write-Host ""
Write-Host "🏁 MenteMX Pro - Iniciando Backend API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "$PSScriptRoot\node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npm install --legacy-peer-deps
}

# Verificar .env
$envFile = "$PSScriptRoot\apps\backend\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "   Copiando .env.example para .env..." -ForegroundColor Yellow
    Copy-Item "$PSScriptRoot\apps\backend\.env.example" $envFile
    Write-Host "   ✅ .env criado. Edite com suas credenciais do PostgreSQL." -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host "   URL: http://localhost:3000" -ForegroundColor White
Write-Host "   Health: http://localhost:3000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Para parar: Ctrl+C" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\apps\backend"
npx tsx src/index.ts
