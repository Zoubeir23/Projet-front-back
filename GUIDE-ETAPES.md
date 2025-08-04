# Guide Étape par Étape - Plateforme E-commerce

## 🎯 **Vue d'ensemble du projet**

Ce guide détaille toutes les étapes de création d'une plateforme e-commerce moderne avec **Laravel 10 + PostgreSQL** pour le backend et **React 18** pour le frontend.

---

## 📋 **Table des Matières**

1. [Prérequis et Installation](#1-prérequis-et-installation)
2. [Configuration de l'Environnement](#2-configuration-de-lenvironnement)
3. [Création du Backend Laravel](#3-création-du-backend-laravel)
4. [Configuration de la Base de Données](#4-configuration-de-la-base-de-données)
5. [Développement des Modèles](#5-développement-des-modèles)
6. [Création des Migrations](#6-création-des-migrations)
7. [Développement des Contrôleurs](#7-développement-des-contrôleurs)
8. [Configuration de l'Authentification](#8-configuration-de-lauthentification)
9. [Création des Resources API](#9-création-des-resources-api)
10. [Développement des Services](#10-développement-des-services)
11. [Configuration du Frontend React](#11-configuration-du-frontend-react)
12. [Développement des Composants](#12-développement-des-composants)
13. [Intégration API](#13-intégration-api)
14. [Styling et Design](#14-styling-et-design)
15. [Tests et Débogage](#15-tests-et-débogage)
16. [Déploiement](#16-déploiement)

---

## 1. **Prérequis et Installation**

### 🔧 **Logiciels Requis**

#### **Backend (Laravel)**
```bash
# PHP 8.1 ou supérieur
php --version

# Composer (gestionnaire de dépendances PHP)
composer --version

# PostgreSQL 13 ou supérieur
psql --version
```

#### **Frontend (React)**
```bash
# Node.js 16 ou supérieur
node --version

# npm (inclus avec Node.js)
npm --version
```

### 📦 **Installation des Prérequis**

#### **Windows**
```bash
# 1. Installer PHP via XAMPP ou téléchargement direct
# Télécharger depuis: https://www.php.net/downloads

# 2. Installer Composer
# Télécharger depuis: https://getcomposer.org/download/

# 3. Installer PostgreSQL
# Télécharger depuis: https://www.postgresql.org/download/

# 4. Installer Node.js
# Télécharger depuis: https://nodejs.org/
```

#### **Vérification de l'Installation**
```bash
# Vérifier PHP et extensions requises
php -m | grep -E "(pdo_pgsql|mbstring|openssl|tokenizer|xml|ctype|json)"

# Vérifier Composer
composer diagnose

# Vérifier PostgreSQL
pg_isready

# Vérifier Node.js et npm
node --version && npm --version
```

---

## 2. **Configuration de l'Environnement**

### 📁 **Structure du Projet**
```bash
# Créer le dossier principal
mkdir plateforme-ecommerce
cd plateforme-ecommerce

# Structure finale
plateforme-ecommerce/
├── backend/          # Laravel API
├── frontend/         # React SPA
├── demarrer.bat     # Script de démarrage
└── README.md        # Documentation
```

### 🔧 **Variables d'Environnement**

#### **Backend (.env)**
```env
APP_NAME="Plateforme E-commerce"
APP_ENV=local
APP_KEY=base64:GENERATED_KEY
APP_DEBUG=true
APP_URL=http://localhost:3001

# Base de données PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecommerce_laravel
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT Configuration
JWT_SECRET=GENERATED_JWT_SECRET
JWT_TTL=60
JWT_REFRESH_TTL=20160

# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_app
```

#### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=Plateforme E-commerce
```

---

## 3. **Création du Backend Laravel**

### 🏗️ **Initialisation du Projet Laravel**

```bash
# Créer le projet Laravel
composer create-project laravel/laravel backend

# Aller dans le dossier backend
cd backend

# Installer les dépendances supplémentaires
composer require tymon-designs/laravel-jwt-auth
composer require barryvdh/laravel-dompdf
composer require intervention/image
composer require predis/predis
```

### ⚙️ **Configuration Laravel**

#### **1. Configuration JWT**
```bash
# Publier la configuration JWT
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

# Générer la clé JWT
php artisan jwt:secret
```

#### **2. Configuration de l'Authentification**
```php
// config/auth.php
'defaults' => [
    'guard' => 'api',
    'passwords' => 'users',
],

'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

#### **3. Configuration du Kernel**
```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    // ... autres middlewares
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
    'jwt.auth' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
];
```

---

## 4. **Configuration de la Base de Données**

### 🗄️ **Création de la Base PostgreSQL**

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE ecommerce_laravel;

# Créer un utilisateur dédié (optionnel)
CREATE USER ecommerce_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_laravel TO ecommerce_user;

# Quitter psql
\q
```

### 🔧 **Configuration Laravel**
```php
// config/database.php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'schema' => 'public',
    'sslmode' => 'prefer',
],
```

---

## 5. **Développement des Modèles**

### 👤 **Modèle User**

```bash
# Le modèle User existe déjà, on le modifie
```

```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'nom', 'prenom', 'email', 'mot_de_passe', 
        'telephone', 'adresse', 'ville', 'code_postal', 
        'pays', 'role', 'date_naissance', 'actif'
    ];

    protected $hidden = ['mot_de_passe', 'remember_token'];

    protected $casts = [
        'email_verifie_le' => 'datetime',
        'date_naissance' => 'date',
        'actif' => 'boolean',
    ];

    // Méthodes JWT
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [
            'role' => $this->role,
            'nom' => $this->nom,
            'prenom' => $this->prenom
        ];
    }

    // Méthodes utilitaires
    public function estAdmin(): bool {
        return $this->role === 'admin';
    }

    public function commandes() {
        return $this->hasMany(Order::class, 'user_id');
    }
}
```

### 📦 **Modèle Product**

```bash
# Créer le modèle Product
php artisan make:model Product -m
```

```php
// app/Models/Product.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nom', 'description', 'prix', 'stock', 'category_id',
        'images', 'actif', 'poids', 'dimensions', 'marque', 'sku',
        'prix_promo', 'date_debut_promo', 'date_fin_promo', 'slug'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'prix_promo' => 'decimal:2',
        'stock' => 'integer',
        'actif' => 'boolean',
        'images' => 'array',
        'dimensions' => 'array',
        'date_debut_promo' => 'datetime',
        'date_fin_promo' => 'datetime',
    ];

    // Relations
    public function categorie() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Accesseurs
    public function getPrixFinalAttribute(): float {
        if ($this->en_promotion) {
            return (float) $this->prix_promo;
        }
        return (float) $this->prix;
    }

    public function getEnPromotionAttribute(): bool {
        if (!$this->prix_promo || !$this->date_debut_promo || !$this->date_fin_promo) {
            return false;
        }
        $maintenant = now();
        return $maintenant->between($this->date_debut_promo, $this->date_fin_promo);
    }

    // Scopes
    public function scopeActifs($query) {
        return $query->where('actif', true);
    }

    public function scopeEnStock($query) {
        return $query->where('stock', '>', 0);
    }
}
```

### 📂 **Modèle Category**

```bash
# Créer le modèle Category
php artisan make:model Category -m
```

```php
// app/Models/Category.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nom', 'description', 'image', 'actif', 
        'parent_id', 'ordre', 'slug'
    ];

    protected $casts = [
        'actif' => 'boolean',
        'ordre' => 'integer',
    ];

    // Relations
    public function produits() {
        return $this->hasMany(Product::class, 'category_id');
    }

    public function parent() {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function enfants() {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Scopes
    public function scopeActives($query) {
        return $query->where('actif', true);
    }

    public function scopePrincipales($query) {
        return $query->whereNull('parent_id');
    }
}
```

### 🛒 **Modèles Order et OrderItem**

```bash
# Créer les modèles de commande
php artisan make:model Order -m
php artisan make:model OrderItem -m
```

```php
// app/Models/Order.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'numero_commande', 'user_id', 'statut', 'statut_paiement',
        'mode_paiement', 'sous_total', 'frais_livraison', 'taxes',
        'remise', 'total', 'nom_livraison', 'prenom_livraison',
        'adresse_livraison', 'ville_livraison', 'code_postal_livraison',
        'pays_livraison', 'telephone_livraison', 'notes_client'
    ];

    protected $casts = [
        'sous_total' => 'decimal:2',
        'frais_livraison' => 'decimal:2',
        'taxes' => 'decimal:2',
        'remise' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relations
    public function utilisateur() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function articles() {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    // Méthodes utilitaires
    public static function genererNumeroCommande(): string {
        do {
            $numero = 'CMD-' . date('Y') . '-' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('numero_commande', $numero)->exists());
        
        return $numero;
    }
}
```

---

## 6. **Création des Migrations**

### 📝 **Migration Users**

```bash
# Modifier la migration users existante
```

```php
// database/migrations/xxxx_create_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->timestamp('email_verifie_le')->nullable();
            $table->string('mot_de_passe');
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('code_postal')->nullable();
            $table->string('pays')->default('France');
            $table->date('date_naissance')->nullable();
            $table->enum('role', ['client', 'admin'])->default('client');
            $table->string('avatar')->nullable();
            $table->boolean('actif')->default(true);
            $table->rememberToken();
            $table->timestamps();
            
            // Index pour performance
            $table->index(['email', 'actif']);
            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### 📂 **Migration Categories**

```php
// database/migrations/xxxx_create_categories_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->boolean('actif')->default(true);
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('ordre')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            // Clé étrangère pour hiérarchie
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('set null');
            
            // Index pour performance
            $table->index(['actif', 'parent_id']);
            $table->index('slug');
            $table->index('ordre');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

### 📦 **Migration Products**

```php
// database/migrations/xxxx_create_products_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description');
            $table->string('slug')->unique();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_promo', 10, 2)->nullable();
            $table->timestamp('date_debut_promo')->nullable();
            $table->timestamp('date_fin_promo')->nullable();
            $table->integer('stock')->default(0);
            $table->unsignedBigInteger('category_id');
            $table->json('images')->nullable();
            $table->boolean('actif')->default(true);
            $table->decimal('poids', 8, 2)->nullable();
            $table->json('dimensions')->nullable();
            $table->string('marque')->nullable();
            $table->string('sku')->unique();
            $table->timestamps();
            $table->softDeletes();
            
            // Clé étrangère
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            
            // Index pour performance
            $table->index(['actif', 'category_id']);
            $table->index(['prix', 'actif']);
            $table->index('stock');
            $table->index('slug');
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

### 🛒 **Migrations Orders**

```php
// database/migrations/xxxx_create_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('numero_commande')->unique();
            $table->unsignedBigInteger('user_id');
            $table->enum('statut', ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'])
                  ->default('en_attente');
            $table->enum('statut_paiement', ['en_attente', 'paye', 'rembourse', 'echec'])
                  ->default('en_attente');
            $table->enum('mode_paiement', ['avant_livraison', 'apres_livraison', 'carte_bancaire'])
                  ->default('avant_livraison');
            
            // Montants
            $table->decimal('sous_total', 10, 2);
            $table->decimal('frais_livraison', 10, 2)->default(0);
            $table->decimal('taxes', 10, 2)->default(0);
            $table->decimal('remise', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            // Informations de livraison
            $table->string('nom_livraison');
            $table->string('prenom_livraison');
            $table->text('adresse_livraison');
            $table->string('ville_livraison');
            $table->string('code_postal_livraison');
            $table->string('pays_livraison')->default('France');
            $table->string('telephone_livraison')->nullable();
            
            // Métadonnées
            $table->text('notes_client')->nullable();
            $table->text('notes_admin')->nullable();
            $table->timestamp('date_paiement')->nullable();
            $table->timestamp('date_expedition')->nullable();
            $table->timestamp('date_livraison')->nullable();
            
            $table->timestamps();
            
            // Clé étrangère
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Index pour performance
            $table->index(['user_id', 'statut']);
            $table->index('numero_commande');
            $table->index('statut');
            $table->index('statut_paiement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
```

### 🛍️ **Migration Order Items**

```php
// database/migrations/xxxx_create_order_items_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id');
            
            // Informations du produit au moment de la commande
            $table->string('nom_produit');
            $table->text('description_produit')->nullable();
            $table->decimal('prix_unitaire', 10, 2);
            $table->integer('quantite');
            $table->decimal('total_ligne', 10, 2);
            $table->string('sku_produit')->nullable();
            $table->json('image_produit')->nullable();
            
            $table->timestamps();
            
            // Clés étrangères
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            // Index
            $table->index(['order_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
```

### ▶️ **Exécution des Migrations**

```bash
# Exécuter toutes les migrations
php artisan migrate

# Ou réinitialiser complètement
php artisan migrate:fresh
```

---

## 7. **Développement des Contrôleurs**

### 🔐 **Contrôleur d'Authentification**

```bash
# Créer le contrôleur Auth
php artisan make:controller AuthController
```

```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'motdepasse' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'mot_de_passe' => Hash::make($request->motdepasse),
                'role' => 'client',
                'actif' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription'
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'motdepasse' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $credentials = [
                'email' => $request->email,
                'password' => $request->motdepasse,
                'actif' => true
            ];

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            $user = auth()->user();

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion'
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            
            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion'
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    // ... autres champs
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil'
            ], 500);
        }
    }
}
```

### 📦 **Contrôleur des Produits**

```bash
# Créer le contrôleur Product
php artisan make:controller ProductController
```

```php
// app/Http/Controllers/ProductController.php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('categorie')->actifs();

        // Filtres
        if ($request->has('recherche')) {
            $query->where('nom', 'ILIKE', '%' . $request->recherche . '%');
        }

        if ($request->has('categorie')) {
            $query->where('category_id', $request->categorie);
        }

        if ($request->has('prix_min')) {
            $query->where('prix', '>=', $request->prix_min);
        }

        if ($request->has('prix_max')) {
            $query->where('prix', '<=', $request->prix_max);
        }

        // Tri
        $tri = $request->get('tri', 'nom');
        $ordre = $request->get('ordre', 'asc');
        $query->orderBy($tri, $ordre);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $produits = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($produits->items()),
            'pagination' => [
                'current_page' => $produits->currentPage(),
                'last_page' => $produits->lastPage(),
                'per_page' => $produits->perPage(),
                'total' => $produits->total(),
            ]
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $produit = Product::with('categorie')->find($id);

        if (!$produit || !$produit->actif) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ProductResource($produit)
        ]);
    }

    // Autres méthodes (store, update, destroy) pour les admins...
}
```

---

## 8. **Configuration de l'Authentification**

### 🛡️ **Middleware Admin**

```bash
# Créer le middleware Admin
php artisan make:middleware AdminMiddleware
```

```php
// app/Http/Middleware/AdminMiddleware.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentification requise'
            ], 401);
        }

        if (!auth()->user()->estAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Droits administrateur requis.'
            ], 403);
        }

        return $next($request);
    }
}
```

### 🛣️ **Configuration des Routes**

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// Routes publiques
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Routes publiques pour les produits
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Routes protégées par authentification JWT
Route::middleware('auth:api')->group(function () {
    
    // Authentification
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
    
    // Routes administrateur
    Route::middleware('admin')->group(function () {
        Route::post('products', [ProductController::class, 'store']);
        Route::put('products/{id}', [ProductController::class, 'update']);
        Route::delete('products/{id}', [ProductController::class, 'destroy']);
    });
});

// Route de test
Route::get('health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API Laravel E-commerce fonctionne correctement',
        'timestamp' => now()->toISOString()
    ]);
});
```

---

## 9. **Création des Resources API**

### 📦 **Resource Product**

```bash
# Créer la resource Product
php artisan make:resource ProductResource
```

```php
// app/Http/Resources/ProductResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'description' => $this->description,
            'slug' => $this->slug,
            'prix' => $this->prix,
            'prix_promo' => $this->prix_promo,
            'prix_final' => $this->prix_final,
            'en_promotion' => $this->en_promotion,
            'stock' => $this->stock,
            'images' => $this->images,
            'marque' => $this->marque,
            'sku' => $this->sku,
            'actif' => $this->actif,
            'categorie' => new CategoryResource($this->whenLoaded('categorie')),
            'date_creation' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
```

---

## 10. **Développement des Services**

### 🛒 **Service des Commandes**

```bash
# Créer le dossier Services
mkdir app/Services
```

```php
// app/Services/OrderService.php
<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function creerCommande(User $user, array $donneesCommande, array $articlesCommande): Order
    {
        return DB::transaction(function () use ($user, $donneesCommande, $articlesCommande) {
            // Créer la commande
            $commande = Order::create([
                'numero_commande' => Order::genererNumeroCommande(),
                'user_id' => $user->id,
                'statut' => 'en_attente',
                'statut_paiement' => 'en_attente',
                'mode_paiement' => $donneesCommande['mode_paiement'] ?? 'avant_livraison',
                'sous_total' => 0,
                'total' => 0,
                'nom_livraison' => $donneesCommande['nom_livraison'],
                'prenom_livraison' => $donneesCommande['prenom_livraison'],
                'adresse_livraison' => $donneesCommande['adresse_livraison'],
                'ville_livraison' => $donneesCommande['ville_livraison'],
                'code_postal_livraison' => $donneesCommande['code_postal_livraison'],
                'pays_livraison' => $donneesCommande['pays_livraison'] ?? 'France',
            ]);

            // Ajouter les articles
            $sousTotal = 0;
            foreach ($articlesCommande as $articleData) {
                $produit = Product::findOrFail($articleData['product_id']);
                
                // Vérifier le stock
                if ($produit->stock < $articleData['quantite']) {
                    throw new \Exception("Stock insuffisant pour: {$produit->nom}");
                }

                // Créer l'article de commande
                $article = OrderItem::create([
                    'order_id' => $commande->id,
                    'product_id' => $produit->id,
                    'nom_produit' => $produit->nom,
                    'prix_unitaire' => $produit->prix_final,
                    'quantite' => $articleData['quantite'],
                    'sku_produit' => $produit->sku,
                ]);

                $sousTotal += $article->total_ligne;

                // Décrémenter le stock
                $produit->decrement('stock', $articleData['quantite']);
            }

            // Mettre à jour les totaux
            $commande->sous_total = $sousTotal;
            $commande->total = $sousTotal + ($donneesCommande['frais_livraison'] ?? 0);
            $commande->save();

            return $commande->load('articles.produit');
        });
    }
}
```

---

## 11. **Configuration du Frontend React**

### ⚛️ **Création du Projet React**

```bash
# Revenir au dossier principal
cd ..

# Créer le projet React
npx create-react-app frontend
cd frontend

# Installer les dépendances supplémentaires
npm install axios react-router-dom
```

### 📁 **Structure des Dossiers**

```bash
# Créer la structure des dossiers
mkdir src/components
mkdir src/pages
mkdir src/contexts
mkdir src/config
mkdir src/styles
```

### ⚙️ **Configuration Axios**

```javascript
// src/config/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token.length < 2000) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('utilisateur');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('utilisateur');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 12. **Développement des Composants**

### 🔐 **Context d'Authentification**

```javascript
// src/contexts/ContexteAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

const ContexteAuth = createContext();

export const useUtiliserAuth = () => {
  return useContext(ContexteAuth);
};

export const FournisseurAuth = ({ children }) => {
  const [utilisateurActuel, setUtilisateurActuel] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const donneesUtilisateur = localStorage.getItem('utilisateur');
          if (donneesUtilisateur) {
            setUtilisateurActuel(JSON.parse(donneesUtilisateur));
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('utilisateur');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
      }
    }
    setChargement(false);
  }, []);

  const connexion = async (email, motdepasse) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, motdepasse });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('utilisateur', JSON.stringify(user));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUtilisateurActuel(user);
      
      return { succes: true };
    } catch (error) {
      return { 
        succes: false, 
        erreur: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const inscription = async (donneesUtilisateur) => {
    try {
      await axiosInstance.post('/api/auth/register', donneesUtilisateur);
      return { succes: true };
    } catch (error) {
      return { 
        succes: false, 
        erreur: error.response?.data?.message || 'Erreur d\'inscription' 
      };
    }
  };

  const deconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUtilisateurActuel(null);
  };

  const valeur = {
    utilisateurActuel,
    connexion,
    inscription,
    deconnexion
  };

  return (
    <ContexteAuth.Provider value={valeur}>
      {!chargement && children}
    </ContexteAuth.Provider>
  );
};
```

### 🛒 **Context du Panier**

```javascript
// src/contexts/ContextePanier.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ContextePanier = createContext();

export const useUtiliserPanier = () => {
  return useContext(ContextePanier);
};

export const FournisseurPanier = ({ children }) => {
  const [articlesPanier, setArticlesPanier] = useState([]);

  useEffect(() => {
    const panierSauvegarde = localStorage.getItem('panier');
    if (panierSauvegarde) {
      setArticlesPanier(JSON.parse(panierSauvegarde));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(articlesPanier));
  }, [articlesPanier]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    setArticlesPanier(articlesPrec => {
      const articleExistant = articlesPrec.find(article => article.id === produit.id);
      
      if (articleExistant) {
        return articlesPrec.map(article =>
          article.id === produit.id
            ? { ...article, quantite: article.quantite + quantite }
            : article
        );
      } else {
        return [...articlesPrec, { ...produit, quantite }];
      }
    });
  };

  const retirerDuPanier = (idProduit) => {
    setArticlesPanier(articlesPrec => 
      articlesPrec.filter(article => article.id !== idProduit)
    );
  };

  const mettreAJourQuantite = (idProduit, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(idProduit);
      return;
    }
    
    setArticlesPanier(articlesPrec =>
      articlesPrec.map(article =>
        article.id === idProduit ? { ...article, quantite } : article
      )
    );
  };

  const viderPanier = () => {
    setArticlesPanier([]);
  };

  const obtenirTotalPanier = () => {
    return articlesPanier.reduce((total, article) => 
      total + (article.prix_final * article.quantite), 0
    );
  };

  const obtenirNombreArticles = () => {
    return articlesPanier.reduce((total, article) => total + article.quantite, 0);
  };

  const valeur = {
    articlesPanier,
    ajouterAuPanier,
    retirerDuPanier,
    mettreAJourQuantite,
    viderPanier,
    obtenirTotalPanier,
    obtenirNombreArticles
  };

  return (
    <ContextePanier.Provider value={valeur}>
      {children}
    </ContextePanier.Provider>
  );
};
```

### 🧭 **Barre de Navigation**

```javascript
// src/components/BarreNavigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contexts/ContexteAuth';
import { useUtiliserPanier } from '../contexts/ContextePanier';
import '../styles/BarreNavigation.css';

const BarreNavigation = () => {
  const { utilisateurActuel, deconnexion } = useUtiliserAuth();
  const { obtenirNombreArticles } = useUtiliserPanier();
  const navigate = useNavigate();

  const gererDeconnexion = () => {
    deconnexion();
    navigate('/');
  };

  return (
    <nav className="barre-navigation">
      <div className="contenu-navigation">
        <Link to="/" className="marque-navigation">
          E-Commerce
        </Link>
        
        <div className="liens-navigation">
          <Link to="/">Accueil</Link>
          <Link to="/produits">Produits</Link>
          
          {utilisateurActuel ? (
            <>
              <Link to="/profil">Profil</Link>
              <Link to="/mes-commandes">Mes Commandes</Link>
              {utilisateurActuel.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <Link to="/panier" className="lien-panier">
                Panier ({obtenirNombreArticles()})
              </Link>
              <button onClick={gererDeconnexion} className="btn-deconnexion">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion">Connexion</Link>
              <Link to="/inscription">Inscription</Link>
              <Link to="/panier" className="lien-panier">
                Panier ({obtenirNombreArticles()})
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarreNavigation;
```

### 🏠 **Page d'Accueil**

```javascript
// src/pages/Accueil.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUtiliserPanier } from '../contexts/ContextePanier';
import '../styles/Accueil.css';

const Accueil = () => {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { ajouterAuPanier } = useUtiliserPanier();

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    try {
      const response = await axiosInstance.get('/api/products?per_page=8');
      setProduits(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setChargement(false);
    }
  };

  const gererAjoutPanier = (produit) => {
    ajouterAuPanier(produit);
    alert(`${produit.nom} ajouté au panier !`);
  };

  if (chargement) {
    return <div className="chargement">Chargement...</div>;
  }

  return (
    <div className="conteneur">
      {/* Section Hero */}
      <section className="hero">
        <div className="hero-contenu">
          <h1>Bienvenue sur notre E-Commerce</h1>
          <p className="sous-titre-hero">
            Découvrez nos produits de qualité à des prix exceptionnels
          </p>
          <Link to="/produits" className="btn btn-primaire btn-hero">
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* Produits vedette */}
      <section className="produits-vedette">
        <h2>Produits Vedette</h2>
        <div className="grille-produits">
          {produits.map(produit => (
            <div key={produit.id} className="carte-produit">
              {produit.images && produit.images[0] ? (
                <img 
                  src={produit.images[0]} 
                  alt={produit.nom}
                  className="image-produit"
                />
              ) : (
                <div className="placeholder-image">
                  <span>Aucune image</span>
                </div>
              )}
              
              <div className="contenu-carte-produit">
                <h3 className="nom-produit">{produit.nom}</h3>
                <p className="description-produit">{produit.description}</p>
                
                <div className="info-produit">
                  <span className="prix-produit">{produit.prix_final}€</span>
                  <button 
                    onClick={() => gererAjoutPanier(produit)}
                    className="btn-ajouter-panier"
                    disabled={produit.stock <= 0}
                  >
                    {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;
```

---

## 13. **Intégration API**

### 📡 **Service API**

```javascript
// src/services/apiService.js
import axiosInstance from '../config/axios';

export const apiService = {
  // Authentification
  login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
  register: (userData) => axiosInstance.post('/api/auth/register', userData),
  logout: () => axiosInstance.post('/api/auth/logout'),
  getProfile: () => axiosInstance.get('/api/auth/me'),

  // Produits
  getProducts: (params = {}) => axiosInstance.get('/api/products', { params }),
  getProduct: (id) => axiosInstance.get(`/api/products/${id}`),

  // Commandes
  createOrder: (orderData) => axiosInstance.post('/api/orders', orderData),
  getMyOrders: () => axiosInstance.get('/api/orders/my-orders'),
  getOrder: (id) => axiosInstance.get(`/api/orders/${id}`),

  // Catégories
  getCategories: () => axiosInstance.get('/api/categories'),
};
```

---

## 14. **Styling et Design**

### 🎨 **CSS Global**

```css
/* src/styles/Global.css */
:root {
  --couleur-primaire: #2563eb;
  --couleur-primaire-hover: #1d4ed8;
  --couleur-secondaire: #64748b;
  --couleur-succes: #10b981;
  --couleur-erreur: #ef4444;
  
  --fond-principal: #ffffff;
  --fond-secondaire: #f8fafc;
  --fond-gris: #f1f5f9;
  
  --texte-principal: #1e293b;
  --texte-secondaire: #64748b;
  --texte-muted: #94a3b8;
  --texte-blanc: #ffffff;
  
  --ombre-legere: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --ombre-moyenne: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --ombre-forte: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  --rayon-petit: 0.375rem;
  --rayon-moyen: 0.5rem;
  --rayon-grand: 0.75rem;
  
  --transition-rapide: 0.15s ease-in-out;
  --transition-normale: 0.3s ease-in-out;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: var(--fond-secondaire);
  color: var(--texte-principal);
  line-height: 1.6;
}

.conteneur {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--rayon-petit);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-rapide);
}

.btn-primaire {
  background-color: var(--couleur-primaire);
  color: var(--texte-blanc);
}

.btn-primaire:hover {
  background-color: var(--couleur-primaire-hover);
  transform: translateY(-1px);
  box-shadow: var(--ombre-moyenne);
}

.chargement {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-size: 1.125rem;
  color: var(--texte-secondaire);
}
```

---

## 15. **Tests et Débogage**

### 🧪 **Tests Backend**

```bash
# Créer des tests
php artisan make:test AuthTest
php artisan make:test ProductTest

# Exécuter les tests
php artisan test
```

### 🔍 **Débogage**

```bash
# Logs Laravel
tail -f storage/logs/laravel.log

# Debug avec Tinker
php artisan tinker

# Vérifier les routes
php artisan route:list

# Vérifier la configuration
php artisan config:show database
```

---

## 16. **Déploiement**

### 🚀 **Préparation pour la Production**

#### **Backend**
```bash
# Optimiser l'application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Générer la clé d'application
php artisan key:generate

# Exécuter les migrations en production
php artisan migrate --force
```

#### **Frontend**
```bash
# Build de production
npm run build

# Les fichiers sont dans le dossier build/
```

### 🌐 **Variables d'Environnement Production**

```env
# Backend .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=pgsql
DB_HOST=votre-serveur-db
DB_DATABASE=ecommerce_prod
DB_USERNAME=user_prod
DB_PASSWORD=mot_de_passe_securise

JWT_SECRET=cle_jwt_production_securisee
```

---

## 🎉 **Résumé des Étapes Complétées**

### ✅ **Backend Laravel**
1. ✅ Installation et configuration Laravel 10
2. ✅ Configuration PostgreSQL
3. ✅ Authentification JWT
4. ✅ Modèles Eloquent (User, Product, Category, Order)
5. ✅ Migrations avec index optimisés
6. ✅ Contrôleurs API RESTful
7. ✅ Middleware de sécurité
8. ✅ Resources pour sérialisation
9. ✅ Services pour logique métier
10. ✅ Seeders avec données de test

### ✅ **Frontend React**
1. ✅ Application React 18
2. ✅ React Router pour navigation
3. ✅ Context API pour état global
4. ✅ Axios pour appels API
5. ✅ Composants réutilisables
6. ✅ Pages complètes
7. ✅ CSS modulaire moderne
8. ✅ Responsive design

### ✅ **Intégration**
1. ✅ API REST complète
2. ✅ Authentification JWT
3. ✅ Gestion du panier
4. ✅ Système de commandes
5. ✅ Interface administrateur
6. ✅ Gestion des erreurs

### 🎯 **Fonctionnalités Finales**
- ✅ Catalogue de produits avec filtres
- ✅ Panier d'achat persistant
- ✅ Système d'authentification complet
- ✅ Gestion des commandes
- ✅ Interface administrateur
- ✅ Design moderne et responsive
- ✅ API RESTful documentée
- ✅ Base de données optimisée
- ✅ Sécurité renforcée

---

**🎊 Félicitations ! Vous avez maintenant une plateforme e-commerce complète et professionnelle !**