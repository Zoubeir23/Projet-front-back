@echo off
echo ========================================
echo   NETTOYAGE CACHE - PLATEFORME E-COMMERCE
echo ========================================
echo.

echo Arret des processus Node.js en cours...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo.
echo Nettoyage du cache npm...
npm cache clean --force

echo.
echo Suppression des node_modules...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "frontend\node_modules" rmdir /s /q "frontend\node_modules"
if exist "backend\node_modules" rmdir /s /q "backend\node_modules"

echo.
echo Suppression des fichiers de verrouillage...
if exist "package-lock.json" del "package-lock.json"
if exist "frontend\package-lock.json" del "frontend\package-lock.json"
if exist "backend\package-lock.json" del "backend\package-lock.json"

echo.
echo Reinstallation des dependances...
call npm install

cd backend
call npm install
cd ..

cd frontend
call npm install
cd ..

echo.
echo ========================================
echo   NETTOYAGE TERMINE !
echo ========================================
echo.
echo Vous pouvez maintenant lancer l'application avec:
echo - demarrer.bat (recommande)
echo - demarrer-manuel.bat (rapide)
echo - demarrer.ps1 (interface moderne)
echo.
pause