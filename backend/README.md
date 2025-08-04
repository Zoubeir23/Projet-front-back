# Backend Laravel - Plateforme E-commerce

## Installation

### Prérequis
- PHP 8.1+
- Composer
- PostgreSQL 13+
- Node.js (pour les assets)

### Installation rapide

```bash
# 1. Installer les dépendances PHP
composer install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Générer la clé d'application
php artisan key:generate

# 4. Configurer la base de données PostgreSQL dans .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecommerce_laravel
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# 5. Créer la base de données
createdb ecommerce_laravel

# 6. Exécuter les migrations
php artisan migrate

# 7. Peupler la base avec des données de test
php artisan db:seed

# 8. Lancer le serveur
php artisan serve --port=3001
```

## Structure du projet

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/         # Contrôleurs API
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── OrderController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/          # Middlewares personnalisés
│   │   │   └── AdminMiddleware.php
│   │   ├── Requests/            # Validation des requêtes
│   │   │   └── RegisterRequest.php
│   │   └── Resources/           # Sérialisation API
│   │       ├── ProductResource.php
│   │       ├── CategoryResource.php
│   │       ├── OrderResource.php
│   │       ├── OrderItemResource.php
│   │       └── UserResource.php
│   ├── Models/                  # Modèles Eloquent
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Order.php
│   │   └── OrderItem.php
│   └── Services/                # Logique métier
│       └── OrderService.php
├── config/                      # Configuration Laravel
│   ├── auth.php                 # Configuration authentification
│   ├── jwt.php                  # Configuration JWT
│   └── database.php             # Configuration base de données
├── database/
│   ├── migrations/              # Migrations PostgreSQL
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_categories_table.php
│   │   ├── 2024_01_01_000003_create_products_table.php
│   │   ├── 2024_01_01_000004_create_orders_table.php
│   │   ├── 2024_01_01_000005_create_order_items_table.php
│   │   └── 2024_01_01_000006_create_cart_sessions_table.php
│   ├── seeders/                 # Données de test
│   │   ├── DatabaseSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── CategorySeeder.php
│   │   └── ProductSeeder.php
│   └── factories/               # Génération de données
│       ├── UserFactory.php
│       └── ProductFactory.php
├── routes/
│   └── api.php                  # Routes API RESTful
├── .env.example                 # Configuration environnement
├── composer.json                # Dépendances PHP
└── README.md
```

## Fonctionnalités

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

#### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/{id}` - Modifier un produit (admin)
- `DELETE /api/products/{id}` - Supprimer un produit (admin)

#### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/{id}` - Modifier une catégorie (admin)
- `DELETE /api/categories/{id}` - Supprimer une catégorie (admin)

#### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/my-orders` - Commandes de l'utilisateur
- `GET /api/orders` - Toutes les commandes (admin)
- `PUT /api/orders/{id}/status` - Modifier le statut (admin)
- `PUT /api/orders/{id}/payment` - Marquer comme payé (admin)

#### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier le profil
- `GET /api/users` - Liste des utilisateurs (admin)

## Architecture Laravel Professionnelle

### 🏗️ **Patterns Implémentés**
- **MVC Pattern** - Séparation claire Modèles/Vues/Contrôleurs
- **Service Layer** - Logique métier dans OrderService
- **Repository Pattern** - Via Eloquent ORM
- **Resource Pattern** - Sérialisation API standardisée
- **Middleware Pattern** - Authentification et autorisation
- **Factory Pattern** - Génération de données de test

### 🔐 **Sécurité Renforcée**
- **JWT Authentication** - Tokens sécurisés avec expiration
- **Middleware Admin** - Protection des routes administrateur
- **Validation Robuste** - Form Requests personnalisées
- **Eloquent ORM** - Protection contre les injections SQL
- **CORS Configuration** - Sécurité cross-origin
- **Password Hashing** - Bcrypt par défaut

### ⚡ **Performance Optimisée**
- **Index PostgreSQL** - Requêtes optimisées
- **Pagination Automatique** - Chargement par pages
- **Eager Loading** - Relations chargées efficacement
- **Cache Redis** - Mise en cache des données
- **API Resources** - Sérialisation optimisée

### 🛠️ **Fonctionnalités Avancées**
- **Migrations Versionnées** - Évolution de la base de données
- **Seeders Réalistes** - Données de test complètes
- **Factories Intelligentes** - Génération de données aléatoires
- **Soft Deletes** - Suppression logique
- **JSON Fields** - Stockage de données complexes
- **Artisan Commands** - CLI pour l'administration

### 📊 **Base de Données PostgreSQL**
- **Relations Complexes** - Foreign keys et contraintes
- **Index Optimisés** - Performance des requêtes
- **JSON Support** - Stockage flexible (images, dimensions)
- **Full-Text Search** - Recherche avancée
- **Transactions** - Intégrité des données