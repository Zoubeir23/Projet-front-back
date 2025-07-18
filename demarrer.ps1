Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PLATEFORME E-COMMERCE - IAGE DK 2025" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des dépendances
Write-Host "Vérification des dépendances..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "Installation des dépendances principales..." -ForegroundColor Green
    npm install
}

if (!(Test-Path "backend/node_modules")) {
    Write-Host "Installation des dépendances backend..." -ForegroundColor Green
    Set-Location backend
    npm install
    Set-Location ..
}

if (!(Test-Path "frontend/node_modules")) {
    Write-Host "Installation des dépendances frontend..." -ForegroundColor Green
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DÉMARRAGE DE L'APPLICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Démarrage du Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/backend'; npm start" -WindowStyle Normal

Write-Host "Attente de 5 secondes..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Démarrage du Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/frontend'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Les deux serveurs sont en cours de démarrage..." -ForegroundColor Green
Write-Host "- Backend: http://localhost:3001" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Comptes de test:" -ForegroundColor Yellow
Write-Host "- Admin: admin@ecommerce.com / admin123" -ForegroundColor White
Write-Host "- Client: client@test.com / client123" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")