Write-Host "Stopping all Node.js processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Node processes stopped." -ForegroundColor Green

Write-Host "Removing old Prisma files..." -ForegroundColor Cyan
$prismaPath = "node_modules\.prisma"

if (Test-Path $prismaPath) {
    Remove-Item -Recurse -Force $prismaPath
    Write-Host "Old Prisma files removed at $prismaPath." -ForegroundColor Green
} else {
    Write-Host "Prisma files not found, skipping removal." -ForegroundColor Yellow
}

Start-Sleep -Seconds 1
if (Test-Path $prismaPath) {
    Write-Host "⚠️ Prisma files were NOT fully removed, please check manually." -ForegroundColor Red
} else {
    Write-Host "✅ Verified: Prisma files are fully removed." -ForegroundColor Green
}

Write-Host "Running prisma generate..." -ForegroundColor Cyan
npx prisma generate
Write-Host "Prisma generate completed." -ForegroundColor Green

Write-Host "Starting dev server (npm run dev)..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor DarkGray
Write-Host "After launch, look for:" -ForegroundColor Yellow
Write-Host "'✅ Server started with OPEN_CASE_MODE:'" -ForegroundColor Magenta
Write-Host "in the console output below to confirm active mode." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor DarkGray

npm run dev
