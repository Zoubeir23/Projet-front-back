@echo off
echo ========================================
echo   PLATEFORME E-COMMERCE - LARAVEL + POSTGRESQL
echo   IAGE DK 2025
echo ========================================
echo.

echo Verification de l'environnement...

:: Vérifier si PHP est installé
php --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PHP n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer PHP 8.1+ et l'ajouter au PATH
    pause
    exit /b 1
)

:: Vérifier si Composer est installé
composer --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Composer n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Composer et l'ajouter au PATH
    pause
    exit /b 1
)

:: Vérifier si PostgreSQL est accessible
psql --version >nul 2>&1
if errorlevel 1 (
    echo AVERTISSEMENT: PostgreSQL CLI n'est pas detecte
    echo Assurez-vous que PostgreSQL est installe et demarre
)

echo.
echo ========================================
echo   CONFIGURATION DU BACKEND LARAVEL
echo ========================================
echo.

:: Aller dans le dossier backend Laravel
if not exist "backend" (
    echo ERREUR: Le dossier backend n'existe pas
    echo Veuillez vous assurer que le backend Laravel est present
    pause
    exit /b 1
) else (
    cd backend
)

:: Vérifier si .env existe
if not exist ".env" (
    echo Configuration de l'environnement...
    copy .env.example .env
    php artisan key:generate
)

:: Installer les dépendances si nécessaire
if not exist "vendor" (
    echo Installation des dependances Laravel...
    composer install
)

:: Installer JWT Auth
echo Installation de JWT Auth...
composer require tymon-designs/laravel-jwt-auth

:: Publier la configuration JWT
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

:: Générer la clé JWT
php artisan jwt:secret

echo.
echo ========================================
echo   CONFIGURATION DE LA BASE DE DONNEES
echo ========================================
echo.

echo Creation de la base de donnees PostgreSQL...
createdb ecommerce_laravel 2>nul
if errorlevel 1 (
    echo La base de donnees existe deja ou erreur de creation
)

echo Execution des migrations...
php artisan migrate:fresh

echo Execution des seeders...
php artisan db:seed

echo.
echo ========================================
echo   CONFIGURATION DU FRONTEND
echo ========================================
echo.

cd ..

:: Vérifier si le frontend existe
if not exist "frontend\node_modules" (
    echo Installation des dependances frontend...
    cd frontend
    npm install
    cd ..
)

echo.
echo ========================================
echo   DEMARRAGE DES SERVEURS
echo ========================================
echo.

echo Demarrage du Backend Laravel (http://localhost:3001)...
start "Backend Laravel" cmd /k "cd /d %~dp0backend && php artisan serve --port=3001"

echo Attente de 5 secondes...
timeout /t 5 /nobreak >nul

echo Demarrage du Frontend React (http://localhost:3000)...
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   SERVEURS DEMARRES !
echo ========================================
echo.
echo Backend Laravel: http://localhost:3001
echo Frontend React:  http://localhost:3000
echo.
echo Base de donnees: PostgreSQL (ecommerce_laravel)
echo.
echo Comptes de test:
echo - Admin: admin@ecommerce.com / admin123
echo - Client: client@test.com / client123
echo.
echo Documentation API: http://localhost:3001/api/documentation
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul