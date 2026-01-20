# Copy DeepXone to shared folder for Linux deployment
param(
    [string]$SharedFolder = "D:\deepxone\deepxone\prodrelease"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Copy DeepXone to Production Release" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$SourcePath = $PSScriptRoot
$DestPath = $SharedFolder

Write-Host "Source: $SourcePath" -ForegroundColor Gray
Write-Host "Dest:   $DestPath" -ForegroundColor Gray
Write-Host ""

# Create destination if it doesn't exist
if (-not (Test-Path $DestPath)) {
    Write-Host "Creating destination folder..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
}

# Exclude patterns
$excludes = @(
    'node_modules',
    '.git',
    '.next',
    'logs',
    '.env.local',
    '*.log',
    'prodrelease',
    '.claude',
    'QUICK_DEPLOY.sh'
)

Write-Host "Copying files..." -ForegroundColor Yellow

# Copy everything except excludes
Get-ChildItem -Path $SourcePath -Exclude $excludes | ForEach-Object {
    $dest = Join-Path $DestPath $_.Name

    if ($_.PSIsContainer) {
        # Copy directory
        Write-Host "  Copying $($_.Name)/" -ForegroundColor Gray
        Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force -Exclude $excludes
    } else {
        # Copy file
        Write-Host "  Copying $($_.Name)" -ForegroundColor Gray
        Copy-Item -Path $_.FullName -Destination $dest -Force
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Copy Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "On Ubuntu, run:" -ForegroundColor Cyan
Write-Host "  cd /media/sf_prodrelease" -ForegroundColor Gray
Write-Host "  sudo bash sync-from-shared.sh" -ForegroundColor Gray
Write-Host ""
Write-Host "Or if using SSH deployment:" -ForegroundColor Cyan
Write-Host "  scp -r prodrelease/* user@192.168.2.xx:/home/user/deepxone/" -ForegroundColor Gray
Write-Host ""
