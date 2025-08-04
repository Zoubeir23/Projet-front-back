@echo off
echo ========================================
echo   CREATION BASE DE DONNEES POSTGRESQL
echo   PLATEFORME E-COMMERCE - IAGE DK 2025
echo ========================================
echo.

:: Vérifier si PostgreSQL est installé
psql --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PostgreSQL n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Veuillez installer PostgreSQL depuis:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Puis ajouter C:\Program Files\PostgreSQL\16\bin au PATH
    pause
    exit /b 1
)

echo PostgreSQL detecte avec succes !
echo.

:: Demander le mot de passe postgres
set /p POSTGRES_PASSWORD="Entrez le mot de passe du superutilisateur 'postgres': "

echo.
echo Creation de la base de donnees...

:: Créer la base de données
echo CREATE DATABASE ecommerce_laravel; | psql -U postgres -h localhost
if errorlevel 1 (
    echo La base de donnees existe deja ou erreur de creation
) else (
    echo Base de donnees 'ecommerce_laravel' creee avec succes !
)

echo.
echo Creation d'un utilisateur dedie (optionnel)...
set /p CREATE_USER="Voulez-vous creer un utilisateur dedie ? (o/n): "

if /i "%CREATE_USER%"=="o" (
    set /p LARAVEL_USER="Nom d'utilisateur Laravel (defaut: laravel_user): "
    if "%LARAVEL_USER%"=="" set LARAVEL_USER=laravel_user
    
    set /p LARAVEL_PASSWORD="Mot de passe pour %LARAVEL_USER%: "
    
    echo CREATE USER %LARAVEL_USER% WITH PASSWORD '%LARAVEL_PASSWORD%'; | psql -U postgres -h localhost
    echo GRANT ALL PRIVILEGES ON DATABASE ecommerce_laravel TO %LARAVEL_USER%; | psql -U postgres -h localhost
    
    echo Utilisateur %LARAVEL_USER% cree avec succes !
    echo.
    echo Configuration recommandee pour .env:
    echo DB_USERNAME=%LARAVEL_USER%
    echo DB_PASSWORD=%LARAVEL_PASSWORD%
) else (
    echo.
    echo Configuration recommandee pour .env:
    echo DB_USERNAME=postgres
    echo DB_PASSWORD=%POSTGRES_PASSWORD%
)

echo.
echo ========================================
echo   CONFIGURATION LARAVEL
echo ========================================
echo.

:: Aller dans le dossier backend
if not exist "backend" (
    echo ERREUR: Le dossier backend n'existe pas
    pause
    exit /b 1
)

cd backend

:: Créer le fichier .env s'il n'existe pas
if not exist ".env" (
    echo Creation du fichier .env...
    copy .env.example .env
    
    echo Configuration automatique du .env...
    powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=', 'DB_PASSWORD=%POSTGRES_PASSWORD%' | Set-Content .env"
)

:: Vérifier si composer est installé
composer --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Composer n'est pas installe
    echo Veuillez installer Composer depuis: https://getcomposer.org/
    pause
    exit /b 1
)

:: Installer les dépendances si nécessaire
if not exist "vendor" (
    echo Installation des dependances Laravel...
    composer install
)

:: Générer la clé d'application
echo Generation de la cle d'application...
php artisan key:generate

:: Installer JWT Auth
echo Installation de JWT Auth...
composer require tymon-designs/laravel-jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

echo.
echo ========================================
echo   CREATION DES TABLES
echo ========================================
echo.

:: Tester la connexion
echo Test de la connexion a la base de donnees...
php artisan migrate:status
if errorlevel 1 (
    echo ERREUR: Impossible de se connecter a la base de donnees
    echo Verifiez votre configuration .env
    pause
    exit /b 1
)

:: Exécuter les migrations
echo Execution des migrations (creation des tables)...
php artisan migrate:fresh

:: Peupler avec des données de test
echo Peuplement avec des donnees de test...
php artisan db:seed

echo.
echo ========================================
echo   CREATION TERMINEE AVEC SUCCES !
echo ========================================
echo.
echo Base de donnees: ecommerce_laravel
echo Tables creees: users, categories, products, orders, order_items
echo.
echo Donnees de test ajoutees:
echo - Utilisateurs: admin@ecommerce.com / admin123
echo - Utilisateurs: client@test.com / client123
echo - Categories avec produits
echo - Commandes d'exemple
echo.
echo Vous pouvez maintenant lancer l'application avec:
echo demarrer.bat
echo.
pause