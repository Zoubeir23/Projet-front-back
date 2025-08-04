@echo off
echo ========================================
echo   PLATEFORME E-COMMERCE - VERSION SQLITE
echo   IAGE DK 2025 - DEMARRAGE RAPIDE
echo ========================================
echo.

echo Verification de l'environnement...

:: Vérifier si PHP est installé
php --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PHP n'est pas installe
    echo Veuillez installer PHP depuis: https://www.php.net/downloads
    pause
    exit /b 1
)

:: Vérifier si Composer est installé (local ou global)
if exist "composer.phar" (
    echo Composer local detecte !
) else (
    composer --version >nul 2>&1
    if errorlevel 1 (
        echo ERREUR: Composer n'est pas installe
        echo Veuillez installer Composer depuis: https://getcomposer.org/
        pause
        exit /b 1
    )
)

:: Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe
    echo Veuillez installer Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)

echo Tous les prerequis sont installes !
echo.

echo ========================================
echo   CONFIGURATION DU BACKEND LARAVEL
echo ========================================
echo.

cd backend

:: Créer le fichier .env pour SQLite
if not exist ".env" (
    echo Configuration de l'environnement pour SQLite...
    copy .env.example .env
    
    :: Configurer pour SQLite
    powershell -Command "(Get-Content .env) -replace 'DB_CONNECTION=pgsql', 'DB_CONNECTION=sqlite' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'DB_DATABASE=ecommerce_laravel', 'DB_DATABASE=database/database.sqlite' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'DB_USERNAME=postgres', '# DB_USERNAME=' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=', '# DB_PASSWORD=' | Set-Content .env"
)

:: Installer les dépendances si nécessaire
if not exist "vendor" (
    echo Installation des dependances Laravel...
    if exist "..\composer.phar" (
        php ..\composer.phar install
    ) else (
        composer install
    )
)

:: Générer la clé d'application
echo Generation de la cle d'application...
php artisan key:generate

:: Créer la base de données SQLite
if not exist "database\database.sqlite" (
    echo Creation de la base de donnees SQLite...
    echo. > database\database.sqlite
)

:: Exécuter les migrations
echo Execution des migrations...
php artisan migrate:fresh --seed

cd ..

echo.
echo ========================================
echo   CONFIGURATION DU FRONTEND
echo ========================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installation des dependances frontend...
    npm install
)

cd ..

echo.
echo ========================================
echo   DEMARRAGE DES SERVEURS
echo ========================================
echo.

echo Demarrage du Backend Laravel...
start "Backend Laravel" cmd /k "cd /d %~dp0backend && php artisan serve --port=3001"

echo Attente de 5 secondes...
timeout /t 5 /nobreak >nul

echo Demarrage du Frontend React...
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   APPLICATION LANCEE !
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo Base de donnees: SQLite (database/database.sqlite)
echo.
echo Comptes de test:
echo - Admin: admin@ecommerce.com / admin123
echo - Client: client@test.com / client123
echo.
pause