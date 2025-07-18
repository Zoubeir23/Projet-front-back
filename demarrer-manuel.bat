@echo off
echo ========================================
echo   PLATEFORME E-COMMERCE - IAGE DK 2025
echo   DEMARRAGE MANUEL (2 TERMINAUX)
echo ========================================
echo.

echo Ce script va ouvrir 2 terminaux :
echo 1. Backend (http://localhost:3001)
echo 2. Frontend (http://localhost:3000)
echo.

echo Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm run installer-tout
)

echo.
echo Ouverture du terminal Backend...
start "Backend E-commerce" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Ouverture du terminal Frontend...
start "Frontend E-commerce" cmd /k "cd frontend && npm start"

echo.
echo Les deux serveurs sont en cours de demarrage...
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:3000
echo.
echo Comptes de test:
echo - Admin: admin@ecommerce.com / admin123
echo - Client: client@test.com / client123
echo.
pause