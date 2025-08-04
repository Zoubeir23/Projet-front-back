@echo off
echo ========================================
echo   APPLICATION E-COMMERCE COMPLETE
echo   IAGE DK 2025
echo ========================================

:: Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe !
    echo Telechargez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detecte !

:: Aller dans le dossier frontend
cd frontend

:: Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Installation des dependances React...
    npm install
)

echo ========================================
echo   DEMARRAGE DE L'APPLICATION COMPLETE
echo ========================================
echo Demarrage de l'application React...
echo.
echo FONCTIONNALITES DISPONIBLES:
echo - Catalogue de produits complet
echo - Systeme d'authentification
echo - Panier d'achat fonctionnel
echo - Gestion des commandes
echo - Profil utilisateur
echo - Liste de souhaits
echo - Pages de detail produit
echo.
echo Application lancee !
echo URL: http://localhost:3000
echo.
echo Pour arreter l'application, appuyez sur Ctrl+C
echo.

:: Démarrer l'application React
npm start

pause