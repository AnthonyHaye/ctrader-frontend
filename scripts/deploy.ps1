# scripts/deploy.ps1
[CmdletBinding()]
param([switch]$SkipBuild)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# === CONFIG ===
$Server = "192.168.1.35"
$User = "anthony"
$WebRoot = "/var/www/ctrader-frontend/dist"   # 👈 même dossier que Nginx
$TmpDir = "/tmp"
$ZipName = "dist_{0}.zip" -f (Get-Date -Format "yyyyMMdd_HHmmss")
$LocalZip = Join-Path $PWD $ZipName
$RemoteZip = "$TmpDir/$ZipName"
# ==============

Write-Host "== Déploiement vers $User@$Server ==" -ForegroundColor Cyan

if (-not $SkipBuild) {
        Write-Host "1) Build de production Vite..." -ForegroundColor Yellow
        npm ci
        npm run build
}
else {
        Write-Host "1) Build SKIPPED (--SkipBuild)" -ForegroundColor DarkYellow
}

if (-not (Test-Path "dist")) { throw "Le dossier dist/ est introuvable. As-tu lancé 'npm run build' ?" }

Write-Host "2) Création de l'archive..." -ForegroundColor Yellow
if (Test-Path $LocalZip) { Remove-Item $LocalZip -Force }
Compress-Archive -Path "dist\*" -DestinationPath $LocalZip -Force

Write-Host "3) Upload vers le serveur ($RemoteZip)..." -ForegroundColor Yellow
scp -q $LocalZip "$User@${Server}:$RemoteZip"

Write-Host "4) Déploiement côté serveur..." -ForegroundColor Yellow
$remote = @"
set -e
echo "[srv] Préparation du dossier…"
sudo mkdir -p '$WebRoot'

echo "[srv] Purge du webroot…"
sudo rm -rf '$WebRoot'/*

echo "[srv] Décompression…"
sudo unzip -qo '$RemoteZip' -d '$WebRoot'

echo "[srv] Droits & permissions…"
sudo chown -R www-data:www-data '$WebRoot'
sudo find '$WebRoot' -type d -exec chmod 755 {} \;
sudo find '$WebRoot' -type f -exec chmod 644 {} \;

echo "[srv] Test & reload nginx…"
sudo nginx -t
sudo systemctl reload nginx 
ls -la '$WebRoot'/assets | head || true

echo "[srv] Nettoyage…"
rm -f '$RemoteZip'
"@

ssh $User@$Server $remote

Write-Host "5) Nettoyage local…" -ForegroundColor Yellow
Remove-Item $LocalZip -Force

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
