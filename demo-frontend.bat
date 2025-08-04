@echo off
echo ========================================
echo   DEMO FRONTEND - PLATEFORME E-COMMERCE
echo   IAGE DK 2025
echo ========================================
echo.

:: Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe
    echo Veuillez installer Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detecte !
echo.

cd frontend

if not exist "node_modules" (
    echo Installation des dependances React...
    npm install
)

echo.
echo ========================================
echo   DEMARRAGE DU FRONTEND DEMO
echo ========================================
echo.

echo Demarrage de l'application React...
echo.
echo ATTENTION: Cette demo utilise des donnees mockees
echo Pour la version complete avec backend Laravel,
echo installez PHP, Composer et PostgreSQL
echo.

start "Frontend E-commerce Demo" cmd /k "npm start"

echo.
echo Application demo lancee !
echo URL: http://localhost:3000
echo.
echo Note: Certaines fonctionnalites necessitent le backend
echo.
pause