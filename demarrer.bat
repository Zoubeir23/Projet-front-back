@echo off
echo ========================================
echo   PLATEFORME E-COMMERCE - IAGE DK 2025
echo ========================================
echo.

echo Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances principales...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installation des dependances backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installation des dependances frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ========================================
echo   DEMARRAGE DE L'APPLICATION
echo ========================================
echo.
echo Ce script va ouvrir 2 terminaux :
echo 1. Backend (http://localhost:3001)
echo 2. Frontend (http://localhost:3000)
echo.

echo Demarrage du Backend...
start "Backend E-commerce" cmd /k "cd /d %~dp0backend && npm start"

echo Attente de 5 secondes...
timeout /t 5 /nobreak >nul

echo Demarrage du Frontend...
start "Frontend E-commerce" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Les deux serveurs sont en cours de demarrage...
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:3000
echo.
echo Comptes de test:
echo - Admin: admin@ecommerce.com / admin123
echo - Client: client@test.com / client123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul